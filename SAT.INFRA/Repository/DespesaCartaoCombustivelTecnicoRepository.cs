﻿using Microsoft.EntityFrameworkCore;
using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace SAT.INFRA.Repository
{
    public class DespesaCartaoCombustivelTecnicoRepository : IDespesaCartaoCombustivelTecnicoRepository
    {
        private readonly AppDbContext _context;

        public DespesaCartaoCombustivelTecnicoRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(DespesaCartaoCombustivelTecnico acao)
        {
            throw new System.NotImplementedException();
        }

        public void Criar(DespesaCartaoCombustivelTecnico despesa)
        {
            try
            {
                _context.Add(despesa);
                _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public PagedList<DespesaCartaoCombustivelTecnico> ObterPorParametros(DespesaCartaoCombustivelTecnicoParameters parameters)
        {
            var cartoes =
            _context.DespesaCartaoCombustivelTecnico
                .Include(dp => dp.DespesaCartaoCombustivel)
                .AsQueryable();

            if (parameters.CodDespesaCartaoCombustivel.HasValue)
                cartoes = cartoes.Where(a => a.CodDespesaCartaoCombustivel == parameters.CodDespesaCartaoCombustivel);

            if (!string.IsNullOrEmpty(parameters.SortActive) && !string.IsNullOrEmpty(parameters.SortDirection))
                cartoes = cartoes.OrderBy($"{parameters.SortActive} {parameters.SortDirection}");

            return PagedList<DespesaCartaoCombustivelTecnico>.ToPagedList(cartoes, parameters.PageNumber, parameters.PageSize);
        }
    }
}