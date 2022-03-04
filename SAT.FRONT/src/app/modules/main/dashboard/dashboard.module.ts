import { MatTableModule } from '@angular/material/table';
import { LOCALE_ID, NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routing';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { IndicadoresFiliaisMapaComponent } from './indicadores-filiais-mapa/indicadores-filiais-mapa.component';
import { ChamadosMaisAntigosComponent } from './chamados-mais-antigos/chamados-mais-antigos.component';
import { IndicadoresFiliaisComponent } from './indicadores-filiais/indicadores-filiais.component';
import { DisponibilidadeTecnicosComponent } from './disponibilidade-tecnicos/disponibilidade-tecnicos.component';
import { MediaGlobalAtendimentoTecnicoComponent } from './media-global-atendimento-tecnico/media-global-atendimento-tecnico.component';
import { DisponibilidadeBbtsFiliaisComponent } from './disponibilidade-bbts-filiais/disponibilidade-bbts-filiais.component';
import { DashboardSpaComponent } from './dashboard-spa/dashboard-spa.component';
import { SlaClientesComponent } from './sla-clientes/sla-clientes.component';
import { DisponibilidadeBBTSRegioesComponent } from './disponibilidade-bbts-regioes/disponibilidade-bbts-regioes.component';
import { ReincidenciaFiliaisComponent } from './reincidencia-filiais/reincidencia-filiais.component';
import { PendenciaFiliaisComponent } from './pendencia-filiais/pendencia-filiais.component';
import { EquipamentosMaisReincidentesComponent } from './equipamentos-mais-reincidentes/equipamentos-mais-reincidentes.component';
import { ReincidenciaClientesComponent } from './reincidencia-clientes/reincidencia-clientes.component';
import { PecasFaltantesFiliaisComponent } from './pecas-faltantes-filiais/pecas-faltantes-filiais.component';
import { CincoPecasMaisFaltantesComponent } from './cinco-pecas-mais-faltantes/cinco-pecas-mais-faltantes.component';
import { PecasFaltantesMaisCriticasComponent } from './pecas-faltantes-mais-criticas/pecas-faltantes-mais-criticas.component';
import { DensidadeComponent } from './densidade/densidade.component';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { DashboardFiltroComponent } from './dashboard-filtro/dashboard-filtro.component';
import { TecnicosReincidentesComponent } from './tecnicos-reincidentes/tecnicos-reincidentes.component';
import { TecnicosDesempenhoSpaComponent } from './tecnicos-desempenho-spa/tecnicos-desempenho-spa.component';
import ptBR from '@angular/common/locales/pt'
import { TecnicosPendentesComponent } from './tecnicos-pendentes/tecnicos-pendentes.component';
import { DisponibilidadeBbtsMultaComponent } from './disponibilidade-bbts-multa/disponibilidade-bbts-multa.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
registerLocaleData(ptBR);


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardFiltroComponent,
    IndicadoresFiliaisMapaComponent,
    DisponibilidadeBBTSRegioesComponent,
    ChamadosMaisAntigosComponent,
    IndicadoresFiliaisComponent,
    DisponibilidadeTecnicosComponent,
    MediaGlobalAtendimentoTecnicoComponent,
    DisponibilidadeBbtsFiliaisComponent,
    DisponibilidadeBbtsMultaComponent,
    DashboardSpaComponent,
    SlaClientesComponent,
    ReincidenciaFiliaisComponent,
    TecnicosReincidentesComponent,
    PendenciaFiliaisComponent,
    TecnicosPendentesComponent,
    EquipamentosMaisReincidentesComponent,
    ReincidenciaClientesComponent,
    PecasFaltantesFiliaisComponent,
    CincoPecasMaisFaltantesComponent,
    PecasFaltantesMaisCriticasComponent,
    DensidadeComponent,
    TecnicosDesempenhoSpaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    LeafletModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    TranslocoModule,
    LeafletMarkerClusterModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    NgApexchartsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class DashboardModule { }
