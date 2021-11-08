using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;

namespace SAT.INFRA.Interfaces
{
    public interface IPontoUsuarioDataTipoAdvertenciaRepository
    {
        PagedList<PontoUsuarioDataTipoAdvertencia> ObterPorParametros(PontoUsuarioDataTipoAdvertenciaParameters parameters);
    }
}