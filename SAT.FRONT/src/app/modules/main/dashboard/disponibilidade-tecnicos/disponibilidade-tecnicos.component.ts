import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'app/core/services/dashboard.service';
import { DashboardViewEnum, ViewDashboardDisponibilidadeTecnicos } from 'app/core/types/dashboard.types';
import { Filtro } from 'app/core/types/filtro.types';
import Enumerable from 'linq';

@Component({
  selector: 'app-disponibilidade-tecnicos',
  templateUrl: './disponibilidade-tecnicos.component.html',
  styles: [`tr:nth-child(odd) { background-color: rgb(239,245,254); }`]
})

export class DisponibilidadeTecnicosComponent implements OnInit {
  @Input() filtro: Filtro;
  public loading: boolean = true; ng
  public disponibilidadeTecnicosModel: ViewDashboardDisponibilidadeTecnicos[] = [];
  public totaltecnicosComChamados: number = 0;
  public totalTecnicosAtivos: number = 0;
  public totalTecnicosSemChamadosTransf: number = 0;
  public totalInativos: number = 0;
  public totalTecnicos: number = 0;
  public totalOsNaoTransf: number = 0;
  public totalOsNaoTransfPreventivas: number = 0;
  public totalOsNaoTransfOrcamentoAprovado: number = 0;
  public totalOsNaoTransfRecallUpGrade: number = 0;

  constructor(private _cdr: ChangeDetectorRef,
    private _dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.obterTecnicos();
  }

  private async obterTecnicos() {

    this.loading = true;
    this.disponibilidadeTecnicosModel = (await this._dashboardService.obterViewPorParametros({ dashboardViewEnum: DashboardViewEnum.DISPONIBILIDADE_TECNICOS }).toPromise())
      .viewDashboardDisponibilidadeTecnicos;
    this.totaltecnicosComChamados = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.tecnicosComChamados);
    this.totalTecnicosAtivos = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.tecnicosInativos);
    this.totalTecnicosSemChamadosTransf = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.tecnicosSemChamados);
    this.totalInativos = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.tecnicosInativos);
    this.totalTecnicos = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.tecnicosTotal);
    this.totalOsNaoTransf = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.qtdOSNaoTransferidasCorretivas);
    this.totalOsNaoTransfPreventivas = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.qtdOSNaoTransferidasPreventivas);
    this.totalOsNaoTransfOrcamentoAprovado = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.qtdOSNaoTransferidasOrcamentoAprovado);
    this.totalOsNaoTransfRecallUpGrade = Enumerable.from(this.disponibilidadeTecnicosModel).sum(s => s.qtdOSNaoTransferidasOrcamentoRecallUpGrade);
    this.disponibilidadeTecnicosModel = Enumerable.from(this.disponibilidadeTecnicosModel).orderBy(o => o.filial).toArray();
    this.loading = false;
    this._cdr.detectChanges();
  }
}
