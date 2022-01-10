using SAT.MODELS.Entities.Helpers;

namespace SAT.MODELS.Entities
{
    public class OrcamentoMaterialParameters : QueryStringParameters
    {

        public int CodOrcMaterial { get; set; }
        public int? CodOrc { get; set; }
        public int? CodigoPeca { get; set; }
    }
}