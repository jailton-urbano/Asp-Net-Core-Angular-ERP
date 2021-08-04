﻿using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;

namespace SAT.API.Repositories.Interfaces
{
    public interface IFilialRepository
    {
        void Criar(Filial filial);
        PagedList<Filial> ObterPorParametros(FilialParameters parameters);
        void Deletar(int codigo);
        void Atualizar(Filial filial);
        Filial ObterPorCodigo(int codigo);
    }
}
