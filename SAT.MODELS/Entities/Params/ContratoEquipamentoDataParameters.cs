﻿using SAT.MODELS.Entities.Helpers;

namespace SAT.MODELS.Entities.Params
{
    public class ContratoEquipamentoDataParameters : QueryStringParameters
    {
        public string NomeData { get; set; }
        public byte? IndAtivo { get; set; }
    }
}
