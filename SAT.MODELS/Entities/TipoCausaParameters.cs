﻿using SAT.MODELS.Entities.Helpers;

namespace SAT.MODELS.Entities
{
    public class TipoCausaParameters : QueryStringParameters
    {
        public int? CodTipoCausa { get; set; }
        public string CodETipoCausa { get; set; }
        public int? IndAtivo { get; set; }
    }
}
