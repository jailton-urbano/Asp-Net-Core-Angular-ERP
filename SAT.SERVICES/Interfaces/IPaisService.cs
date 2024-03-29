﻿using SAT.MODELS.Entities;
using SAT.MODELS.ViewModels;
using SAT.MODELS.Entities.Params;

namespace SAT.SERVICES.Interfaces
{
    public interface IPaisService
    {
        ListViewModel ObterPorParametros(PaisParameters parameters);
        Pais Criar(Pais pais);
        void Deletar(int codigo);
        void Atualizar(Pais pais);
        Pais ObterPorCodigo(int codigo);
    }
}
