import { style } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Importacao } from './../../../core/types/importacao.types';
import { Component, AfterViewInit } from '@angular/core';
import { ImportacaoConfiguracaoService } from 'app/core/services/importacao-configuracao.service';
import { ImportacaoTipoService } from 'app/core/services/importacao-tipo.service';
import { ImportacaoTipo } from 'app/core/types/importacao-configuracao.type';
import { ImportacaoService } from 'app/core/services/importacao.service';
import { CustomSnackbarService } from 'app/core/services/custom-snackbar.service';

@Component({
	selector: 'app-importacao',
	templateUrl: './importacao.component.html'
})

export class ImportacaoComponent implements AfterViewInit {
	isLoading: boolean = false;
	planilhaConfig: any;
	planilha: any;
	idPlanilha: number;
	importacaoTipos: ImportacaoTipo[];
	codImportacaoTipo: number;
	loading: boolean;

	constructor(
		private _importacaoConfService: ImportacaoConfiguracaoService,
		private _importacaoTipoService: ImportacaoTipoService,
		private _importacaoService: ImportacaoService,
		private _snack: CustomSnackbarService,
		public _dialog: MatDialog

	) { }

	ngAfterViewInit() {
		this.obterDados();
	}

	async obterDados() {
		this.importacaoTipos = (await this._importacaoTipoService.obterPorParametros({indAtivo: 1}).toPromise()).items
	}

	async configura(codImportacaoTipo: number, dados: any = null) {
		this.codImportacaoTipo = codImportacaoTipo;
		const config = (await this._importacaoConfService.obterPorParametros({ codImportacaoTipo: codImportacaoTipo }).toPromise()).items;

		let configData = config.map((conf) => {
			return {
				dados: {
					[conf.propriedade]: ''
				},
				colunas: {
					title: conf.titulo,
					width: conf.largura,
					type: conf.tipoHeader,
					mask: conf.mascara
				}
			}
		});

		let dadosMap = [{}]
		configData.map(({ dados }) => dados).forEach(dado => {
			dadosMap[0][Object.keys(dado)[0]] = '';
		});

		this.idPlanilha = codImportacaoTipo;
		this.planilhaConfig = {
			id: codImportacaoTipo,
			dados: dados ?? dadosMap,
			colunas: configData.map(({ colunas }) => colunas)
		}
	}

	retornaPlanilha(json: any) {
		this.planilha = json;
	}


	enviarDados() {
		this.isLoading = true;

		const importacaoLinhas = this.planilha.map(lines => {
			return Object.entries(lines).map(prop => {
				return {
					campo: prop[0].trim(),
					valor: prop[1]
				}
			});
		}).map(col => {
			return {
				importacaoColuna: col
			}
		});
		
		this._importacaoService.importar({
			id: this.idPlanilha,
			importacaoLinhas: importacaoLinhas
		}).subscribe(r => {
			this.isLoading = false;

			let dados: any[] = r.importacaoLinhas.filter(line => line.erro == 1);
			dados.length > 0 
					//? this._snack.exibirAlerta('Implantação concluída com ' + dados.length + ' erros. Um email foi enviado com os detalhes' ) 
					? this._snack.exibirToast('Importacão concluída com ' + dados.length + ' erros. Um email foi enviado com os detalhes','error',10000)
					: this._snack.exibirToast('Importação realizada com sucesso. Um email foi enviado com os detalhes','success',10000); 
		});
	}
}

