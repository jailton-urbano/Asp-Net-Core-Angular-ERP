import { Equipamento } from './equipamento.types';
import { Email } from "./email.types";

export interface Exportacao
{
    email?: Email;
    formatoArquivo: ExportacaoFormatoEnum;
    tipoArquivo: ExportacaoTipoEnum;
    entityParameters: any;
}

export enum ExportacaoFormatoEnum {
    EXCEL,
    PDF
}

export enum ExportacaoTipoEnum {
    ORDEM_SERVICO,
    EQUIPAMENTO_CONTRATO,
    ACAO,
    AUTORIZADA,
    TECNICO,
    ACAO_COMPONENTE,
    CIDADE,
    CLIENTE,
    CLIENTEPECA,
    CLIENTEPECAGENERICA,
    CLIENTEBANCADA,
    CONTRATO,
    DEFEITO,
    EQUIPAMENTO,
    GRUPOEQUIPAMENTO,
    TIPOEQUIPAMENTO,
    DEFEITOCOMPONENTE,
    EQUIPAMENTOMODULO,
    FERIADO,
    FERRAMENTATECNICO,
    FORMAPAGAMENTO,
    LIDERTECNICO,
    LOCALATENDIMENTO,
    PECA,
    USUARIO,
    ORCAMENTO,
    REGIAO,
    REGIAOAUTORIZADA,
    FILIAL,
    TICKET,
    AUDITORIA,
    VALOR_COMBUSTIVEL
}