import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { appConfig } from 'app/core/config/app.config';
import { DespesaAdiantamentoPeriodoService } from 'app/core/services/despesa-adiantamento-periodo.service';
import { DespesaPeriodoTecnicoService } from 'app/core/services/despesa-periodo-tecnico.service';
import { OrdemServicoService } from 'app/core/services/ordem-servico.service';
import { DespesaAdiantamentoPeriodo } from 'app/core/types/despesa-adiantamento.types';
import { DespesaPeriodoTecnico } from 'app/core/types/despesa-periodo.types';
import { Despesa, DespesaTipoEnum } from 'app/core/types/despesa.types';
import { OrdemServico } from 'app/core/types/ordem-servico.types';
import { TecnicoConta } from 'app/core/types/tecnico.types';
import Enumerable from 'linq';

@Component({
  selector: 'app-despesa-atendimento-relatorio-impressao',
  templateUrl: './despesa-atendimento-relatorio-impressao.component.html',
  styleUrls: ['./despesa-atendimento-relatorio-impressao.component.scss']
})
export class DespesaAtendimentoRelatorioImpressaoComponent implements OnInit
{
  isLoading: boolean;
  codDespesaPeriodoTecnico: number;
  despesaPeriodoTecnico: DespesaPeriodoTecnico;
  centroDeCusto: string = appConfig.rd_centro_de_custo;
  ordensServico: OrdemServico[] = [];
  adiantamentos: DespesaAdiantamentoPeriodo[] = [];
  tecnicoConta: TecnicoConta;

  constructor (
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _despesaPeriodoTecnicoSvc: DespesaPeriodoTecnicoService,
    private _despesaAdiantamentoPeriodoSvc: DespesaAdiantamentoPeriodoService,
    private _ordemServicoSvc: OrdemServicoService)
  {

    if (data)
      this.codDespesaPeriodoTecnico = data.codDespesaPeriodoTecnico;
  }

  async ngOnInit()
  {
    this.isLoading = true;

    this.despesaPeriodoTecnico =
      (await this._despesaPeriodoTecnicoSvc.obterPorCodigo(this.codDespesaPeriodoTecnico).toPromise());

    await this.obterOS();
    await this.obterAdiantamentos();
    await this.obterContaTecnico();

    this.isLoading = false;
  }

  print()
  {
    var contentToPrint = document.getElementById("print-area").innerHTML;
    var windowPopup = window.open('', '_blank', 'width=500,height=500');
    windowPopup.document.open();
    windowPopup.document.write(`<html><head><link rel="stylesheet" type="text/css" href="${appConfig.tailwind_css}"/></head><body onload = "window.print()"> ${contentToPrint} </body></html>`);
    windowPopup.document.title = `RD_${this.codDespesaPeriodoTecnico}.pdf`;
    windowPopup.onafterprint = window.close;
    windowPopup.document.close();
  }

  async obterAdiantamentos()
  {
    this.adiantamentos = (await this._despesaAdiantamentoPeriodoSvc.obterPorParametros(
      {
        codTecnico: this.despesaPeriodoTecnico.codTecnico,
        codDespesaPeriodo: this.despesaPeriodoTecnico.codDespesaPeriodo
      }).toPromise()).items;
  }

  async obterOS()
  {
    var codigos = Enumerable.from(this.despesaPeriodoTecnico.despesas)
      .select(i => i.relatorioAtendimento.codOS)
      .distinct()
      .toJoinedString(",");

    this.ordensServico = (await this._ordemServicoSvc.obterPorParametros
      ({ codOS: codigos, pageSize: codigos?.length > 0 ? codigos?.length : 1 }).toPromise()).items;
  }

  obterContaTecnico()
  {
    this.tecnicoConta = Enumerable.from(this.despesaPeriodoTecnico.tecnico.tecnicoConta)
      .firstOrDefault(i => i.indAtivo == 1);
  }

  obterCartaoCombustivel()
  {
    return Enumerable.from(this.despesaPeriodoTecnico.tecnico.despesaCartaoCombustivelTecnico)
      .orderByDescending(i => i.dataHoraInicio)
      .firstOrDefault().despesaCartaoCombustivel;
  }

  obterCliente(dp: Despesa)
  {
    return Enumerable.from(this.ordensServico)
      .firstOrDefault(i => i.codOS == dp.relatorioAtendimento.codOS).cliente.nomeFantasia;
  }

  obterTotalDespesa()
  {
    return Enumerable.from(this.despesaPeriodoTecnico.despesas)
      .where(i => i.indAtivo == 1)
      .selectMany(i => i.despesaItens)
      .where(i => i.indAtivo == 1)
      .sum(i => i.despesaValor);
  }

  obterTotalQuilometragem()
  {
    return Enumerable.from(this.despesaPeriodoTecnico.despesas)
      .where(i => i.indAtivo == 1)
      .selectMany(i => i.despesaItens)
      .where(i => i.indAtivo == 1 && i.codDespesaTipo == DespesaTipoEnum.KM)
      .sum(i => i.kmPercorrido);
  }

  obterTipoDespesa(tipo: DespesaTipoEnum)
  {
    return Enumerable.from(this.despesaPeriodoTecnico.despesas)
      .where(i => i.indAtivo == 1)
      .selectMany(i => i.despesaItens)
      .where(i => i.indAtivo == 1 && i.codDespesaTipo == tipo)
      .sum(i => i.despesaValor);
  }

  obterTotalAluguelCarro()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.ALUGUEL_CARRO);
  }

  obterTotalCorreio()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.CORREIO);
  }

  obterTotalFrete()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.FRETE);
  }

  obterTotalOutros()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.OUTROS);
  }

  obterTotalPedagio()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.PEDAGIO);
  }

  obterTotalTaxi()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.TAXI);
  }

  obterTotalCartaoTelefonico()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.CARTAO_TEL);
  }

  obterTotalEstacionamento()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.ESTACIONAMENTO);
  }

  obterTotalHotel()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.HOTEL);
  }

  obterTotalPassagemAerea()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.PA);
  }

  obterTotalCartaoCombustivel()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.KM);
  }

  obterTotalTelefone()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.TELEFONE);
  }

  obterTotalCombustivel()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.COMBUSTIVEL);
  }

  obterTotalFerramenta()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.FERRAMENTAS);
  }

  obterTotalOnibus()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.ONIBUS);
  }

  obterTotalPecas()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.PECAS);
  }

  obterTotalRefeicao()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.REFEICAO);
  }

  obterTotalInternet()
  {
    return this.obterTipoDespesa(DespesaTipoEnum.INTERNET);
  }

  obterTotalDespesaSemKM()
  {
    return Enumerable.from(this.despesaPeriodoTecnico.despesas)
      .where(i => i.indAtivo == 1)
      .selectMany(i => i.despesaItens)
      .where(i => i.indAtivo == 1 && i.codDespesaTipo != DespesaTipoEnum.KM)
      .sum(i => i.despesaValor);
  }

  obterTotalAdiantamentos()
  {
    var adiantamentos = Enumerable.from(this.adiantamentos)
      .where(i => i.despesaAdiantamento.indAtivo == 1);

    var recebido = adiantamentos.sum(i => i.despesaAdiantamento.valorAdiantamento);
    var utilizado = adiantamentos.sum(i => i.valorAdiantamentoUtilizado);

    return recebido - utilizado;
  }

  obterTotalViaDeposito()
  {
    // var despesas = this.obterTotalDespesaSemKM();
    // var adiantamentos = this.obterTotalAdiantamentos();
    // var deposito = despesas - adiantamentos;

    return this.obterTotalDespesaSemKM();
  }
}