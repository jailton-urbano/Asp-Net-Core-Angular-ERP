﻿using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Helpers;

namespace SAT.INFRA.Interfaces
{
    public interface ITipoEquipamentoRepository
    {
        PagedList<TipoEquipamento> ObterPorParametros(TipoEquipamentoParameters parameters);
        void Criar(TipoEquipamento tipoEquipamento);
        void Deletar(int codigo);
        void Atualizar(TipoEquipamento tipoEquipamento);
        TipoEquipamento ObterPorCodigo(int codigo);
    }
}
