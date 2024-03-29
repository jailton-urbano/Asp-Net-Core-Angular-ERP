import { Meta, QueryStringParameters } from "./generic.types";

export class MotivoAgendamento {
    codMotivo: number;
    descricaoMotivo: string;
    indAtivo: string;
}

export interface MotivoAgendamentoData extends Meta {
    items: MotivoAgendamento[]
};

export interface MotivoAgendamentoParameters extends QueryStringParameters {
    codMotivo?: number;
    indAtivo?: number;
};