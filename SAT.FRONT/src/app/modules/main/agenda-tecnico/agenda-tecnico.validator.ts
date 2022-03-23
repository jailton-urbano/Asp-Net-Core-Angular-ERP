import { Injectable } from '@angular/core';
import { DateTimeExtensions } from 'app/core/extensions/date-time.extensions';
import { Coordenada, HaversineService } from 'app/core/services/haversine.service';
import { TecnicoService } from 'app/core/services/tecnico.service';
import { AgendaTecnico, AgendaTecnicoTypeEnum, MbscAgendaTecnicoCalendarEvent, TecnicoMaisProximo } from 'app/core/types/agenda-tecnico.types';
import { OrdemServico } from 'app/core/types/ordem-servico.types';
import { Tecnico } from 'app/core/types/tecnico.types';
import Enumerable from 'linq';
import moment, { Moment } from 'moment';

@Injectable({
    providedIn: 'root'
})

export class AgendaTecnicoValidator
{
    constructor (private _tecnicoService: TecnicoService,
        private _haversineSvc: HaversineService,
        private _dateTimeExtensions: DateTimeExtensions) { }

    /**
     * valida se a região do chamado e a região do técnico são iguais
     */
    public async isTecnicoDaRegiaoDoChamado(os: OrdemServico, codTecnico: number)
    {
        var tecnico = (await this._tecnicoService.obterPorCodigo(codTecnico).toPromise());

        if (tecnico?.codRegiao == os.codRegiao)
            return true;

        return false;
    }

    public isTecnicoOMaisProximo(os: OrdemServico, tecnicos: Tecnico[], events: MbscAgendaTecnicoCalendarEvent[], codTecnico: number)
    {
        debugger

        var codTecnicos = Enumerable.from(tecnicos).select(i => i.codTecnico);

        var ultimoAtendimentoTecnico =
            Enumerable.from(events)
                .where(i => i.resource == codTecnico)
                .orderByDescending(i => i.end)
                .firstOrDefault();

        debugger

        if (ultimoAtendimentoTecnico)
            var minDistancia = this.calculaDeslocamentoEmMinutos(os, ultimoAtendimentoTecnico?.ordemServico);

        var codTecnicoMinDistancia = codTecnico;

        var ultimosAtendimentosAgendados =
            Enumerable.from(events)
                .where(i => codTecnicos.contains(+i.resource) && i.ordemServico != null)
                .groupBy(i => i.resource)
                .select(i => i.maxBy(i => i.end))
                .toArray();

        ultimosAtendimentosAgendados.forEach(i => 
        {
            var distancia = this.calculaDeslocamentoEmMinutos(os, i.ordemServico);

            if (distancia < minDistancia)
            {
                minDistancia = distancia;
                codTecnicoMinDistancia = +i.resource;
                ultimoAtendimentoTecnico = i;
            }
        });

        if (codTecnicoMinDistancia != codTecnico)
        {
            var nomeTecnico = ultimoAtendimentoTecnico.ordemServico?.tecnico?.nome;
            var tec: TecnicoMaisProximo =
            {
                minDistancia: minDistancia,
                codTecnicoMinDistancia: codTecnicoMinDistancia,
                ultimoAtendimentoTecnico: ultimoAtendimentoTecnico,
                message: this.getTecnicoOMaisProximoMessage(nomeTecnico, minDistancia, os)
            }

            return tec;
        }
        else
            return null;
    }

    public validaDistanciaEntreEventos(eventoAtual: any, events: MbscAgendaTecnicoCalendarEvent[]): string
    {
        var codTecnico = eventoAtual.resource;

        var eventosDoTecnico = Enumerable.from(events)
            .where(i => i.resource == codTecnico).orderBy(i => i.start).toArray();

        var eventIndex = eventosDoTecnico.indexOf(eventoAtual);

        if (eventIndex != null)
        {
            var eventoAnterior = eventosDoTecnico[eventIndex - 1];
            if (eventoAnterior != null && eventoAnterior?.agendaTecnico.tipo == AgendaTecnicoTypeEnum.OS && eventoAtual.agendaTecnico?.tipo == AgendaTecnicoTypeEnum.OS)
            {
                var minDistancia: number =
                    this.calculaDeslocamentoEmMinutos(eventoAtual.ordemServico, eventoAnterior.ordemServico);

                if (minDistancia <= 1) return null;

                return "O técnico demorará " + this.getTimeFromMins(minDistancia) + "h para chegar no local a partir do seu último atendimento.";
            }
        }
        return null;
    }

    private getTecnicoOMaisProximoMessage(nomeTecnico: string, minDistancia: number, os: OrdemServico)
    {
        if (minDistancia == 0)
            return `O técnico ${nomeTecnico} encontra-se no local de atendimento do chamado ${os?.codOS}. Deseja transferir este chamado para ${nomeTecnico}?`;


        return `O técnico ${nomeTecnico} encontra-se a ${minDistancia.toFixed(2)} minutos do local de atendimento do chamado ${os?.codOS}. Deseja transferir este chamado para ${nomeTecnico}?`;
    }

    public calculaDeslocamentoEmMinutos(os: OrdemServico, osAnterior: OrdemServico): number
    {
        var origem: Coordenada = new Coordenada();
        var destino: Coordenada = new Coordenada();

        // se ele já estava atendendo algum chamado, parte das coordenadas deste chamado
        if (osAnterior != null)
            origem.coordenadas = [osAnterior.localAtendimento?.latitude, osAnterior.localAtendimento?.longitude];
        // Se o técnico não possui nada agendado, parte do endereoç deste
        else
            origem.coordenadas = [os.tecnico?.latitude, os.tecnico?.longitude];

        destino.coordenadas = [os.localAtendimento?.latitude, os.localAtendimento?.longitude];

        return this._haversineSvc.getDistanceInMinutesPerKm(origem, destino, 50);
    }

    public isOnVacation(t: Tecnico): boolean
    {
        if (!t.indFerias)
            return false;

        return true;
    }

    public inicioIntervalo(reference: Moment = moment())
    {
        return moment(reference).set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    }

    public fimIntervalo(reference: Moment = moment())
    {
        return moment(reference).set({ hour: 13, minute: 0, second: 0, millisecond: 0 });
    }

    public inicioExpediente(reference: Moment = moment())
    {
        return moment(reference).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
    }

    public fimExpediente(reference: Moment = moment())
    {
        return moment(reference).set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
    }

    public hasOverlap(args, inst)
    {
        var ev = args.event;
        var events = inst.getEvents(ev.start, ev.end).filter(e => (e.resource == ev.resource && e.id != ev.id));
        events = events.filter(e => e.agendaTecnico.tipo == AgendaTecnicoTypeEnum.OS);
        return events.length > 0;
    }

    public invalidInsert(args)
    {
        //não pode inserir evento anterior à linha do tempo
        var now = moment();
        return moment(args.event.start) < now;
    }

    public isTechnicianInterval(event)
    {
        return event.agendaTecnico.tipo === AgendaTecnicoTypeEnum.INTERVALO;
    }

    public invalidMove(args)
    {
        //não pode mover evento posterior a linha do tempo para antes da linha do tempo
        var now = moment();
        return moment(args.oldEvent.start) > now && moment(args.event.start) < now;
    }

    public hasChangedResource(args)
    {
        return args.event.resource != args.oldEvent.resource;
    }

    public cantChangeInterval(args)
    {
        return args.event.resource != args.oldEvent.resource && (args.event.agendaTecnico.tipo === AgendaTecnicoTypeEnum.INTERVALO || args.oldEvent.agendaTecnico.tipo === AgendaTecnicoTypeEnum.INTERVALO);
    }

    public getTypeColor(type: AgendaTecnicoTypeEnum): string
    {
        switch (type)
        {
            case AgendaTecnicoTypeEnum.OS:
                return "#009000";
            case AgendaTecnicoTypeEnum.PONTO:
                return "#C8C8C8C8";
            case AgendaTecnicoTypeEnum.INTERVALO:
                return "#C8C8C8C8";
        }
    }

    public agendamentoColor(): string
    {
        return '#381354';
    }

    public lateColor(): string
    {
        return '#ff4c4c';
    }

    public getRealocationStatusColor(ag: AgendaTecnico, referenceTime: Moment): string
    {
        if (ag.indAgendamento == 1)
            return this.agendamentoColor();
        else if (referenceTime < moment())
            return this.lateColor();
        return this.getTypeColor(AgendaTecnicoTypeEnum.OS);
    }

    private getTimeFromMins(mins)
    {
        return this._dateTimeExtensions.getTimeFromMins(mins);
    }
}