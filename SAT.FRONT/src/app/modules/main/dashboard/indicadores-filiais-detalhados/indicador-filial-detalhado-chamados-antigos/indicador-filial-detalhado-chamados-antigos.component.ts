import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'app/core/services/dashboard.service';
import { DashboardViewEnum, ViewDashboardIndicadoresDetalhadosChamadosAntigos } from 'app/core/types/dashboard.types';
import { UserSession } from 'app/core/user/user.types';

@Component({
  selector: 'app-indicador-filial-detalhado-chamados-antigos',
  templateUrl: './indicador-filial-detalhado-chamados-antigos.component.html',
  styles: [`tr:nth-child(odd) { background-color: rgb(239,245,254); }`]
})
export class IndicadorFilialDetalhadoChamadosAntigosComponent implements OnInit {
  chamados: ViewDashboardIndicadoresDetalhadosChamadosAntigos[] = [];
  loading: boolean = true;
  userSession: UserSession;
  @Input() codFilial;

  constructor(
    private _dashboardService: DashboardService
  ) {}
    
  async ngOnInit() {
    const data = await this._dashboardService.obterViewPorParametros({
      dashboardViewEnum: DashboardViewEnum.INDICADORES_DETALHADOS_CHAMADOS_ANTIGOS,
      codFilial: this.codFilial
    }).toPromise();

    this.chamados = data.viewDashboardIndicadoresDetalhadosChamadosAntigos;
    this.loading = false;
  }
}
