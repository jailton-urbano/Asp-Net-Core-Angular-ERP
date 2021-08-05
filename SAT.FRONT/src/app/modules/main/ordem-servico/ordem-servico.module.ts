import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { FuseCardModule } from '@fuse/components/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialogModule } from '@angular/material/dialog';
import { ordemServicoRoutes } from 'app/modules/main/ordem-servico/ordem-servico.routing';
import { OrdemServicoListaComponent } from './ordem-servico-lista/ordem-servico-lista.component';
import { OrdemServicoFormComponent } from './ordem-servico-form/ordem-servico-form.component';
import { OrdemServicoDetalheComponent } from './ordem-servico-detalhe/ordem-servico-detalhe.component';
import { OrdemServicoImpressaoComponent } from './ordem-servico-impressao/ordem-servico-impressao.component';
import { OrdemServicoFotosComponent } from './ordem-servico-fotos/ordem-servico-fotos.component';
import { OrdemServicoTransferenciaComponent } from './ordem-servico-transferencia/ordem-servico-transferencia.component';

@NgModule({
    declarations: [
        OrdemServicoListaComponent,
        OrdemServicoFormComponent,
        OrdemServicoDetalheComponent,
        OrdemServicoImpressaoComponent,
        OrdemServicoFotosComponent,
        OrdemServicoTransferenciaComponent
    ],
    imports     : [
        RouterModule.forChild(ordemServicoRoutes),
        MatButtonToggleModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDividerModule,
        MatMomentDateModule,
        FuseHighlightModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatDialogModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
        MatTableModule,
        MatTabsModule,
        TranslocoModule,
        NgxMatSelectSearchModule,
        FuseCardModule,
        MatBadgeModule,
        MatTooltipModule,
        MatSidenavModule,
        MatListModule,
    ]
})
export class OrdemServicoModule
{
}