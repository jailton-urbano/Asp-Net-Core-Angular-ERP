﻿using System.Collections.Generic;

namespace SAT.MODELS.Entities.Constants
{
    public class Constants
    {
        public static string SISTEMA_NOME = "SAT";
        public static string AGENDADOR_NOME = "SAT_AGENDADOR";
        public static string SMTP_HOST = "zimbragd.perto.com.br";
        public static int SMTP_PORT = 587;
        public static string SMTP_USER = "aplicacao.sat@perto.com.br";
        public static string EQUIPE_SAT_EMAIL = "equipe.sat@perto.com.br";
        public static string MAP_QUEST_KEY = "nCEqh4v9AjSGJreT75AAIaOx5vQZgVQ2";
        public static string GOOGLE_API_KEY = "AIzaSyC4StJs8DtJZZIELzFgJckwrsvluzRo_WM";
        public static string SMTP_PASSWORD = "S@aPlic20(v";
        public static string DB_PROD = "Prod";
        public static string DB_HOMOLOG = "Homolog";
        public static int TEMPO_IISLOG_MS = 3 * 60 * 1000;
        public static string IIS_LOG_PATH = @"D:\SAT\Branch\SAT.V2\SAT.API\Logs\IIS\";
        public static string VONAGE_KEY = @"eab57cf8";
        public static string VONAGE_SECRET = @"NX7ZdN7nNDrxoNyC";
        public static string INTEGRACAO_FINANCEIRO_API_URL = "http://perto31.perto.com.br";
        public static string INTEGRACAO_FINANCEIRO_USER = "sistemasat";
        public static string INTEGRACAO_FINANCEIRO_PASSWORD = "e62076f38d1d367931e00a4c6785f67e";

        // Status de Serviço
        public static int STATUS_SERVICO_ABERTO = 1;
        public static int TRANFERIDO = 8;
        public static int CANCELADO = 2;
        public static int AGUARDANDO_CONTATO_COM_CLIENTE = 14;
        public static int AGUARDANDO_DECLARACAO = 15;
        public static int CANCELADO_COM_ATENDIMENTO = 16;
        public static int FECHADO = 3;
        public static int PECAS_PENDENTES = 7;

        // Alertas para OS
        public static string WARNING = "warn";
        public static string PRIMARY = "primary";
        public static string SUCCESS = "success";

        public static string USUARIO_SERVICO = "SERVIÇO";
        public static int[] EQUIPAMENTOS_PINPAD = { 153, 856, 1121 };
        public static int[] EQUIPAMENTOS_BATERIAS = { 153, 856, 1121 };
        public static int[] TIPO_INTERVENCAO_GERAL = { 2, 5, 17, 18, 19, 20 };
        public static int[] EQUIPS_TDS_TCC_TOP_TR1150 = { 91, 101, 112, 114, 151, 263, 264, 298, 320, 329, 407, 410, 415, 447, 448, 459, 460, 603, 604, 628, 779, 865, 958, 959, 960, 961, 962, 970, 1090 };
        public static int CONTRATO_BB_TECNOLOGIA = 3145;

        // Tipos de Intervenção
        public static int ALTERACAO_ENGENHARIA = 1;
        public static int CORRETIVA = 2;
        public static int DESINSTALACAO = 3;
        public static int INSTALACAO = 4;
        public static int PREVENTIVA = 6;
        public static int REINSTALACAO = 7;

        // Mensagens
        public static string NAO_FOI_POSSIVEL_DELETAR = "Não foi possível deletar o registro";
        public static string NAO_FOI_POSSIVEL_ATUALIZAR = "Não foi possível atualizar o registro";
        public static string NAO_FOI_POSSIVEL_CRIAR = "Não foi possível criar o registro";
        public static string NAO_FOI_POSSIVEL_OBTER = "Não foi possível atualizar o(s) registro(s)";
        public static string USUARIO_OU_SENHA_INVALIDOS = "Usuário ou senha inválidos";
        public static string SENHA_INVALIDA = "Senha inválida";
        public static string ERRO_ALTERAR_SENHA = "Erro ao alterar a senha";
        public static string ERRO_CONSULTAR_COORDENADAS = "Erro ao consultar as coordenadas";
        public static string ERROR = "Ocorreu um erro";

        // Filiais
        public static int FRS = 4;

        // Clientes
        public const int CLIENTE_BB = 1;
        public const int CLIENTE_BANRISUL = 2;
        public const int CLIENTE_SAFRA = 8;
        public const int CLIENTE_CEF = 58;
        public const int CLIENTE_SICOOB = 68;
        public const int CLIENTE_SICREDI = 88;
        public const int CLIENTE_BANCO_DA_AMAZONIA = 109;
        public const int CLIENTE_BRB = 197;
        public const int CLIENTE_ITAU = 251;
        public const int CLIENTE_BANESTES = 331;
        public const int CLIENTE_BANPARA = 426;
        public const int CLIENTE_SAQUE_PAGUE =	434	;


        // Modelos
        public static int POS = 85;
        public static int POS_2020 = 107;
        public static int POS_2024 = 134;
        public static int POS_2025 = 147;
        public static int POS_GPRS = 157;
        public static int POS_ADSL = 158;
        public static int POS_VELOH_G = 172;
        public static int POS_VELOH_C = 204;
        public static int POS_VELOH_W = 268;
        public static int POS_VELOH_3 = 289;
        public static int POS_290_20_000 = 400;
        public static int POS_2020_290_20_012 = 401;
        public static int TMF_2100_290_01_906 = 24;
        public static int TC_3100_290_02_288 = 34;
        public static int TS_2100_290_01_908 = 51;
        public static int TMD_2100_290_01_904 = 132;
        public static int TMF_5100_290_01_979 = 322;
        public static int TMF_4100ABNT_290_01_434 = 346;
        public static int TMF_5100_290_01_898 = 351;
        public static int TMF_5100_290_01_975 = 353;
        public static int TMD_2100_290_02_037 = 355;
        public static int TS_2100_290_01_918 = 361;
        public static int TMF_2100_290_02_057 = 434;
        public static int TMF_2100_P_I_290_02_058 = 435;
        public static int TMD_5100_290_01_980 = 438;
        public static int TMF_4100_290_01_776 = 440;
        public static int TAAMC_290_02_049 = 442;
        public static int TAASF_290_02_047 = 443;
        public static int TMF_4100_290_02_028 = 461;
        public static int TMF_4100_290_01_863 = 462;
        public static int TMD_4100_290_01_834 = 524;
        public static int TMF_5100_290_01_604 = 525;
        public static int TMD_5100_290_02_025 = 532;
        public static int TMF_5110_290_01_976 = 533;
        public static int TAS_3100_290_02_252 = 561;
        public static int TPC_4110_290_01_941 = 620;
        public static int TMF_5100_290_01_940 = 621;
        public static int TS_5150_290_01_942 = 622;
        public static int TS_5160_290_01_943 = 623;
        public static int TS_3100F_290_01_552 = 659;
        public static int TMF_5110_290_02_303 = 695;
        public static int TS_2100_290_02_322 = 707;
        public static int TAART_290_02_309 = 740;
        public static int TMR_5100_290_02_326 = 742;
        public static int TMR_5150_290_02_061 = 784;
        public static int TMR_5160_290_02_062 = 793;
        public static int TMR_5160_290_02_363 = 807;
        public static int TPR_4111_290_01_946 = 810;
        public static int TMF_5100_290_02_402 = 1101;
        public static int TC_3100_290_02_071 = 1138;
        public static int TMRSD_5100_290_02_323 = 1164;
        public static int TMF_5100_290_02_349 = 1169;
        public static int TMD_5100_290_02_346 = 1183;


        // Permissoes
        public static string PERFIL_PONTO = "3";
        public static string NENHUM_REGISTRO = "S/N";

        // Clientes
        public static int SICOOB = 68;
        public static int SICOOB_CONFEDERACAO = 246;

        // Filiais
        public static int PERTO_INDIA = 33;

        // Cores
        public static string COR_AZUL = "#2828fa";
        public static string COR_ROSA = "#ff4cb7";
        public static string COR_VERDE_CLARO = "#6dbd62";
        public static string COR_TERRA = "#964b00";
        public static string COR_VERDE_ESCURO = "#009000";
        public static string COR_CINZA = "#c8c8c8";
        public static string COR_VERMELHO = "#ff4c4c";
        public static string COR_ROXO = "#381354";
        public static string COR_PRETO = "#212121";

        //Email
        public static string ASSINATURA_EMAIL = @"
                                                <br><br>
                                                Equipe SAT<br> 
                                                Perto S.A. – Tecnologia para Bancos e Varejo<br> 
                                                Ramal (51) 2126-6944<br> 
                                                Whatsapp: (51) 997144990<br>";
        
        //Dicionários
        public static Dictionary<string,string> CONVERSOR_IMPORTACAO_INSTALACAO = new Dictionary<string, string>
            {
                { "NumSerie", "CodEquipContrato" },
                { "NfVenda", "CodInstalNFVenda" },
                { "NfVendaData", "CodInstalNFVenda" }
            };
    }
}