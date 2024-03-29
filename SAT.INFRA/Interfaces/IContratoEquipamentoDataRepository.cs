﻿using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using SAT.MODELS.Entities.Params;

namespace SAT.INFRA.Interfaces
{
    public interface IContratoEquipamentoDataRepository
    {
        void Criar(ContratoEquipamentoData contrato);
        PagedList<ContratoEquipamentoData> ObterPorParametros(ContratoEquipamentoDataParameters parameters);
        void Deletar(int codigo);
        void Atualizar(ContratoEquipamentoData contrato);
        ContratoEquipamentoData ObterPorCodigo(int codigo);
    }
}
