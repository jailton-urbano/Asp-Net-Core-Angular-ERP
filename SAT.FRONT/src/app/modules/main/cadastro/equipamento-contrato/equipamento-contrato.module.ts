import { FiltroModule } from './../../filtros/filtro.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EquipamentoContratoListaComponent } from './equipamento-contrato-lista/equipamento-contrato-lista.component';
import { EquipamentoContratoFormComponent } from './equipamento-contrato-form/equipamento-contrato-form.component';
import { equipamentoContratoRoutes } from './equipamento-contrato.routing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EquipamentoContratoFiltroComponent } from './equipamento-contrato-filtro/equipamento-contrato-filtro.component';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
      validation: false,
  };
};

@NgModule({
  declarations: [
    EquipamentoContratoListaComponent,
    EquipamentoContratoFormComponent,
    EquipamentoContratoFiltroComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(equipamentoContratoRoutes),
    NgxMaskModule.forRoot(maskConfigFunction),
    MatPaginatorModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    TranslocoModule,
    SharedModule,
    FuseHighlightModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatSortModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatMenuModule,
    FiltroModule
  ]
})
export class EquipamentoContratoModule { }
