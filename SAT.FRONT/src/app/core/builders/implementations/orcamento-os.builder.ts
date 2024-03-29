import { Injectable } from "@angular/core";
import { appConfig } from "app/core/config/app.config";
import { OrcamentoDeslocamentoService } from "app/core/services/orcamento-deslocamento.service";
import { OrcamentoMaoDeObraService } from "app/core/services/orcamento-mao-de-obra.service";
import { OrcamentoMaterialService } from "app/core/services/orcamento-material.service";
import { OrcamentoService } from "app/core/services/orcamento.service";
import { ContratoServico } from "app/core/types/contrato.types";
import { OrcamentoMaoDeObra } from "app/core/types/orcamento-mao-de-obra.types";
import { OrcamentoMaterial } from "app/core/types/orcamento.material.types";
import { Orcamento, OrcamentoDeslocamento, OrcamentoMotivoEnum } from "app/core/types/orcamento.types";
import { OrdemServico } from "app/core/types/ordem-servico.types";
import { Peca } from "app/core/types/peca.types";
import { TipoServicoEnum } from "app/core/types/tipo-servico.types";
import { UserSession } from "app/core/user/user.types";
import Enumerable from "linq";
import moment from "moment";
import { IOrcamentoOSBuilder, ISpecifyDeslocamentoOrcamentoOSBuilder, ISpecifyMaoDeObraOrcamentoOSBuilder, ISpecifyMateriaisOrcamentoOSBuilder } from "../interfaces/iorcamento-os.builder";
import { OrcamentoBuilder } from "./orcamento.builder";

@Injectable({
    providedIn: 'root'
})
export class OrcamentoOSBuilder extends OrcamentoBuilder {
    private orcamento: Orcamento = null;
    private os: OrdemServico;
    private userSession: UserSession;

    constructor(
        private _orcamentoService: OrcamentoService,
        private _orcMaoDeObraService: OrcamentoMaoDeObraService,
        private _orcMaterialService: OrcamentoMaterialService,
        private _orcDeslocamentoService: OrcamentoDeslocamentoService) {
        super();
    }

    async specifyBase(): Promise<ISpecifyMateriaisOrcamentoOSBuilder> {
        this.orcamento =
        {
            codigoOrdemServico: this.os?.codOS,
            codigoContrato: this.os?.codContrato,
            codigoMotivo: 1,
            codigoStatus: 1,
            codigoPosto: this.os?.codPosto,
            codigoCliente: this.os?.codCliente,
            codigoFilial: this.os?.codFilial,
            codigoEquipamentoContrato: this.os?.codEquipContrato,
            codigoEquipamento: this.os?.codEquip,
            codigoSla: this.os?.equipamentoContrato?.codSLA,
            nomeContrato: this.os?.equipamentoContrato?.contrato?.nomeContrato,
            isMaterialEspecifico: this.os?.equipamentoContrato?.contrato?.indPermitePecaEspecifica,
            detalhe: this.os?.relatoriosAtendimento?.find(i => i.relatoSolucao !== null)?.relatoSolucao ?? '',
            valorIss: this.os?.filial?.orcamentoISS?.valor,
            usuarioCadastro: this.userSession?.usuario?.codUsuario,
            dataCadastro: moment().format('yyyy-MM-DD HH:mm:ss'),
            data: moment().format('yyyy-MM-DD HH:mm:ss')
        }

        this.orcamento =
            (await this._orcamentoService.criar(this.orcamento).toPromise());

        this.orcamento.numero =
            this.os?.filial?.nomeFilial + this.orcamento?.codOrc;

        this.orcamento =
            (await this._orcamentoService.atualizar(this.orcamento).toPromise());

        return this;
    }

    async specifyMateriais(): Promise<ISpecifyMaoDeObraOrcamentoOSBuilder> {
        var materiais: OrcamentoMaterial[] = [];

        var detalhesPeca = Enumerable.from(this.os.relatoriosAtendimento)
            .selectMany(i => i.relatorioAtendimentoDetalhes)
            .selectMany(i => i.relatorioAtendimentoDetalhePecas)
            .toArray();

        for (const dp of detalhesPeca) {
            var m: OrcamentoMaterial =
            {
                codOrc: this.orcamento?.codOrc,
                codigoMagnus: dp?.peca?.codMagnus,
                codigoPeca: dp?.peca?.codPeca.toString(),
                descricao: dp?.peca?.nomePeca,
                quantidade: dp?.qtdePecas,
                valorUnitario: this.obterValorMaterial(dp?.peca),
                valorUnitarioFinanceiro: this.obterValorUnitarioFinanceiroMaterial(dp?.peca),
                valorIpi: dp?.peca?.valIPI,
                usuarioCadastro: this.userSession?.usuario?.codUsuario,
                dataCadastro: moment().format('yyyy-MM-DD HH:mm:ss')
            }

            m.valorTotal =
                (m.quantidade * m.valorUnitario) - (m.valorDesconto ?? 0);

            m = await this._orcMaterialService.criar(m).toPromise();

            materiais.push(m);
        };

        this.orcamento.orcamentoMateriais = materiais;

        return this;
    }

    private obterValorMaterial(peca: Peca) {
        if (peca?.indValorFixo === 1)
            return peca?.clientePecaGenerica?.valorUnitario || peca?.valPeca;

        return this.orcamento?.isMaterialEspecifico === 1 ?
            peca?.clientePeca?.find(i => i.codCliente == this.orcamento?.codigoCliente && i?.codContrato == this.orcamento?.codigoContrato)?.valorUnitario :
            ((peca?.valPeca + (peca?.valPeca * (peca?.valIPI / 100.0))) * 1.025) / appConfig.parametroReajusteValorOrcamento;
    }

    private obterValorUnitarioFinanceiroMaterial(peca: Peca) {
        if (this.orcamento.isMaterialEspecifico === 1) {
            if (peca?.valIPI <= 0 || peca?.valIPI === null)
                return peca?.valPeca;

            return peca?.valPeca / (1 + (peca?.valIPI / 100.0));
        }

        return (peca?.valPeca * 1.025) / appConfig.parametroReajusteValorOrcamento;
    }

    async specifyMaoDeObra(): Promise<ISpecifyDeslocamentoOrcamentoOSBuilder> {
        var codServico: number =
            this.orcamento?.codigoMotivo == OrcamentoMotivoEnum.INSTALACAO_DESINSTACALAO ?
                TipoServicoEnum.ATIVACAO : TipoServicoEnum.HORA_TECNICA;

        var contratoServico: ContratoServico = this.os?.equipamentoContrato?.contrato?.contratoServico?.find(i =>
            i.codEquip == this.orcamento?.codigoEquipamento &&
            i.codSLA == this.orcamento?.codigoSla &&
            i.codServico == codServico);

        var m: OrcamentoMaoDeObra =
        {
            codOrc: this.orcamento?.codOrc,
            valorHoraTecnica: contratoServico?.valor,
            previsaoHoras: 2,
            usuarioCadastro: this.userSession?.usuario.codUsuario,
            dataCadastro: moment().format('yyyy-MM-DD HH:mm:ss')
        }

        m.valorTotal =
            m?.previsaoHoras * m?.valorHoraTecnica;

        m =
            await this._orcMaoDeObraService.criar(m).toPromise();

        this.orcamento.maoDeObra = m;

        return this;
    }

    async specifyDeslocamento(): Promise<IOrcamentoOSBuilder> {
        var valorUnitarioKmRodado =
            this.os?.equipamentoContrato?.contrato?.contratoServico?.find(i =>
                i.codEquip == this.orcamento?.codigoEquipamento &&
                i.codSLA == this.orcamento?.codigoSla &&
                i.codServico == TipoServicoEnum.KM_RODADO)?.valor ?? 0;

        var valorHoraDeslocamento =
            this.os?.equipamentoContrato?.contrato?.contratoServico?.find(i =>
                i.codEquip == this.orcamento?.codigoEquipamento &&
                i.codSLA == this.orcamento?.codigoSla &&
                i.codServico == TipoServicoEnum.HORA_DE_VIAGEM)?.valor ?? 0;

        var d: OrcamentoDeslocamento =
        {
            codOrc: this.orcamento?.codOrc,
            valorUnitarioKmRodado: valorUnitarioKmRodado,
            valorHoraDeslocamento: valorHoraDeslocamento,
            latitudeOrigem: this.os?.localAtendimento?.autorizada?.latitude,
            longitudeOrigem: this.os?.localAtendimento?.autorizada?.longitude,
            latitudeDestino: this.os?.localAtendimento?.latitude,
            longitudeDestino: this.os?.localAtendimento?.longitude,
            quantidadeKm: this.os?.localAtendimento?.distanciaKmPatRes * 2,
            usuarioCadastro: this.userSession?.usuario.codUsuario,
            dataCadastro: moment().format('yyyy-MM-DD HH:mm:ss'),
            data: moment().format('yyyy-MM-DD HH:mm:ss')
        }

        d.valorTotalKmRodado =
            d.quantidadeKm * d.valorUnitarioKmRodado;

        d.quantidadeHoraCadaSessentaKm =
            d.quantidadeKm / 60.0;

        d.valorTotalKmDeslocamento =
            d.valorHoraDeslocamento * d.quantidadeHoraCadaSessentaKm;

        d =
            await this._orcDeslocamentoService.criar(d).toPromise();
        this.orcamento.orcamentoDeslocamento = d;

        return this;
    }

    async build(): Promise<Orcamento> {
        this.orcamento =
            this.calculaTotalizacao(this.orcamento);

        this.orcamento =
            (await this._orcamentoService.atualizar(this.orcamento).toPromise());

        return this.orcamento;
    }

    async create(os: OrdemServico, userSession: UserSession): Promise<Orcamento> {
        this.os = os;
        this.userSession = userSession;

        return new Promise((resolve, reject) =>
            this.specifyBase().then(r =>
                r.specifyMateriais().then(d =>
                    d.specifyMaoDeObra().then(p =>
                        p.specifyDeslocamento().then(l =>
                            resolve(l.build()))))));
    }
}