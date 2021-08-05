import { Meta, QueryStringParameters } from "./generic.types";

export interface Causa {
    codCausa: number;
    codTipoCausa: number;
    codECausa: string;
    nomeCausa: string;
    codServico: number;
    indAtivo: number;
    codTraducao?: any;
}

export interface CausaData extends Meta {
    causas: Causa[];
};

export interface CausaParameters extends QueryStringParameters {
    indAtivo?: number;
};