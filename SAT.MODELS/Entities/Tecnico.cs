﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SAT.MODELS.Entities
{
    public class Tecnico
    {
        [Key]
        public int CodTecnico { get; set; }
        public int? CodAutorizada { get; set; }
        [ForeignKey("CodAutorizada")]
        public Autorizada Autorizada { get; set; }
        public int? CodFilial { get; set; }
        [ForeignKey("CodFilial")]
        public Filial Filial { get; set; }
        public int CodTipoRota { get; set; }
        [ForeignKey("CodTipoRota")]
        public TipoRota TipoRota { get; set; }
        public string Nome { get; set; }
        public string Apelido { get; set; }
        public DateTime? DataNascimento { get; set; }
        public DateTime? DataAdmissao { get; set; }
        public string Cpf { get; set; }
        public string Rg { get; set; }
        public string Cep { get; set; }
        public string Endereco { get; set; }
        public string EnderecoComplemento { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string EnderecoCoordenadas { get; set; }
        public string BairroCoordenadas { get; set; }
        public string CidadeCoordenadas { get; set; }
        public string Ufcoordenadas { get; set; }
        public string PaisCoordenadas { get; set; }
        public string Bairro { get; set; }
        public int? CodCidade { get; set; }
        [ForeignKey("CodCidade")]
        public Cidade Cidade { get; set; }
        public string Fone { get; set; }
        public string Email { get; set; }
        public string NumCrea { get; set; }
        public byte? IndTecnicoBancada { get; set; }
        public byte? IndAtivo { get; set; }
        public string CodUsuarioCad { get; set; }
        public DateTime? DataHoraCad { get; set; }
        public string CodUsuarioManut { get; set; }
        public DateTime? DataHoraManut { get; set; }
        public string FoneParticular { get; set; }
        public string FonePerto { get; set; }
        public string SimCardMobile { get; set; }
        public int? IndPa { get; set; }
        public string TrackerId { get; set; }
        public int? CodSimCard { get; set; }
        public string Cpflogix { get; set; }
        public int IndFerias { get; set; }
        public int? CodRegiao { get; set; }
        [ForeignKey("CodRegiao")]
        public Regiao Regiao { get; set; }
        public int? CodDespesaCartaoCombustivel { get; set; }
        public int? CodFrotaCobrancaGaragem { get; set; }
        public int? CodFrotaFinalidadeUso { get; set; }
        public string Cnh { get; set; }
        public string Cnhcategorias { get; set; }
        public string FinalidadesUso { get; set; }
        public DateTime? DtFeriasInicio { get; set; }
        public DateTime? DtFeriasFim { get; set; }
        public string CNHvalidade { get; set; }
        public List<OrdemServico> OrdensServico { get; set; }
        public virtual Usuario Usuario { get; set; }
    }
}
