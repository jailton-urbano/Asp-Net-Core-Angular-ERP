import { Component, ElementRef, ViewChild, AfterViewInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as jspreadsheet from "jspreadsheet-ce";

@Component({
	selector: 'app-planilha',
	templateUrl: './planilha.component.html',

})

export class PlanilhaComponent implements AfterViewInit {

	@ViewChild("spreadsheet") spreadsheet: ElementRef;
	@Input() data: object = {};
	@Input() indExport: number = 0;
	@Output() sheetData = new EventEmitter<any>();

	table: any;
	nomePlanilha: string;
	dados: object[] = [];
	colunas: object[] = [];
	constructor(

	) { }

	ngOnChanges(changes: SimpleChanges) {
		if (this.indExport == 0) {

			this.dados = this.data['dados'];
			this.colunas = this.data['colunas'];

			this.spreadsheet.nativeElement.innerHTML = '';
			this.criaPlanilha();
		}
		else {

		}

	}

	ngAfterViewInit() {

		this.criaPlanilha();
	}

	criaPlanilha() {
		let me = this;
		this.table = jspreadsheet(this.spreadsheet.nativeElement, {
			onafterchanges: function () {
				me.sheetData.emit(me.table.getJson());
			},
			data: this.dados,
			columns: this.colunas,
			csvFileName: this.nomePlanilha,
			csvDelimiter: ';',
			minDimensions: [
				this.colunas.length > 0 ? this.colunas.length : 27
				, 30],
		});
	}
}
