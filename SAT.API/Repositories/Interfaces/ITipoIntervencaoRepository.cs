﻿using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;

namespace SAT.API.Repositories.Interfaces
{
    public interface ITipoIntervencaoRepository
    {
        PagedList<TipoIntervencao> ObterPorParametros(TipoIntervencaoParameters parameters);
        void Criar(TipoIntervencao tipoIntervencao);
        void Atualizar(TipoIntervencao tipointervencao);
        void Deletar(int codTipoIntervencao);
        TipoIntervencao ObterPorCodigo(int codigo);
    }
}
