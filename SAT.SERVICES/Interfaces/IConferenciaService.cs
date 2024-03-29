using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.ViewModels;

namespace SAT.SERVICES.Interfaces
{
    public interface IConferenciaService
    {
        ListViewModel ObterPorParametros(ConferenciaParameters parameters);
        Conferencia Criar(Conferencia conferencia);
        void Deletar(int codigo);
        Conferencia ObterPorCodigo(int codigo);

    }
}