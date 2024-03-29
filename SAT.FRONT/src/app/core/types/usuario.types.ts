import { Cargo } from "./cargo.types";
import { Cidade } from "./cidade.types";
import { Filial } from "./filial.types";
import { FiltroUsuarioData } from "./filtro.types";
import { Meta, QueryStringParameters } from "./generic.types";
import { Localizacao } from "./localizacao.types";
import { Navegacao } from "./navegacao.types";
import { Perfil } from "./perfil.types";
import { PontoUsuario } from "./ponto-usuario.types";
import { Tecnico } from "./tecnico.types";
import { UsuarioSeguranca } from "./usuario-seguranca.types";

export class Usuario {
    codUsuario: string;
    codFilial?: any;
    filial?: Filial;
    codAutorizada?: any;
    codTecnico?: any;
    codCliente?: any;
    cliente?: any;
    cargo: Cargo;
    codDepartamento?: any;
    codTurno?: any;
    codCidade: number;
    cidade?: Cidade;
    codFilialPonto?: any;
    codFusoHorario: number;
    codLingua: number;
    codPerfil: number;
    perfil: Perfil;
    codSmartCard: number;
    codContrato: string;
    dataAdmissao: Date;
    nomeUsuario: string;
    codPeca: number;
    cpf: string;
    cep: string;
    endereco: string;
    bairro: string;
    fone: string;
    foneParticular?: any;
    ramal?: any;
    email?: any;
    numCracha?: any;
    codRelatorioNaoMostrado: string;
    instalPerfilPagina?: any;
    senha: string;
    indAtivo: number;
    indAssinaInvoice?: any;
    codUsuarioCad: string;
    dataHoraCad: Date;
    codUsuarioManut: string;
    dataHoraManut: Date;
    indPonto: number;
    indBloqueio?: any;
    numero?: any;
    complemento?: any;
    codTransportadora?: any;
    indPermiteRegistrarEquipPOS: boolean;
    navegacoes: Navegacao[];
    localizacoes: Localizacao[];
    tecnico: Tecnico;
    pontosUsuario?: PontoUsuario[];
    filtroUsuario?: FiltroUsuarioData[];
    usuarioSeguranca: UsuarioSeguranca;
}

export interface UsuarioData extends Meta {
    items: Usuario[];
};

export interface UsuarioSessao {
    usuario?: Usuario,
    navegacoes?: Navegacao[];
    filtros?: any[];
    token?: string;
};

export interface UsuarioParameters extends QueryStringParameters {
    codUsuario?: string;
    nomeUsuario?: string;
    email?: string;
    codPerfil?: number;
    codCargos?: number;
    codFilial?: number;
    indAtivo?: number;
    codTecnico?: number;
    codPontoPeriodo?: number;
    indPonto?: number;
};

export interface UsuariosLogados {
    usuariosAtivos: number;
    usuariosLogados: number
}