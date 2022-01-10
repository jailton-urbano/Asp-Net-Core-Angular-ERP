import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { appConfig, appConfig as c } from 'app/core/config/app.config'
import { Orcamento, OrcamentoData, OrcamentoDeslocamento, OrcamentoMaoDeObra, OrcamentoMaterial, OrcamentoMotivoEnum, OrcamentoParameters } from '../types/orcamento.types';
import { OrdemServicoService } from './ordem-servico.service';
import { UserService } from '../user/user.service';
import { UserSession } from '../user/user.types';
import moment from 'moment';
import { OrdemServico, OrdemServicoIncludeEnum } from '../types/ordem-servico.types';
import Enumerable from 'linq';
import { ContratoServico } from '../types/contrato.types';
import { TipoServicoEnum } from '../types/tipo-servico.types';
import { Peca } from '../types/peca.types';

@Injectable({
    providedIn: 'root'
})
export class OrcamentoService
{
    userSession: UserSession;

    constructor (private http: HttpClient, private _osService: OrdemServicoService, private _userService: UserService) 
    {
        this.userSession = JSON.parse(this._userService.userSession);
    }

    obterPorParametros(parameters: OrcamentoParameters): Observable<OrcamentoData>
    {
        let params = new HttpParams();

        Object.keys(parameters).forEach(key =>
        {
            if (parameters[key] !== undefined && parameters[key] !== null) params = params.append(key, String(parameters[key]));
        });

        return this.http.get(`${c.api}/Orcamento`, { params: params }).pipe(
            map((data: OrcamentoData) => data)
        )
    }

    obterPorCodigo(codOrcamento: number): Observable<Orcamento>
    {
        const url = `${c.api}/Orcamento/${codOrcamento}`;
        return this.http.get<Orcamento>(url).pipe(
            map((obj) => obj)
        );
    }

    criar(orcamento: Orcamento): Observable<Orcamento>
    {
        return this.http.post<Orcamento>(`${c.api}/Orcamento`, orcamento).pipe(
            map((obj) => obj)
        );
    }

    atualizar(orcamento: Orcamento): Observable<Orcamento>
    {
        const url = `${c.api}/Orcamento`;

        return this.http.put<Orcamento>(url, orcamento).pipe(
            map((obj) => obj)
        );
    }

    deletar(codOrcamento: number): Observable<Orcamento>
    {
        const url = `${c.api}/Orcamento/${codOrcamento}`;

        return this.http.delete<Orcamento>(url).pipe(
            map((obj) => obj)
        );
    }

    async criarNovoOrcamento(codOS: number)
    {
        var os = (await this._osService.obterPorParametros(
            {
                codOS: codOS.toString(),
                include: OrdemServicoIncludeEnum.OS_ORCAMENTO
            }).toPromise()).items.shift();

        if (os === null) return;

        var orcamento: Orcamento = await this.carregaDadosContrato(os);
        orcamento = this.carregaMateriais(os, orcamento);
        orcamento = this.carregaMaoDeObra(os, orcamento);
        orcamento = this.carregaDeslocamento(os, orcamento);
        orcamento = this.calcularTotal(orcamento);

        var orc = (await this.atualizar(orcamento).toPromise());
        return orc;
    }

    private async carregaDadosContrato(os: OrdemServico): Promise<Orcamento>
    {
        var orcamento: Orcamento =
        {
            codigoOrdemServico: os?.codOS,
            codigoContrato: os?.codContrato,
            codigoMotivo: 1,
            codigoStatus: 1,
            codigoPosto: os?.codPosto,
            codigoCliente: os?.codCliente,
            codigoFilial: os?.codFilial,
            codigoEquipamentoContrato: os?.codEquipContrato,
            codigoEquipamento: os?.codEquip,
            codigoSla: os?.equipamentoContrato?.codSLA,
            nomeContrato: os?.equipamentoContrato?.contrato?.nomeContrato,
            isMaterialEspecifico: os?.equipamentoContrato?.contrato?.indPermitePecaEspecifica,
            detalhe: os?.relatoriosAtendimento?.find(i => i.relatoSolucao !== null)?.relatoSolucao ?? '',
            valorIss: os?.filial?.orcamentoISS?.valor,
            usuarioCadastro: this.userSession?.usuario?.codUsuario,
            dataCadastro: moment().format('yyyy-MM-DD HH:mm:ss'),
            data: moment().format('yyyy-MM-DD HH:mm:ss')

        }

        var orc = (await this.criar(orcamento).toPromise());
        orc.numero = os?.filial?.nomeFilial + orc?.codOrc;
        orc = (await this.atualizar(orc).toPromise());

        return orc;
    }

    private carregaMateriais(os: OrdemServico, orcamento: Orcamento): Orcamento
    {
        var materiais: OrcamentoMaterial[] = [];

        var detalhesPeca = Enumerable.from(os.relatoriosAtendimento)
            .selectMany(i => i.relatorioAtendimentoDetalhes)
            .selectMany(i => i.relatorioAtendimentoDetalhePecas)
            .toArray();

        detalhesPeca.forEach(dp =>
        {
            var material: OrcamentoMaterial =
            {
                codOrc: orcamento?.codOrc,
                codigoMagnus: dp?.peca?.codMagnus,
                codigoPeca: dp?.peca?.codPeca.toString(),
                descricao: dp?.peca?.nomePeca,
                quantidade: dp?.qtdePecas,
                valorUnitario: this.obterValorMaterial(orcamento, dp?.peca),
                valorUnitarioFinanceiro: this.obterValorUnitarioFinanceiroMaterial(orcamento, dp?.peca),
                valorIpi: dp?.peca?.valIPI,
                usuarioCadastro: this.userSession?.usuario?.codUsuario,
                dataCadastro: moment().format('yyyy-MM-DD HH:mm:ss')
            }

            material.valorTotal = (material.quantidade * material.valorUnitario) - material.valorDesconto;

            // cria material
            materiais.push(material);
        });

        orcamento.materiais = materiais;

        return orcamento;
    }

    private obterValorMaterial(orcamento: Orcamento, peca: Peca)
    {
        if (peca?.indValorFixo === 1)
            return peca?.clientePecaGenerica?.valorUnitario || peca?.valPeca;

        return orcamento?.isMaterialEspecifico === 1 ?
            peca?.clientePeca?.find(i => i.codCliente == orcamento?.codigoCliente && i?.codContrato == orcamento?.codigoContrato)?.valorUnitario :
            ((peca?.valPeca + (peca?.valPeca * (peca?.valIPI / 100.0))) * 1.025) / appConfig.parametroReajusteValorOrcamento;
    }

    private obterValorUnitarioFinanceiroMaterial(orcamento: Orcamento, peca: Peca)
    {
        if (orcamento.isMaterialEspecifico === 1)
        {
            if (peca?.valIPI <= 0 || peca?.valIPI === null)
                return peca?.valPeca;

            return peca?.valPeca / (1 + (peca?.valIPI / 100.0));
        }

        return (peca?.valPeca * 1.025) / appConfig.parametroReajusteValorOrcamento;
    }

    private carregaMaoDeObra(os: OrdemServico, orcamento: Orcamento): Orcamento
    {
        var maoDeObra: OrcamentoMaoDeObra;

        var codServico: number =
            orcamento?.codigoMotivo == OrcamentoMotivoEnum.INSTALACAO_DESINSTACALAO ?
                TipoServicoEnum.ATIVACAO : TipoServicoEnum.HORA_TECNICA;

        var contratoServico: ContratoServico = os?.equipamentoContrato?.contrato?.contratoServico?.find(i =>
            i.codEquip == orcamento?.codigoEquipamento &&
            i.codSLA == orcamento?.codigoSla &&
            i.codServico == codServico);

        var maoDeObra: OrcamentoMaoDeObra =
        {
            codOrc: orcamento?.codOrc,
            valorHoraTecnica: contratoServico?.valor,
            previsaoHoras: 1,
            usuarioCadastro: this.userSession?.usuario.codUsuario,
            dataCadastro: moment().format('yyyy-MM-DD HH:mm:ss')
        }

        maoDeObra.valorTotal = maoDeObra?.previsaoHoras * maoDeObra?.valorHoraTecnica;

        // cria mao de obra
        orcamento.maoDeObra = maoDeObra;

        return orcamento;
    }

    private carregaDeslocamento(os: OrdemServico, orcamento: Orcamento): Orcamento
    {
        var valorUnitarioKmRodado = os?.equipamentoContrato?.contrato?.contratoServico?.find(i =>
            i.codEquip == orcamento?.codigoEquipamento &&
            i.codSLA == orcamento?.codigoSla &&
            i.codServico == TipoServicoEnum.KM_RODADO)?.valor;

        var valorHoraDeslocamento = os?.equipamentoContrato?.contrato?.contratoServico?.find(i =>
            i.codEquip == orcamento?.codigoEquipamento &&
            i.codSLA == orcamento?.codigoSla &&
            i.codServico == TipoServicoEnum.HORA_DE_VIAGEM)?.valor;

        var latOrigem = os?.localAtendimento?.autorizada?.latitude;
        var longOrigem = os?.localAtendimento?.autorizada?.longitude;

        var latDestino = os?.localAtendimento?.latitude;
        var longDestino = os?.localAtendimento?.longitude;

        var deslocamento: OrcamentoDeslocamento =
        {
            codOrc: orcamento?.codOrc,
            valorUnitarioKmRodado: valorUnitarioKmRodado,
            valorHoraDeslocamento: valorHoraDeslocamento,
            latitudeOrigem: latOrigem,
            longitudeOrigem: longOrigem,
            latitudeDestino: latDestino,
            longitudeDestino: longDestino,
            quantidadeKm: 0,
            usuarioCadastro: this.userSession?.usuario.codUsuario,
            dataCadastro: moment().format('yyyy-MM-DD HH:mm:ss'),
            data: moment().format('yyyy-MM-DD HH:mm:ss')
        }

        deslocamento.valorTotalKmRodado = deslocamento.quantidadeKm * deslocamento.valorHoraDeslocamento;
        deslocamento.quantidadeHoraCadaSessentaKm = deslocamento.quantidadeKm / 65.0;
        deslocamento.valorTotalKmDeslocamento = deslocamento.valorHoraDeslocamento * deslocamento.quantidadeHoraCadaSessentaKm;

        // cria deslocamento
        orcamento.orcamentoDeslocamento = deslocamento;

        return orcamento;
    }

    private calcularTotal(orcamento: Orcamento): Orcamento
    {
        orcamento.valorTotal =
            (Enumerable.from(orcamento?.materiais).sum(i => i?.valorTotal) +
                orcamento?.maoDeObra?.valorTotal +
                orcamento?.orcamentoDeslocamento?.valorTotalKmDeslocamento) ?? 0;

        orcamento.valorTotalDesconto =
            Enumerable.from(orcamento.descontos).sum(i => i.valorTotal) ?? 0;

        return orcamento;
    }
}