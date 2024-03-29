using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.ViewModels;

namespace SAT.SERVICES.Interfaces
{
    public interface IDespesaPeriodoTecnicoService
    {
        ListViewModel ObterPorParametros(DespesaPeriodoTecnicoParameters parameters);
        ListViewModel ObterAtendimentos(DespesaPeriodoTecnicoParameters parameters);
        DespesaPeriodoTecnico Criar(DespesaPeriodoTecnico despesa);
        void Deletar(int codigo);
        DespesaPeriodoTecnico Atualizar(DespesaPeriodoTecnico despesa);
        DespesaPeriodoTecnico ObterPorCodigo(int codigo);
    }
}