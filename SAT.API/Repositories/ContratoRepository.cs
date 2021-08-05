﻿using SAT.API.Context;
using SAT.API.Repositories.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace SAT.API.Repositories
{
    public class ContratoRepository : IContratoRepository
    {
        private readonly AppDbContext _context;

        public ContratoRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(Contrato contrato)
        {
            throw new System.NotImplementedException();
        }

        public void Criar(Contrato contrato)
        {
            throw new System.NotImplementedException();
        }

        public void Deletar(int codigo)
        {
            throw new System.NotImplementedException();
        }

        public Contrato ObterPorCodigo(int codigo)
        {
            return _context.Contrato.FirstOrDefault(c => c.CodContrato == codigo);
        }

        public PagedList<Contrato> ObterPorParametros(ContratoParameters parameters)
        {
            var contratos = _context.Contrato.AsQueryable();

            if (parameters.Filter != null)
            {
                contratos = contratos.Where(
                    s =>
                    s.CodContrato.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    s.NroContrato.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    s.NomeContrato.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.CodContrato != null)
            {
                contratos = contratos.Where(c => c.CodContrato == parameters.CodContrato);
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                contratos = contratos.OrderBy(parameters.SortActive, parameters.SortDirection);
            }

            return PagedList<Contrato>.ToPagedList(contratos, parameters.PageNumber, parameters.PageSize);
        }
    }
}