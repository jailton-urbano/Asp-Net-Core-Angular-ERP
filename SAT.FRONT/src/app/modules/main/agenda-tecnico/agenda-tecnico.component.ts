import { Component, OnInit } from '@angular/core';
import { setOptions, MbscEventcalendarView, MbscCalendarEvent, localePtBR, Notifications, MbscEventcalendarOptions } from '@mobiscroll/angular';
import { NominatimService } from 'app/core/services/nominatim.service';
import { OrdemServicoService } from 'app/core/services/ordem-servico.service';
import { TecnicoService } from 'app/core/services/tecnico.service';
import { Coordenada } from 'app/core/types/agenda-tecnico.types';
import { OrdemServico, OrdemServicoData } from 'app/core/types/ordem-servico.types';
import { Tecnico } from 'app/core/types/tecnico.types';
import moment, { Moment } from 'moment';

setOptions({
    locale: localePtBR,
    theme: 'windows',
    themeVariant: 'light',
    clickToCreate: true,
    dragToCreate: true,
    dragToMove: true,
    dragToResize: true
});

const now = new Date();

@Component({
    selector: 'app-agenda-tecnico',
    templateUrl: './agenda-tecnico.component.html',
    styleUrls: ['./agenda-tecnico.component.scss'],
})
export class AgendaTecnicoComponent implements OnInit {

    tecnicos: Tecnico[] = [];
    chamados: OrdemServico[] = [];

    constructor(
        private _notify: Notifications,
        private _tecnicoSvc: TecnicoService,
        private _osSvc: OrdemServicoService,
        private _nominatimSvc: NominatimService
    ) { }

    calendarOptions: MbscEventcalendarOptions = {
        view: {
            timeline: {
                type: 'day',
                allDay: false,
                startDay: 1,
                startTime: '08:00',
                endTime: '19:00'
            }
        },
        dragToMove: true,
        externalDrop: true,
        onEventCreate: (args) => {
            this._notify.toast({
                message: args.event.title + ' added'
            });
        }
    };

    view: MbscEventcalendarView = {
        
    };

    events: MbscCalendarEvent[] = [];
    resources = [];

    retreatData = {
        title: 'Team retreat',
        color: '#1064b0',
        start: moment(),
        end: moment().add(60, 'minutes')
    };

    meetingData = {
        title: 'QA meeting',
        color: '#cf4343',
        start: moment(),
        end: moment().add(60, 'minutes')
    };

    ngOnInit(): void {
        this.obterDados();
    }

    private async obterDados() {
        const tecnicos = await this._tecnicoSvc.obterPorParametros({
            indAtivo: 1,
            codFilial: 4,
            codPerfil: 35,
            sortActive: 'nome',
            sortDirection: 'asc'
        }).toPromise();

        this.resources = tecnicos.items.map(tecnico => {
            return {
                id: tecnico.codTecnico,
                name: tecnico.nome,
                //img: 'https://img.mobiscroll.com/demos/f3.png',
                img: 'https://sat.perto.com.br/DiretorioE/AppTecnicos/Fotos/' + tecnico.usuario.codUsuario + '.jpg',
            }
        });
        
        const chamados = await this._osSvc.obterPorParametros({
            codFiliais: "4",
            codStatusServicos: "8",
            sortActive: 'dataHoraTransf',
            sortDirection: 'asc'
        }).toPromise();
        
       this.events = chamados.items.map(os =>
        {
                const tecnico = tecnicos.items.filter(t => t.codTecnico == os.codTecnico).shift();
                return {
                    start: moment(os.dataHoraTransf),
                    end: moment(os.dataHoraTransf).add(tecnico?.mediaTempoAtendMinutosUlt30Dias || 60, 'minutes'),
                    title: os.codOS.toString(),
                    color: '#388E3C',
                    editable: true,
                    resource: os.tecnico.codTecnico,
                }
            }
        )
    }

    onCellDoubleClick(event: any): void {
        this._notify.alert({
            title: 'Click',
            message: event.date + ' resource ' + event.resource
        });
    }

    private async addEvents(chamados: OrdemServicoData): Promise<MbscCalendarEvent[]>
    {
       return await Promise.all(chamados.items.map(async os => 
       {
            return this.calculaDeslocamento(os).then(inicio =>
                {
                    const tecnico = this.tecnicos.filter(t => t.codTecnico == os.codTecnico).shift();
                    const fim = moment(inicio).add(tecnico?.mediaTempoAtendMinutosUlt30Dias || 60, 'minutes');
                    return {
                        start: inicio,
                        end:  fim,
                        title: os.codOS.toString(),
                        color: '#388E3C',
                        editable: true,
                        resource: os.tecnico.codTecnico,
                        } 
                });
        }));
    }

    private async calculaDeslocamento(os: OrdemServico)
    {
        var origem: Coordenada = new Coordenada();
        var destino: Coordenada = new Coordenada();
        var inicioDeslocamento: Moment = moment(os.dataHoraTransf);

        // Verificar se ele já possui algum chamado agendado, pegar proximo horario disponivel
        var ultimoEvento = this.chamados.filter(i => i.codTecnico === os.tecnico.codTecnico && i.codOS != os.codOS)[0];

        if(ultimoEvento != null)
        {
            // E se for horário de almoço? qual a coordenada?
            origem.cordenadas = [ultimoEvento.localAtendimento.latitude, ultimoEvento.localAtendimento.longitude];
            inicioDeslocamento = moment(ultimoEvento.dataHoraTransf);
        }
        else
        {
            // Se o técnio não possui nada agendado
            // 44 técnicos ativos não possuem informações de latitude e longitude
            var tecnico = this.tecnicos.find(t => t.codTecnico == os.codTecnico);

            if (tecnico == null)
                return moment(os.dataHoraTransf);

            origem.cordenadas = [tecnico.latitude, tecnico.longitude];
        }

        destino.cordenadas = [os.localAtendimento.latitude, os.localAtendimento.longitude]; 

        // Se todas as coordenadas estiverem disponiveis, calcula a distância.
        if (origem.cordenadas[0] && origem.cordenadas[1] && destino.cordenadas[0] && destino.cordenadas[1])
        {
            var deslocamento = await this._nominatimSvc.deslocamentoEmMinutos(origem, destino);
            return inicioDeslocamento.add(deslocamento, 'minutes');
        }
        else 
        {
            // Se não possui todas as coordenadas, retorna a hora de transferencia + meia hora
            return inicioDeslocamento.add(30, 'minutes');
        }
    }
}