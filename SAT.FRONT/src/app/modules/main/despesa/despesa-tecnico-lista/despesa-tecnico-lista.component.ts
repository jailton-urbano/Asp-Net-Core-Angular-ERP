import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { DespesaAdiantamentoPeriodoService } from 'app/core/services/despesa-adiantamento-periodo.service';
import { TecnicoService } from 'app/core/services/tecnico.service';
import { DespesaAdiantamentoPeriodo, DespesaAdiantamentoPeriodoData, DespesaPeriodoData, DespesaPeriodoTecnicoData } from 'app/core/types/despesa-atendimento.types';
import { TecnicoData } from 'app/core/types/tecnico.types';
import { UserService } from 'app/core/user/user.service';
import { UserSession } from 'app/core/user/user.types';
import Enumerable from 'linq';

@Component({
  selector: 'app-despesa-tecnico-lista',
  templateUrl: './despesa-tecnico-lista.component.html',
  styles: [`
        .list-grid-tecnico-atendimento {
            grid-template-columns: auto 130px 130px 130px 50px;
            @screen sm { grid-template-columns: auto 130px 130px 130px 50px; }
            @screen md { grid-template-columns: auto 130px 130px 130px 50px; }
            @screen lg { grid-template-columns: auto 130px 130px 130px 50px; }
        }
    `],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class DespesaTecnicoListaComponent implements AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  userSession: UserSession;
  isLoading: boolean = false;
  despesasAdiantamentoPeriodo: DespesaAdiantamentoPeriodoData;
  tecnicos: TecnicoData;

  constructor (
    private _cdr: ChangeDetectorRef,
    private _userService: UserService,
    private _tecnicoSvc: TecnicoService,
    private _despesaAdiantamentoPeriodoSvc: DespesaAdiantamentoPeriodoService)
  { this.userSession = JSON.parse(this._userService.userSession); }

  ngAfterViewInit()
  {
    this.obterDados();

    if (this.sort && this.paginator)
    {
      this.sort.disableClear = true;
      this._cdr.markForCheck();

      this.sort.sortChange.subscribe(() =>
      {
        this.paginator.pageIndex = 0;
        this.obterDados();
      });
    }

    this._cdr.detectChanges();
  }

  private async obterTecnicos()
  {
    this.tecnicos = (await this._tecnicoSvc.obterPorParametros({
      indAtivo: 1,
      pageNumber: this.paginator?.pageIndex + 1,
      sortActive: this.sort?.active || 'nome',
      sortDirection: this.sort?.direction || 'asc',
      pageSize: this.paginator?.pageSize
    }).toPromise());
  }

  private async obterDespesasAdiantamentoPeriodo()
  {
    this.despesasAdiantamentoPeriodo = (await this._despesaAdiantamentoPeriodoSvc.obterPorParametros({
      codTecnicos: this.getCodTecnicos(),
      indAtivoPeriodo: 1,
      pageNumber: this.paginator?.pageIndex,
    }).toPromise());
  }

  saldoAdiantamento(codTecnico: number): string
  {
    var dap: DespesaAdiantamentoPeriodo[] = Enumerable.from(this.despesasAdiantamentoPeriodo?.items)
      .where(e => e.despesaAdiantamento.codTecnico == codTecnico).toArray();

    if (dap == null) return 0.00.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

    var valorUtilizado = Enumerable.from(dap).where(e => e.despesaPeriodo.indAtivo == 1).sum(e => e.valorAdiantamentoUtilizado);

    var valorAdiantamento = Enumerable.from(dap).where(e => e.despesaAdiantamento.indAtivo == 1 && e.despesaAdiantamento.codDespesaAdiantamentoTipo == 2).distinct(e => e.codDespesaAdiantamento).sum(e => e.despesaAdiantamento.valorAdiantamento);

    var saldo = valorAdiantamento - valorUtilizado;

    console.log(valorUtilizado, valorAdiantamento, saldo);

    return (saldo < 0 ? saldo * -1 : saldo).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  private async obterDados()
  {
    this.isLoading = true;

    await this.obterTecnicos();
    await this.obterDespesasAdiantamentoPeriodo();

    this.isLoading = false;
  }

  private getCodTecnicos(): string
  {
    return Enumerable.from(this.tecnicos.items).select(e => e.codTecnico).toArray().join(',');
  }

  paginar()
  {
    this.obterDados();
  }
}