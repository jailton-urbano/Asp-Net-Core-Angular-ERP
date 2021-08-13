﻿using SAT.MODELS.Entities.Helpers;
using System;

namespace SAT.MODELS.Entities
{
    public class OrdemServicoParameters : QueryStringParameters
    {
        public int? CodOS { get; set; }
        public int? CodEquipContrato { get; set; }
        public string NumOSCliente { get; set; }
        public string NumOSQuarteirizada { get; set; }

        public string CodStatusServicos { get; set; }
        public string CodTiposIntervencao { get; set; }
        public string CodClientes { get; set; }
        public string CodFiliais { get; set; }

        public DateTime DataAberturaInicio { get; set; }
        public DateTime DataAberturaFim { get; set; }
        public DateTime DataFechamentoInicio { get; set; }
        public DateTime DataFechamentoFim { get; set; }
    }
}
