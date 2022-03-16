import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'app/core/services/dashboard.service';
import { DashboardViewEnum, ViewDashboardIndicadoresDetalhadosChamadosAntigos } from 'app/core/types/dashboard.types';
import { UserService } from 'app/core/user/user.service';
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

  constructor(
    private _dashboardService: DashboardService,
    private _userService: UserService
  ) {
    this.userSession = JSON.parse(this._userService.userSession);
  }
    
  async ngOnInit() {
    debugger

    const data = await this._dashboardService.obterViewPorParametros({
      dashboardViewEnum: DashboardViewEnum.INDICADORES_DETALHADOS_CHAMADOS_ANTIGOS,
      codFilial: this.userSession.usuario.codFilial
    }).toPromise();

    this.chamados = data.viewDashboardIndicadoresDetalhadosChamadosAntigos;
    this.loading = false;
  }
}
