﻿using SAT.MODELS.Entities;
using SAT.MODELS.ViewModels;

namespace SAT.SERVICES.Interfaces
{
    public interface IPerfilService
    {
        ListViewModel ObterPorParametros(PerfilParameters parameters);
        Perfil Criar(Perfil perfil);
        void Deletar(int codigo);
        void Atualizar(Perfil perfil);
        Perfil ObterPorCodigo(int codigo);
    }
}
