using SAT.MODELS.Entities.Helpers;

namespace SAT.MODELS.Entities.Params
{
    public class OrcamentoOutroServicoParameters : QueryStringParameters
    {

        public int CodOrcOutroServico { get; set; }
        public int? CodOrc { get; set; }
        public string Tipo { get; set; }
    }
}