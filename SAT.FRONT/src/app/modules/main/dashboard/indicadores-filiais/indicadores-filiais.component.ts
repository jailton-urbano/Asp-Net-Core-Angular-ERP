import { AfterViewInit, Component, OnInit } from '@angular/core';
import Enumerable from 'linq';
import { UserService } from 'app/core/user/user.service';
import { IFilterable } from 'app/core/types/filtro.types';
import { DashboardService } from 'app/core/services/dashboard.service';
import { DashboardViewEnum, ViewDashboardIndicadoresFiliais } from 'app/core/types/dashboard.types';

@Component({
  selector: 'app-indicadores-filiais',
  templateUrl: './indicadores-filiais.component.html',
  styleUrls: ['./indicadores-filiais.component.css'
  ]
})

export class IndicadoresFiliaisComponent implements OnInit {
  public indicadoresFiliais: ViewDashboardIndicadoresFiliais[] = [];
  public indicadoresFiliaisTotal: ViewDashboardIndicadoresFiliais;
  public loading: boolean = true;

  constructor(private _dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loading = true;
    this.montaDashboard();
  }

  private async montaDashboard(): Promise<void> {
    this.indicadoresFiliais = (await this._dashboardService.obterViewPorParametros({ dashboardViewEnum: DashboardViewEnum.INDICADORES_FILIAL }).toPromise())
      .viewDashboardIndicadoresFiliais;
    this.indicadoresFiliaisTotal = Enumerable.from(this.indicadoresFiliais).firstOrDefault(q => q.filial == "TOTAL");
    this.indicadoresFiliais = Enumerable.from(this.indicadoresFiliais).where(f => f.filial != "TOTAL").distinct().toArray();
    this.indicadoresFiliais.sort((a, b) => (a.sla > b.sla ? -1 : 1));
    this.loading = false;
  }
}