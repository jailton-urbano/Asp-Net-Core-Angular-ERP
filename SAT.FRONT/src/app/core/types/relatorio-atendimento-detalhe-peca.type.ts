import { Peca } from "./peca.types";

export class RelatorioAtendimentoDetalhePeca
{
    codRATDetalhePeca?: number;
    codRATDetalhe?: number;
    codPeca: number;
    peca?: Peca;
    qtdePecas: number;
    valPecas?: any;
    ap?: number;
    datIncPP?: any;
    qtdeLib?: any;
    descStatus?: any;
    codPecaSubst?: any;
    indPecaSubst?: any;
    indCentral?: any;
    indOK?: any;
    indNotaFiscal?: any;
    codUsuarioCad: string;
    dataHoraCad: string;
    codUsuarioManut?: any;
    dataHoraManut?: any;
    codUsuarioManutencao?: any;
    dataManutencao?: string;
    codMagnusInconsistente?: string;
    indPassivelConserto?: number;
    notaFiscal?: any;
    nfStatus?: any;
    numSerie?: any;
    motivoSubstituicao?: any;
    removido: boolean;
}