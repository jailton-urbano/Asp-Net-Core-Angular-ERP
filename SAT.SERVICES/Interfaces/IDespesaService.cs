﻿using SAT.MODELS.Entities;
using SAT.MODELS.ViewModels;

namespace SAT.SERVICES.Interfaces
{
    public interface IDespesaService
    {
        ListViewModel ObterPorParametros(DespesaParameters parameters);
        Despesa Criar(Despesa despesa);
        void Deletar(int codigo);
        void Atualizar(Despesa despesa);
        Despesa ObterPorCodigo(int codigo);
    }
}