import { AfterViewInit, ChangeDetectorRef, Component, Input, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { OrcamentoMaterial } from 'app/core/types/orcamento.types';
import { IEditableItem, IEditableItemList } from 'app/core/base-components/interfaces/ieditable-item-list';
import { ConfirmacaoDialogComponent } from 'app/shared/confirmacao-dialog/confirmacao-dialog.component';
import { isEqual } from 'lodash';
import { OrcamentoMaterialService } from 'app/core/services/orcamento-material.service';
import { OrcamentoService } from 'app/core/services/orcamento.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orcamento-detalhe-material',
  templateUrl: './orcamento-detalhe-material.component.html',
  styles: [`
        .list-grid-material {
            grid-template-columns: 100px auto 100px 100px 100px 100px 150px 100px;
            
            @screen sm {
                grid-template-columns: 100px auto 100px 100px 100px 100px 150px 100px;
            }
        }
    `],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    }
  ],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OrcamentoDetalheMaterialComponent implements IEditableItemList<OrcamentoMaterial>, AfterViewInit
{
  snackConfigDanger: MatSnackBarConfig = { duration: 2000, panelClass: 'danger', verticalPosition: 'top', horizontalPosition: 'right' };
  snackConfigSuccess: MatSnackBarConfig = { duration: 2000, panelClass: 'success', verticalPosition: 'top', horizontalPosition: 'right' };

  isLoading: boolean = false;
  isEditing: boolean = false;
  editableList: IEditableItem<OrcamentoMaterial>[] = [];
  selectedItem: IEditableItem<OrcamentoMaterial>;
  @Input() materiais: OrcamentoMaterial[];

  constructor (public _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
    private _snack: MatSnackBar,
    private _orcMaterialService: OrcamentoMaterialService,
    private _orcService: OrcamentoService)
  { }

  ngAfterViewInit(): void
  {
    this.editableList = this.createEditableList();
  }

  createEditableList(): IEditableItem<OrcamentoMaterial>[]
  {
    return this.materiais.map(i =>
    {
      var item: IEditableItem<OrcamentoMaterial> =
      {
        item: i,
        isEditing: false,
        onEdit: () => this.editar(item),
        onCancel: () => this.cancelar(item),
        onSave: () => this.salvar(item),
        onDelete: () => this.excluirMaterial(item),
        isEqual: () => this.isEqual(item),
        isInvalid: () => this.isInvalid(item)
      };
      return item;
    });
  }

  editar(material: IEditableItem<OrcamentoMaterial>): void
  {
    material.oldItem = Object.assign({}, material.item);
    this.isEditing = true;
    material.isEditing = true;
  }

  async salvar(material: IEditableItem<OrcamentoMaterial>): Promise<void>
  {
    material.item.valorUnitario = parseFloat((material.item.valorUnitario.toString().replace(/[^0-9,.]/g, '')).replace(',', '.'));
    material.item.quantidade = parseFloat((material.item.quantidade.toString().replace(/[^0-9,.]/g, '')).replace(',', '.'));
    material.item.valorTotal = material.item.valorUnitario * material.item.quantidade;

    this._orcMaterialService.atualizar(material.item).subscribe(m =>
    {
      this._orcService.atualizarTotalizacao(m.codOrc);
      this._snack.open('Material atualizado com sucesso.', null, this.snackConfigSuccess).afterDismissed().toPromise();
      material.oldItem = Object.assign({}, m);
    },
      e =>
      {
        this._snack.open('Erro ao atualizar o material.', null, this.snackConfigSuccess).afterDismissed().toPromise();
      });

    this.isEditing = false;
    material.isEditing = false;
  }

  cancelar(material: IEditableItem<OrcamentoMaterial>): void
  {
    material.item = Object.assign({}, material.oldItem);
    this.isEditing = false;
    material.isEditing = false;
    this._cdRef.detectChanges();
  }

  isEqual(material: IEditableItem<OrcamentoMaterial>): boolean
  {
    return isEqual(material?.item?.quantidade?.toString(), material?.oldItem?.quantidade?.toString()) ||
      isEqual(material?.item?.valorUnitario?.toString(), material?.oldItem?.valorUnitario?.toString());
  }

  isInvalid(material: IEditableItem<OrcamentoMaterial>): boolean
  {
    if (material.item.valorUnitario < 0 || material.item.quantidade < 0)
      return true;

    return false;
  }

  excluirMaterial(m: IEditableItem<OrcamentoMaterial>) 
  {
    const dialogRef = this._dialog.open(ConfirmacaoDialogComponent, {
      data: {
        titulo: 'Confirmação',
        message: `Deseja remover o material ${m?.item.codigoMagnus}?`,
        buttonText: {
          ok: 'Sim',
          cancel: 'Não'
        }
      },
      backdropClass: 'static'
    });

    dialogRef.afterClosed().subscribe((confirmacao: boolean) =>
    {
      if (confirmacao)
      {
        this._orcMaterialService.deletar(m.item.codOrcMaterial).subscribe(d =>
        {
          this._snack.open('Material removido com sucesso.', null, this.snackConfigSuccess).afterDismissed().toPromise();

          const index = this.editableList.indexOf(m);
          if (index > -1)
            this.editableList.splice(index, 1);

          this._orcService.atualizarTotalizacao(m.item.codOrc);
        },
          e =>
          {
            this._snack.open('Erro ao remover material.', null, this.snackConfigDanger).afterDismissed().toPromise();
          });
      }
    });
  }
}