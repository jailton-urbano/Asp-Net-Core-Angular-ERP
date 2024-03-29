import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from 'app/core/user/user.service';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DespesaAdiantamentoData } from 'app/core/types/despesa-adiantamento.types';
import { Filterable } from 'app/core/filters/filterable';
import { MatSidenav } from '@angular/material/sidenav';
import { IFilterable } from 'app/core/types/filtro.types';
import { DespesaAdiantamentoService } from 'app/core/services/despesa-adiantamento.service';
registerLocaleData(localePt);

@Component({
  selector: 'app-despesa-adiantamento-lista',
  templateUrl: './despesa-adiantamento-lista.component.html',
  styles: [`
        .list-grid-despesa-atendimento {
            grid-template-columns: 120px 120px 120px auto 90px;
            @screen sm { grid-template-columns: 120px 120px 120px auto 90px; }
            @screen md { grid-template-columns: 120px 120px 120px auto 90px; }
            @screen lg { grid-template-columns: 120px 120px 120px auto 90px; }
        }
    `],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [{ provide: LOCALE_ID, useValue: "pt-BR" }]
})

export class DespesaAdiantamentoListaComponent extends Filterable implements AfterViewInit, IFilterable
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sidenav') sidenav: MatSidenav;

  isLoading: boolean = false;
  adiantamentos: DespesaAdiantamentoData;

  constructor (
    protected _userService: UserService,
    private _cdr: ChangeDetectorRef,
    private _despesaAdiantamentoSvc: DespesaAdiantamentoService)
  {
    super(_userService, "despesa-adiantamento");
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
        this.onSortChanged()
        this.obterDados();
      });
    }

    this.registerEmitters();
    this._cdr.detectChanges();
  }

  private async obterAdiantamentos()
  {
    this.adiantamentos = (await this._despesaAdiantamentoSvc.obterPorParametros({
      indAtivo: this.filter?.parametros?.indAtivo,
      codDespesaAdiantamentoTipo: this.filter?.parametros?.codDespesaAdiantamentoTipo,
      codTecnicos: this.filter?.parametros?.codTecnicos,
      pageNumber: this.paginator?.pageIndex + 1,
      pageSize: this.paginator?.pageSize,
      sortActive: 'dataAdiantamento',
      sortDirection: 'desc'
    }).toPromise());
  }

  public async obterDados()
  {
    this.isLoading = true;

    await this.obterAdiantamentos();

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

  public paginar()
  {
    this.onPaginationChanged();
    this.obterDados();
  }
}
