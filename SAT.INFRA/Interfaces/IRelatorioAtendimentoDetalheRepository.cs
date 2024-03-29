﻿using SAT.MODELS.Entities;

namespace SAT.INFRA.Interfaces
{
    public interface IRelatorioAtendimentoDetalheRepository
    {
        void Deletar(int codRATDetalhe);
        void Criar(RelatorioAtendimentoDetalhe detalhe);

        void Atualizar(RelatorioAtendimentoDetalhe detalhe);
        RelatorioAtendimentoDetalhe ObterPorCodigo(int codigo);
    }
}
