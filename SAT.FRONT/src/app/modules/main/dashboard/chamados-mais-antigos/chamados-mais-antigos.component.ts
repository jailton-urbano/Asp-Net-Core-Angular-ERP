import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'app/core/services/dashboard.service';
import {
  DashboardViewEnum, ViewDashboardChamadosMaisAntigosCorretivas, ViewDashboardChamadosMaisAntigosOrcamentos 
} from 'app/core/types/dashboard.types';

@Component({
  selector: 'app-chamados-mais-antigos',
  templateUrl: './chamados-mais-antigos.component.html',
  styles: [`tr:nth-child(odd) { background-color: rgb(239,245,254); }`]
})
export class ChamadosMaisAntigosComponent implements OnInit {
  chamadosAntigosCorretivas: ViewDashboardChamadosMaisAntigosCorretivas[] = [];
  chamadosAntigosOrcamentos: ViewDashboardChamadosMaisAntigosOrcamentos[] = [];
  loadingCorretivas: boolean = true;
  loadingOrcamentos: boolean = true;

  constructor(
    private _dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadingCorretivas = true;
    this.loadingOrcamentos = true;
    this.obterDadosCorretivas();
    this.obterDadosOrcamentos();
  }

  async obterDadosCorretivas() {
    const data = await this._dashboardService.obterViewPorParametros({ 
      dashboardViewEnum: DashboardViewEnum.CHAMADOS_ANTIGOS_CORRETIVAS
    }).toPromise()

    this.chamadosAntigosCorretivas = data.viewDashboardChamadosMaisAntigosCorretivas;
    this.loadingCorretivas = false;
  }

  async obterDadosOrcamentos() {
    this.chamadosAntigosOrcamentos =
      (await this._dashboardService.obterViewPorParametros({ dashboardViewEnum: DashboardViewEnum.CHAMADOS_ANTIGOS_ORCAMENTOS }).toPromise())
        .viewDashboardChamadosMaisAntigosOrcamentos;
    this.loadingOrcamentos = false;
  }
}