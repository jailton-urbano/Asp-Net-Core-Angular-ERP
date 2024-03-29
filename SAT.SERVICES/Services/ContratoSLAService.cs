﻿using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.ViewModels;
using SAT.SERVICES.Interfaces;

namespace SAT.SERVICES.Services
{
    public class ContratoSLAService : IContratoSLAService
    {
        private readonly IContratoSLARepository _contratoSLARepo;

        public ContratoSLAService(IContratoSLARepository contratoSLARepo)
        {
            _contratoSLARepo = contratoSLARepo;
        }

        public void Atualizar(ContratoSLA contratoSLA)
        {
            _contratoSLARepo.Atualizar(contratoSLA);
        }

        public void Criar(ContratoSLA contratoSLA)
        {
            _contratoSLARepo.Criar(contratoSLA);
        }

        public void Deletar(int codContrato, int codSLA)
        {
            _contratoSLARepo.Deletar(codContrato,codSLA);
        }

        public ContratoSLA ObterPorCodigo(int codContrato, int codSLA)
        {
            return _contratoSLARepo.ObterPorCodigo(codContrato, codSLA);
        }

        public ListViewModel ObterPorParametros(ContratoSLAParameters parameters)
        {
            var contratoSLAs = _contratoSLARepo.ObterPorParametros(parameters);

            var lista = new ListViewModel
            {
                Items = contratoSLAs,
                TotalCount = contratoSLAs.TotalCount,
                CurrentPage = contratoSLAs.CurrentPage,
                PageSize = contratoSLAs.PageSize,
                TotalPages = contratoSLAs.TotalPages,
                HasNext = contratoSLAs.HasNext,
                HasPrevious = contratoSLAs.HasPrevious
            };

            return lista;
        }
    }
}
