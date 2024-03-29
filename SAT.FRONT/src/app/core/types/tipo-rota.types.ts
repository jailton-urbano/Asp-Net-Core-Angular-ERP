import { Meta, QueryStringParameters } from "./generic.types";

export class TipoRota {
    codTipoRota: number;
    nomeTipoRota: string;
}

export interface TipoRotaData extends Meta {
    items: TipoRota[];
};

export interface TipoRotaParameters extends QueryStringParameters {
    codTipoRota?: number;
};

export enum TipoRotaEnum {
    Urbana = 1,
    Rodoviaria = 2
}