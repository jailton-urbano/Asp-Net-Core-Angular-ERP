import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { OrcamentoOutroServicoService } from 'app/core/services/orcamento-outro-servico.service';
import { OrcamentoService } from 'app/core/services/orcamento.service';
import { OrcamentoOutroServico } from 'app/core/types/orcamento-outro-servico.types';
import { OrcamentoTipoOutroServicoEnum } from 'app/core/types/orcamento.types';
import Enumerable from 'linq';
import moment from 'moment';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-orcamento-add-outro-servico-dialog',
	templateUrl: './orcamento-add-outro-servico-dialog.component.html'
})
export class OrcamentoAddOutroServicoDialogComponent implements OnInit {
	snackConfigDanger: MatSnackBarConfig = { duration: 2000, panelClass: 'danger', verticalPosition: 'top', horizontalPosition: 'right' };
	snackConfigSuccess: MatSnackBarConfig = { duration: 2000, panelClass: 'success', verticalPosition: 'top', horizontalPosition: 'right' };

	form: FormGroup;
	protected _onDestroy = new Subject<void>();
	tipoServicos: string[] = [];
	codOrc: number;

	constructor(@Inject(MAT_DIALOG_DATA) private data: any,
		private _formBuilder: FormBuilder,
		private _orcOutroServicoService: OrcamentoOutroServicoService,
		private _orcService: OrcamentoService,
		private _snack: MatSnackBar,
		public dialogRef: MatDialogRef<OrcamentoAddOutroServicoDialogComponent>) {
		if (data)
			this.codOrc = data.codOrc;
	}

	async ngOnInit() {
		this.inicializarForm();
		this.registerEmitters();
		this.obterTiposServico();
	}

	private inicializarForm(): void {
		this.form = this._formBuilder.group({
			codOrc: [this.codOrc, [Validators.required]],
			tipo: [undefined, [Validators.required]],
			descricao: [undefined, [Validators.required]],
			quantidade: [undefined, [Validators.required]],
			valorUnitario: [undefined, [Validators.required]]
		});
	}

	registerEmitters() {
		this.form.controls.tipo.valueChanges.subscribe(v => {
			this.form.controls.descricao.setValue(v);
		});
	}

	async obterTiposServico() {
		this.tipoServicos = Enumerable.from(OrcamentoTipoOutroServicoEnum)
			.select(i => i.value)
			.orderBy(i => i)
			.toArray();
	}

	inserir(): void {
		var outroServico: OrcamentoOutroServico = this.form.getRawValue();
		outroServico.valorTotal = outroServico.quantidade * outroServico.valorUnitario;
		outroServico.dataCadastro = moment().format('yyyy-MM-DD HH:mm:ss');

		this._orcOutroServicoService.criar(outroServico).subscribe(m => {
			this._orcService.atualizarTotalizacao(m.codOrc);
			this._snack.open('Serviço adicionado com sucesso.', null, this.snackConfigSuccess).afterDismissed().toPromise();
			this.dialogRef.close({ ...outroServico, ...m });
		},
			e => {
				this._snack.open('Erro ao adicionar serviço.', null, this.snackConfigDanger).afterDismissed().toPromise();
				this.dialogRef.close(null);
			});
	}

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}
}