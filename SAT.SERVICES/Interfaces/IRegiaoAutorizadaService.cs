﻿using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.ViewModels;

namespace SAT.SERVICES.Interfaces
{
    public interface IRegiaoAutorizadaService
    {
        ListViewModel ObterPorParametros(RegiaoAutorizadaParameters parameters);
        RegiaoAutorizada Criar(RegiaoAutorizada regiaoAutorizada);
        RegiaoAutorizada ObterPorCodigo(int codRegiao, int codAutorizada, int codFilial);
        void Deletar(int codRegiao, int codAutorizada, int codFilial);
    }
}
