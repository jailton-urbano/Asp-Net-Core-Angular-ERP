import { AfterViewInit, Component, LOCALE_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { setOptions, localePtBR, Notifications, MbscEventcalendarOptions, formatDate, MbscPopup, MbscPopupOptions } from '@mobiscroll/angular';
import { OrdemServicoService } from 'app/core/services/ordem-servico.service';
import { TecnicoService } from 'app/core/services/tecnico.service';
import { AgendaTecnico, AgendaTecnicoTypeEnum, MbscAgendaTecnicoCalendarEvent } from 'app/core/types/agenda-tecnico.types';
import { OrdemServico, StatusServicoEnum } from 'app/core/types/ordem-servico.types';
import { Tecnico } from 'app/core/types/tecnico.types';
import moment from 'moment';
import Enumerable from 'linq';
import { Subject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { AgendaTecnicoService } from 'app/core/services/agenda-tecnico.service';
import { MatDialog } from '@angular/material/dialog';
import { RoteiroMapaComponent } from './roteiro-mapa/roteiro-mapa.component';
import { UserService } from 'app/core/user/user.service';
import { RoleEnum, UserSession } from 'app/core/user/user.types';
import { Filterable } from 'app/core/filters/filterable';
import { IFilterable } from 'app/core/types/filtro.types';
import { AgendaTecnicoRealocacaoDialogComponent } from './agenda-tecnico-realocacao-dialog/agenda-tecnico-realocacao-dialog.component';
import { AgendaTecnicoValidator } from './agenda-tecnico.validator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt, 'pt');

setOptions({
  locale: localePtBR,
  theme: 'ios',
  themeVariant: 'light',
  clickToCreate: true,
  dragToCreate: true,
  dragToMove: true,
  dragToResize: true
});

@Component({
  selector: 'app-agenda-tecnico',
  templateUrl: './agenda-tecnico.component.html',
  styleUrls: ['./agenda-tecnico.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [{ provide: LOCALE_ID, useValue: "pt-BR" }]
})

export class AgendaTecnicoComponent extends Filterable implements AfterViewInit, IFilterable
{
  loading: boolean;
  userSession: UserSession;
  tecnicos: Tecnico[] = [];
  events: MbscAgendaTecnicoCalendarEvent[] = [];
  agendaTecnicos: AgendaTecnico[] = [];
  resources = [];
  weekStart = moment().clone().startOf('isoWeek').format('yyyy-MM-DD HH:mm:ss');
  weekEnd = moment().clone().startOf('isoWeek').add(7, 'days').format('yyyy-MM-DD HH:mm:ss');
  snackConfigInfo: MatSnackBarConfig = { duration: 2000, panelClass: 'info' };

  @ViewChild('popup', { static: false })
  tooltip!: MbscPopup;

  popupOptions: MbscPopupOptions = {
    display: 'anchored',
    touchUi: false,
    showOverlay: false,
    contentPadding: false,
    closeOnOverlayClick: false,
    width: 350
  };

  currentEvent: any;
  interventionType = '';
  info = '';
  time = '';
  anchor: HTMLElement | undefined;
  timer: any;

  calendarOptions: MbscEventcalendarOptions = {
    view: {
      timeline: {
        type: 'week',
        allDay: false,
        startDay: 1,
        startTime: '07:00',
        endTime: '24:00',
        rowHeight: 'equal'
      },
    },
    dragToMove: true,
    externalDrop: true,
    dragToResize: false,
    dragToCreate: false,
    clickToCreate: false,
    showEventTooltip: false,
    onEventCreate: (args, inst) =>
    {
      if (this._validator.hasOverlap(args, inst))
      {
        this._notify.toast({
          message: 'Os atendimentos não podem se sobrepor.',
          color: 'danger'
        });
        return false;
      }
      else if (this._validator.invalidInsert(args))
      {
        this._notify.toast({
          message: 'O atendimento não pode ser agendado para antes da linha do tempo.',
          color: 'danger'
        });
        return false;
      }

      this.validateNewEvent(args, inst);
    },
    onEventUpdate: (args, inst) =>
    {
      if (this._validator.hasOverlap(args, inst))
      {
        this._notify.toast({
          message: 'Os atendimentos não podem se sobrepor.',
          color: 'danger'
        });
        return false;
      }
      else if (this._validator.cantChangeInterval(args))
      {
        this._notify.toast({
          message: 'Não é possível transferir um intervalo.',
          color: 'danger'
        });
        return false;
      }
      else if (this._validator.hasChangedResource(args))
      {
        this.updateResourceChange(args.event);
        return true;
      }
      else if (this._validator.invalidMove(args))
      {
        this._notify.toast({
          message: 'O atendimento não pode ser agendado para antes da linha do tempo.',
          color: 'danger'
        });
        return false;
      }
      else 
      {
        this.updateEvent(args.event);
        return true;
      }
    },
    onCellDoubleClick: (args, inst) =>
    {
      this.realocarAgendamento(args);
    },
    onSelectedDateChange: (args, inst) =>
    {
      this.changeWeek(args, inst)
    },
    onEventHoverIn: (args, inst) =>
    {
      this.showEventInfo(args, inst);
    },
    onEventHoverOut: () =>
    {
      if (!this.timer)
      {
        this.timer = setTimeout(() =>
        {
          this.tooltip.close();
        }, 200);
      }
    }
  };

  @ViewChild('sidenavChamados') sidenavChamados: MatSidenav;
  @ViewChild('sidenav') sidenavAgenda: MatSidenav;
  protected _onDestroy = new Subject<void>();

  constructor (
    private _notify: Notifications,
    private _tecnicoSvc: TecnicoService,
    private _osSvc: OrdemServicoService,
    private _agendaTecnicoSvc: AgendaTecnicoService,
    protected _userSvc: UserService,
    public _dialog: MatDialog,
    private _validator: AgendaTecnicoValidator,
    private _snack: MatSnackBar
  )
  {
    super(_userSvc, 'agenda-tecnico')
    this.obterDados();
  }

  registerEmitters(): void
  {
    this.sidenavAgenda.closedStart.subscribe(() =>
    {
      this.onSidenavClosed();
      this.obterDados();
    });
  }

  ngAfterViewInit(): void 
  {
    this.registerEmitters();
  }

  loadFilter(): void
  {
    super.loadFilter();

    // Filtro obrigatorio de filial quando o usuario esta vinculado a uma filial
    if (this.userSession?.usuario?.codFilial)
      this.filter.parametros.codFiliais = this.userSession.usuario.codFilial;
    else if (!this.userSession?.usuario?.codFilial && !this.filter.parametros.codFiliais)
      this.filter.parametros.codFiliais = 4;
  }

  private async obterDados(showLoading: boolean = true)
  {
    this.loading = showLoading;

    this.tecnicos = (await this._tecnicoSvc.obterPorParametros({
      indAtivo: 1,
      codPerfil: RoleEnum.FILIAL_TECNICO_DE_CAMPO,
      codFiliais: this.filter?.parametros?.codFiliais,
      pas: this.filter?.parametros?.pas,
      codTecnicos: this.filter?.parametros?.codTecnicos,
      codRegioes: this.filter?.parametros?.codRegioes,
      sortActive: 'nome',
      sortDirection: 'asc'
    }).toPromise()).items;

    var codTecnicos =
      Enumerable.from(this.tecnicos).select(i => i.codTecnico).toJoinedString(",");

    this.agendaTecnicos = (await this._agendaTecnicoSvc.obterAgendaTecnico({
      codFiliais: this.filter?.parametros?.codFiliais,
      codTecnicos: codTecnicos,
      inicioPeriodoAgenda: this.weekStart,
      fimPeriodoAgenda: this.weekEnd,
      sortActive: 'nome',
      sortDirection: 'asc',
    }).toPromise());

    await this.carregaAgenda();

    this.loading = false;
  }

  carregaAgenda()
  {
    this.events = [];
    this.resources = Enumerable.from(this.tecnicos).select(tecnico =>
    {
      return {
        id: tecnico.codTecnico,
        name: tecnico.nome.toUpperCase(),
        indFerias: this._validator.isOnVacation(tecnico),
        img: `https://sat.perto.com.br/DiretorioE/AppTecnicos/Fotos/${tecnico.usuario.codUsuario}.jpg`,
      }
    }).toArray();

    if (!Enumerable.from(this.resources).any()) return;

    this.events = Enumerable.from(this.agendaTecnicos).select(ag =>
    {
      return {
        codAgendaTecnico: ag.codAgendaTecnico,
        codOS: ag.codOS,
        agendaTecnico: ag,
        start: moment(ag.inicio),
        end: moment(ag.fim),
        title: ag.titulo,
        color: ag.cor,
        editable: ag.indAgendamento == 1 || ag.tipo == AgendaTecnicoTypeEnum.PONTO ? false : true,
        resource: ag.codTecnico,
        ordemServico: ag.ordemServico
      }
    }).toArray();
  }

  private async checkForWarnings(ev, args, inst)
  {
    var isFromSameRegion = (await this._validator.isTecnicoDaRegiaoDoChamado(ev.ordemServico, ev.resource));
    var isAgendado = ev.indAgendamento == 1;

    if (!isFromSameRegion)
    {
      var message: string = `Você transferiu o chamado ${ev.ordemServico?.codOS} para um técnico com a região diferente do chamado.`;
      await this._snack.open(message, null, this.snackConfigInfo).afterDismissed().toPromise();
    }

    if (isAgendado)
    {
      var message: string = `Você transferiu um chamado com agendamento marcado. Ele será realocado automaticamente.`;
      await this._snack.open(message, null, this.snackConfigInfo).afterDismissed().toPromise();
    }

    this.createExternalEvent(ev, args, inst);
  }

  /**  */

  /** Mobiscroll */

  public mouseEnter(): void
  {
    if (this.timer)
    {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public mouseLeave(): void
  {
    this.timer = setTimeout(() =>
    {
      this.tooltip.close();
    }, 200);
  }

  private async changeWeek(args, inst)
  {
    this.weekStart = moment(args.date).format('yyyy-MM-DD HH:mm:ss');
    this.weekEnd = moment(args.date).add(7, 'days').format('yyyy-MM-DD HH:mm:ss');
    await this.obterDados(false);
  }

  private async validateNewEvent(args, inst)
  {
    var ev = args.event;
    this.sidenavChamados.close();
    this.checkForWarnings(ev, args, inst);
  }

  private async createExternalEvent(ev, args, inst)
  {
    var agendaTecnico: AgendaTecnico =
    {
      inicio: moment(ev.start).format('yyyy-MM-DD HH:mm:ss'),
      fim: moment(ev.end).format('yyyy-MM-DD HH:mm:ss'),
      codOS: ev.ordemServico.codOS,
      codTecnico: ev.resource,
      titulo: ev.ordemServico.localAtendimento.nomeLocal.toUpperCase(),
      cor: this._validator.getTypeColor(AgendaTecnicoTypeEnum.OS),
      tipo: AgendaTecnicoTypeEnum.OS,
      indAgendamento: ev.indAgendamento,
      indAtivo: 1,
      codUsuarioCad: this.userSession.usuario.codUsuario,
      dataHoraCad: moment().format('yyyy-MM-DD HH:mm:ss')
    };

    if (ev.indAgendamento == 1)
    {
      agendaTecnico.inicio = moment(ev.dataAgendamento).format('yyyy-MM-DD HH:mm:ss');
      agendaTecnico.fim = moment(ev.dataAgendamento).add(1, 'hour').format('yyyy-MM-DD HH:mm:ss');
      agendaTecnico.cor = this._validator.agendamentoColor();
      agendaTecnico.indAgendamento = 1;
    }

    var ag = (await this._agendaTecnicoSvc.criar(agendaTecnico).toPromise());

    if (ag != null)
    {
      if (ag.indAgendamento == 1) this.obterDados(false);

      var os = ev.ordemServico;

      os.codTecnico = ag.codTecnico;
      os.dataHoraTransf = ag.dataHoraManut;
      os.codUsuarioManut = ag.codUsuarioCad;
      os.codStatusServico = StatusServicoEnum.TRANSFERIDO;
      os.statusServico.codStatusServico = StatusServicoEnum.TRANSFERIDO;
      ev.codAgendaTecnico = ag.codAgendaTecnico;

      var updatedOS = (await this._osSvc.atualizar(os).toPromise());

      if (updatedOS)
      {
        this._notify.toast({
          message: 'Atendimento agendado com sucesso.',
          color: 'success'
        });
        return true;
      }
      else
      {
        this._notify.toast({
          message: 'Não foi possível fazer o agendamento.',
          color: 'danger'
        });
        this.deleteEvent(args, inst);
        return false;
      }
    }
    else
    {
      this._notify.toast({
        message: 'Não foi possível fazer o agendamento.',
        color: 'danger'
      });
      this.deleteEvent(args, inst);
      return false;
    }
  }

  private async updateResourceChange(event)
  {
    var os = event.ordemServico;
    os.codTecnico = event.resource;
    this._osSvc.atualizar(os).subscribe(() =>
    {
      this.updateEvent(event);
    });
  }

  private async updateEvent(ev)
  {
    var agenda: AgendaTecnico = ev.agendaTecnico;
    agenda.codTecnico = ev.resource;
    agenda.inicio = moment(ev.start).format('yyyy-MM-DD HH:mm:ss');
    agenda.fim = moment(ev.end).format('yyyy-MM-DD HH:mm:ss');
    agenda.dataHoraManut = moment().format('yyyy-MM-DD HH:mm:ss');
    agenda.codUsuarioManut = this.userSession.usuario.codUsuario;

    var event = Enumerable.from(this.events).firstOrDefault(e => e.codAgendaTecnico == agenda.codAgendaTecnico);
    if (agenda.tipo == AgendaTecnicoTypeEnum.OS && moment(ev.end) > moment())
    {
      agenda.cor = this._validator.getTypeColor(AgendaTecnicoTypeEnum.OS);
      event.color = agenda.cor;
    }

    var ag = await this._agendaTecnicoSvc.atualizar(agenda).toPromise();
    if (ag != null)
    {
      this._notify.toast({
        message: 'Agendamento atualizado com sucesso.',
        color: 'success'
      });
      event.agendaTecnico = ag;
    }
    else
    {
      this._notify.toast({
        message: 'Não foi possível atualizar o agendamento.',
        color: 'danger'
      });
    }
  }

  public async deleteEvent(args, inst)
  {
    var ag = args.event?.agendaTecnico;

    if (ag)
    {
      ag.indAtivo = 0;
      this._agendaTecnicoSvc.atualizar(ag).toPromise().then(() =>
      {
        inst.removeEvent(args.event);
        return;
      })
    }
    inst.removeEvent(args.event);
  }

  private async realocarAgendamento(args)
  {
    var now = moment();
    var initialTime = moment(args.date).format('yyyy-MM-DD HH:mm:ss');
    var codTecnico = args.resource;

    if (moment(args.date) < now) return;

    var agendamentosTecnico = (await this._agendaTecnicoSvc.obterPorParametros({
      sortActive: 'nome',
      sortDirection: 'asc',
      tipo: AgendaTecnicoTypeEnum.OS,
      codTecnico: codTecnico
    }).toPromise());

    var atendimentosTecnico: MbscAgendaTecnicoCalendarEvent[] = [];

    Enumerable.from(agendamentosTecnico.items).where(i => i.indAgendamento == 0).forEach(i =>
    {
      atendimentosTecnico.push(
        {
          codAgendaTecnico: i.codAgendaTecnico,
          start: i.inicio,
          end: i.fim,
          codOS: i.codOS,
          title: i.titulo,
          color: this._validator.getTypeColor(AgendaTecnicoTypeEnum.OS),
          editable: true,
          resource: i.codTecnico
        });
    });

    if (!atendimentosTecnico.length) return;

    var dialog = this._dialog.open(AgendaTecnicoRealocacaoDialogComponent, {
      data:
      {
        agendamentos: atendimentosTecnico,
        initialTime: initialTime,
        codTecnico: codTecnico
      }
    });

    dialog.afterClosed().subscribe((confirmacao: boolean) =>
    {
      if (confirmacao)
        this.obterDados(false);
    });
  }

  /** */

  /** Mapa */
  public abrirMapa(codTecnico: number): void
  {
    const resource = Enumerable.from(this.resources)
      .firstOrDefault(r => r.id === codTecnico);

    const chamados = Enumerable.from(this.events)
      .where(e => e.resource === codTecnico && e.agendaTecnico.tipo == AgendaTecnicoTypeEnum.OS && e.ordemServico.codStatusServico != StatusServicoEnum.FECHADO)
      .select(i => i.ordemServico)
      .toArray();

    this._dialog.open(RoteiroMapaComponent, {
      width: '960px',
      height: '640px',
      data: {
        resource: resource,
        chamados: chamados
      }
    });
  }

  /**  */

  private showEventInfo(args, inst)
  {
    const event: any = args.event;
    const time = formatDate('HH:mm', new Date(event.start)) + ' - ' + formatDate('HH:mm', new Date(event.end));
    this.currentEvent = event;
    this.interventionType = event.ordemServico?.tipoIntervencao?.nomTipoIntervencao;
    this.info = event.ordemServico != null ? event.title + ', ' + event.ordemServico?.codOS : event.agendaTecnico?.tipo == AgendaTecnicoTypeEnum.PONTO ? "PONTO" : "INTERVALO";
    this.time = time;
    clearTimeout(this.timer);
    this.timer = null;
    this.anchor = args.domEvent.target;
    this.tooltip.open();
  }

  public countResourceEvents(resource: any): number
  {
    return Enumerable.from(this.events)
      .where(i => i.resource == resource.id && i.agendaTecnico?.tipo ==
        AgendaTecnicoTypeEnum.OS && i.ordemServico.codStatusServico != StatusServicoEnum.FECHADO).count();
  }
}