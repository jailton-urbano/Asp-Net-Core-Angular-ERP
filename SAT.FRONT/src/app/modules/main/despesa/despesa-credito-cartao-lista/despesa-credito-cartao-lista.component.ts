import { AfterViewInit, ChangeDetectorRef, Component, LOCALE_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { Filterable } from 'app/core/filters/filterable';
import { DespesaPeriodoTecnicoService } from 'app/core/services/despesa-periodo-tecnico.service';
import { DespesaProtocoloService } from 'app/core/services/despesa-protocolo.service';
import { DespesaCreditosCartaoListView, DespesaPeriodoTecnico, DespesaPeriodoTecnicoData, DespesaPeriodoTecnicoFilterEnum } from 'app/core/types/despesa-periodo.types';
import { DespesaTipoEnum } from 'app/core/types/despesa.types';
import { IFilterable } from 'app/core/types/filtro.types';
import { UserService } from 'app/core/user/user.service';
import { ConfirmacaoDialogComponent } from 'app/shared/confirmacao-dialog/confirmacao-dialog.component';
import Enumerable from 'linq';
import moment from 'moment';
import { DespesaCreditoCreditarDialogComponent } from './despesa-credito-creditar-dialog/despesa-credito-creditar-dialog.component';

@Component({
  selector: 'app-despesa-credito-cartao-lista',
  templateUrl: './despesa-credito-cartao-lista.component.html',
  styles: [`
        .list-grid-despesa-credito-cartao {
            grid-template-columns: 50px 50px 50px auto 30px 100px 80px 60px 85px 60px 75px 40px 60px;
            @screen sm { grid-template-columns: 50px 50px 50px auto 30px 100px 80px 60px 85px 60px 75px 40px 60px; }
            @screen md { grid-template-columns: 50px 50px 50px auto 30px 100px 80px 60px 85px 60px 75px 40px 60px; }
            @screen lg { grid-template-columns: 50px 50px 50px auto 30px 100px 80px 60px 85px 60px 75px 40px 60px; }
        }
    `],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [{ provide: LOCALE_ID, useValue: "pt-BR" }]
})
export class DespesaCreditoCartaoListaComponent extends Filterable implements AfterViewInit, IFilterable
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sidenav') sidenav: MatSidenav;
  isLoading: boolean = false;
  periodos: DespesaPeriodoTecnicoData;
  listview: DespesaCreditosCartaoListView[] = [];

  constructor (
    protected _userService: UserService,
    private _cdr: ChangeDetectorRef,
    private _despesaPeriodoTecnicoSvc: DespesaPeriodoTecnicoService,
    private _despesaProtocoloSvc: DespesaProtocoloService,
    private _dialog: MatDialog)
  {
    super(_userService, 'despesa-credito-cartao');
  }

  ngAfterViewInit()
  {
    this.obterDados();

    if (this.sort && this.paginator)
    {
      this.sort.disableClear = true;
      this._cdr.markForCheck();

      this.sort.sortChange.subscribe(() =>
      {
        this.onSortChanged();
        this.obterDados();
      });
    }

    this.registerEmitters();
    this._cdr.detectChanges();
  }

  public async obterDados()
  {
    this.isLoading = true;

    await this.obterPeriodosTecnico();
    await this.criarListView();

    this.isLoading = false;
  }

  registerEmitters(): void
  {
    this.sidenav.closedStart.subscribe(() =>
    {
      this.onSidenavClosed();
      this.obterDados();
    })
  }

  private async obterPeriodosTecnico()
  {
    this.periodos = (await this._despesaPeriodoTecnicoSvc.obterPorParametros(
      {
        filterType: DespesaPeriodoTecnicoFilterEnum.FILTER_CREDITOS_CARTAO,
        pageNumber: this.paginator.pageIndex + 1,
        pageSize: this.paginator.pageSize,
        codTecnico: this.filter?.parametros.codTecnicos,
        codFilial: this.filter?.parametros.codFiliais
      }
    ).toPromise());
  }

  private criarListView()
  {
    this.listview = [];

    this.periodos.items
      .forEach(p =>
      {
        this.listview.push(
          {
            protocolo: "P" + p.despesaProtocoloPeriodoTecnico?.codDespesaProtocolo,
            rd: p.codDespesaPeriodoTecnico,
            cadastro: p.despesaProtocoloPeriodoTecnico.dataHoraCad,
            tecnico: p.tecnico?.nome,
            categoriaCredito: p.tecnico.tecnicoCategoriaCredito,
            filial: p.tecnico?.filial?.nomeFilial,
            cartao: this.obterCartaoAtual(p),
            saldo: this.obterSaldoAtual(p),
            dataManutSaldo: moment(this.obterHorarioSaldoAtual(p)).format('DD/MM HH:mm'),
            integrado: p.ticketLogPedidoCredito?.dataHoraProcessamento ? moment(p.ticketLogPedidoCredito?.dataHoraProcessamento).format('DD/MM HH:mm') : null,
            inicio: moment(p.despesaPeriodo.dataInicio).format('DD/MM/YY'),
            fim: moment(p.despesaPeriodo.dataFim).format('DD/MM/YY'),
            combustivel: this.obterDespesasCombustivel(p),
            indCreditado: p.indCredito == 1 ? true : false,
            indCompensado: p.indCompensacao == 1 ? true : false,
            indVerificado: p.indVerificacao == 1 ? true : false,
            obs: p.ticketLogPedidoCredito?.observacao,
            indErroAoCreditar: p.ticketLogPedidoCredito?.observacao != null && p.ticketLogPedidoCredito?.observacao != '' && p.indCredito == 1 ? true : false
          });
      });
  }

  private obterCartaoAtual(p: DespesaPeriodoTecnico)
  {
    return Enumerable.from(p.tecnico.despesaCartaoCombustivelTecnico)
      .orderByDescending(i => i.dataHoraInicio)
      .firstOrDefault()?.despesaCartaoCombustivel?.numero;
  }

  private obterSaldoAtual(p: DespesaPeriodoTecnico)
  {
    return Enumerable.from(p.tecnico.despesaCartaoCombustivelTecnico)
      .orderByDescending(i => i.dataHoraInicio)
      .firstOrDefault()?.despesaCartaoCombustivel?.ticketLogUsuarioCartaoPlaca?.saldo;
  }

  private obterHorarioSaldoAtual(p: DespesaPeriodoTecnico)
  {
    return Enumerable.from(p.tecnico.despesaCartaoCombustivelTecnico)
      .orderByDescending(i => i.dataHoraInicio)
      .firstOrDefault()?.despesaCartaoCombustivel?.ticketLogUsuarioCartaoPlaca?.dataHoraManut;
  }

  private obterDespesasCombustivel(p: DespesaPeriodoTecnico)
  {
    return Enumerable.from(p.despesas).sum(i =>
      Enumerable.from(i.despesaItens)
        .where(i => i.codDespesaTipo == DespesaTipoEnum.KM)
        .sum(i => i.despesaValor));
  }

  paginar()
  {
    this.onPaginationChanged();
    this.obterDados();
  }

  creditarRD(a: DespesaCreditosCartaoListView)
  {
    var despesaPeriodoTecnico = Enumerable.from(this.periodos.items)
      .firstOrDefault(i => i.codDespesaPeriodoTecnico == a.rd);

    const dialogRef = this._dialog.open(DespesaCreditoCreditarDialogComponent, {
      data: {
        despesaCreditosCartaoListView: a,
        despesaPeriodoTecnico: despesaPeriodoTecnico
      }
    });

    dialogRef.afterClosed().subscribe((confirmacao: boolean) =>
    {
      if (confirmacao)
        this.obterDados();
    });
  }

  verificarProtocolo(a: DespesaCreditosCartaoListView)
  {
    const dialogRef = this._dialog.open(ConfirmacaoDialogComponent, {
      data: {
        titulo: 'Verificação',
        message: `Deseja verificar o relatório de ${a.combustivel.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} para o técnico ${a.tecnico}?`,
        buttonText: {
          ok: 'Sim',
          cancel: 'Não'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmacao: boolean) =>
    {
      var despesaPeriodoTecnico = Enumerable.from(this.periodos.items)
        .firstOrDefault(i => i.codDespesaPeriodoTecnico == a.rd);

      if (confirmacao)
      {
        despesaPeriodoTecnico.indVerificacao = 1;
        despesaPeriodoTecnico.codUsuarioVerificacao = this.userSession.usuario.codUsuario;
        despesaPeriodoTecnico.dataHoraVerificacao = moment().format('DD/MM/YY HH:mm:ss');

        this._despesaProtocoloSvc
          .obterPorCodigo(despesaPeriodoTecnico.despesaProtocoloPeriodoTecnico.codDespesaProtocolo)
          .subscribe(i =>
          {
            i.indFechamento = 1;
            i.dataHoraFechamento = moment().format('DD/MM/YY HH:mm:ss');

            /* this._despesaProtocoloSvc.atualizar(i).toPromise() */
          });
      }
      else
      {
        despesaPeriodoTecnico.indVerificacao = 0;
        despesaPeriodoTecnico.codUsuarioVerificacaoCancelado = this.userSession.usuario.codUsuario;
        despesaPeriodoTecnico.dataHoraVerificacaoCancelado = moment().format('DD/MM/YY HH:mm');
      }

      /* this._despesaPeriodoTecnicoSvc.atualizar(despesaPeriodoTecnico).toPromise(); */
    });
  }

  getStatus(a: DespesaCreditosCartaoListView)
  {
    if (a.indErroAoCreditar)
      return "ERRO AO CREDITAR";
    else if (a.indCreditado)
      return "CREDITADO";
    else if (a.indCompensado)
      return "COMPENSADO";
    else if (a.indVerificado)
      return "VERIFICADO";

    return "AGUARDANDO VERIFICAÇÃO";
  }
}