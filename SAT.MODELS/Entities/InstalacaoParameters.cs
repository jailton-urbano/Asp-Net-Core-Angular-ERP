using SAT.MODELS.Entities.Helpers;

namespace SAT.MODELS.Entities
{
    public class InstalacaoParameters: QueryStringParameters
    {
        public int? CodContrato { get; set; }
        public int? CodInstalLote { get; set; }
    }
}