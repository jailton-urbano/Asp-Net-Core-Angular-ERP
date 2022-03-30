﻿using System.Collections.Generic;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.ViewModels;

namespace SAT.INFRA.Interfaces
{
    public interface IAgendaTecnicoRepository
    {
        AgendaTecnico Criar(AgendaTecnico agenda);
        List<ViewAgendaTecnicoEvento> ObterPorParametros(AgendaTecnicoParameters parameters);
        void Deletar(int codigo);
        AgendaTecnico Atualizar(AgendaTecnico agenda);
        AgendaTecnico ObterPorCodigo(int codigo);
    }
}
