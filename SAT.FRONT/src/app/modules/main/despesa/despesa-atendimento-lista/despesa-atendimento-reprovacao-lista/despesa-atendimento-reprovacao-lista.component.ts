import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { DespesaPeriodoTecnicoService } from 'app/core/services/despesa-periodo-tecnico.service';
import { Cidade } from 'app/core/types/cidade.types';
import { DespesaPeriodoTecnico } from 'app/core/types/despesa-periodo.types';
import { Despesa, DespesaItem, DespesaTipoEnum } from 'app/core/types/despesa.types';
import Enumerable from 'linq';
import moment from 'moment';

@Component({
  selector: 'app-despesa-atendimento-reprovacao-lista',
  templateUrl: './despesa-atendimento-reprovacao-lista.component.html',
  styles: [`.list-grid-despesa-atendimento-reprovacao {
            grid-template-columns: 80px 80px auto 100px 75px 75px 75px;
            @screen sm { grid-template-columns: 80px 80px auto 100px 75px 75px 75px; }
            @screen md { grid-template-columns: 80px 80px auto 100px 75px 75px 75px; }
            @screen lg { grid-template-columns: 80px 80px auto 100px 75px 75px 75px; }
        }
    `],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [{ provide: LOCALE_ID, useValue: "pt-BR" }]
})

export class DespesaAtendimentoReprovacaoListaComponent implements OnInit
{
  isLoading: boolean = false;
  despesaPeriodoTecnico: DespesaPeriodoTecnico;
  despesas: Despesa[] = [];
  despesaItens: DespesaItem[] = [];
  codDespesaPeriodoTecnico: number;
  despesaItemSelecionada: DespesaItem;
  despesaSelecionadaForm: FormGroup;

  constructor (private _despesaPeriodoTecnicoService: DespesaPeriodoTecnicoService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef)
  {
    this.codDespesaPeriodoTecnico = +this._route.snapshot.paramMap.get('codDespesaPeriodoTecnico');
  }

  async ngOnInit()
  {
    await this.getDespesas();
    this.criarForm();
    this.registerEmitters();
  }

  private criarForm()
  {
    this.despesaSelecionadaForm = this._formBuilder.group({
      dataInicio: [undefined],
      dataSolucao: [undefined],
      valorUnitario: [undefined],
      notaFiscal: [undefined],
      kmPercorrido: [undefined],
      kmPrevisto: [undefined],
      motivo: [undefined],
      observacao: [undefined],
      origem: [undefined],
      destino: [undefined],
      indReprovado: [undefined]
    });
  }

  private registerEmitters()
  {
    this.despesaSelecionadaForm.controls['indReprovado'].valueChanges.subscribe(async () =>
    {
      var currentValue =
        this.despesaItemSelecionada.indReprovado == 1 ? true : false;

      if (this.despesaSelecionadaForm.controls['indReprovado'].value != currentValue)
      {
        // atualiza
      }

    });
  }

  async getDespesas()
  {
    this.isLoading = true;

    this.despesaPeriodoTecnico =
      (await this._despesaPeriodoTecnicoService.obterPorCodigo(this.codDespesaPeriodoTecnico).toPromise());

    this.despesas =
      this.despesaPeriodoTecnico.despesas;

    this.despesaItens = Enumerable.from(this.despesas)
      .selectMany(i => i.despesaItens)
      .toArray();

    this.isLoading = false;
  }


  async toggleDetails(codDespesaItem: number)
  {
    if (this.despesaItemSelecionada && this.despesaItemSelecionada.codDespesaItem === codDespesaItem)
    {
      this.closeDetails();
      return;
    }

    var despesa =
      Enumerable.from(this.despesas)
        .selectMany(i => i.despesaItens).
        firstOrDefault(i => i.codDespesaItem == codDespesaItem);

    this.despesaItemSelecionada = despesa;

    await this.populateForm(despesa);

    this._changeDetectorRef.markForCheck();
  }

  async populateForm(despesaItem: DespesaItem)
  {
    var despesa = Enumerable.from(this.despesas)
      .firstOrDefault(i => Enumerable.from(i.despesaItens)
        .contains(despesaItem));

    this.despesaSelecionadaForm.controls['dataInicio']
      .setValue(moment(despesa.relatorioAtendimento.dataHoraInicio).format('DD/MM/YY HH:mm'));

    this.despesaSelecionadaForm.controls['dataSolucao']
      .setValue(moment(despesa.relatorioAtendimento.dataHoraSolucao).format('DD/MM/YY HH:mm'));

    this.despesaSelecionadaForm.controls['valorUnitario']
      .setValue(despesaItem.despesaValor);

    this.despesaSelecionadaForm.controls['notaFiscal']
      .setValue(despesaItem.numNF ?? "Não consta");


    if (despesaItem.codDespesaTipo != DespesaTipoEnum.KM) return;

    this.despesaSelecionadaForm.controls['kmPercorrido']
      .setValue(despesaItem.kmPercorrido);

    this.despesaSelecionadaForm.controls['kmPrevisto']
      .setValue(despesaItem.kmPrevisto);

    this.despesaSelecionadaForm.controls['motivo']
      .setValue(despesaItem.obsReprovacao ?? "Não consta");

    this.despesaSelecionadaForm.controls['observacao']
      .setValue(despesaItem.obs ?? "Não consta");

    this.despesaSelecionadaForm.controls['destino']
      .setValue(this.populateAddress(despesaItem.enderecoDestino, despesaItem.bairroDestino, despesaItem.numDestino, despesaItem.cidadeDestino));

    this.despesaSelecionadaForm.controls['origem']
      .setValue(this.populateAddress(despesaItem.enderecoOrigem, despesaItem.bairroOrigem, despesaItem.numOrigem, despesaItem.cidadeOrigem));

    this.despesaSelecionadaForm.controls['indReprovado']
      .setValue(despesaItem.indReprovado == 1 ? true : false);
  }

  closeDetails(): void
  {
    this.despesaItemSelecionada = null;
  }

  private populateAddress(endereco: string, bairro: string, numero: string, cidade: Cidade): string
  {
    var enderecoFormatado = "";

    if (endereco)
      enderecoFormatado += endereco + ", ";

    if (bairro)
      enderecoFormatado += bairro + ", ";

    if (numero)
      enderecoFormatado += numero;

    if (cidade?.nomeCidade)
      enderecoFormatado += ", " + cidade.nomeCidade;

    if (cidade?.unidadeFederativa?.siglaUF)
      enderecoFormatado += " - " + cidade.unidadeFederativa.siglaUF;

    return enderecoFormatado.toUpperCase();
  }

  showInMap()
  {

  }
}
