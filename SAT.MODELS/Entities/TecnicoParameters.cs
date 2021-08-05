﻿using SAT.MODELS.Entities.Helpers;

namespace SAT.MODELS.Entities
{
    public class TecnicoParameters : QueryStringParameters
    {
        public int? CodTecnico { get; set; }
        public int? IndAtivo { get; set; }
        public int? CodFilial { get; set; }
        public int? IndFerias { get; set; }
        public string CodigosStatusServico { get; set; }
        public int? CodPerfil { get; set; }
        public int? CodAutorizada { get; set; }
    }
}