﻿using SAT.MODELS.Entities.Helpers;
using SAT.MODELS.Enums;

namespace SAT.MODELS.Entities
{
    public class EquipamentoParameters : QueryStringParameters
    {
        public int? CodEquip { get; set; }
        public string CodClientes { get; set; }
        public EquipamentoFilterEnum? FilterType { get; set; }
    }
}