﻿using SAT.API.Context;
using SAT.API.Repositories.Interfaces;
using System.Linq.Dynamic.Core;
using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace SAT.API.Repositories
{
    public class CidadeRepository : ICidadeRepository
    {
        private readonly AppDbContext _context;

        public CidadeRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(Cidade cidade)
        {
            Cidade c = _context.Cidade.FirstOrDefault(c => c.CodCidade == cidade.CodCidade);

            if (c != null)
            {
                _context.Entry(c).CurrentValues.SetValues(cidade);
                _context.SaveChanges();
            }
        }

        public void Criar(Cidade cidade)
        {
            _context.Add(cidade);
            _context.SaveChanges();
        }

        public void Deletar(int codCidade)
        {
            Cidade c = _context.Cidade.FirstOrDefault(c => c.CodCidade == codCidade);

            if (c != null)
            {
                _context.Cidade.Remove(c);
                _context.SaveChanges();
            }
        }

        public Cidade ObterPorCodigo(int codigo)
        {
            return _context.Cidade
                .Include(c => c.Filial)
                .Include(c => c.UnidadeFederativa)
                .FirstOrDefault(c => c.CodCidade == codigo);
        }

        public PagedList<Cidade> ObterPorParametros(CidadeParameters parameters)
        {
            var cidades = _context.Cidade
                .Include(c => c.Filial)
                .Include(c => c.UnidadeFederativa)
                .AsQueryable();

            if (parameters.Filter != null)
            {
                cidades = cidades.Where(
                    s =>
                    s.CodCidade.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    s.NomeCidade.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.CodCidade != null)
            {
                cidades = cidades.Where(c => c.CodCidade == parameters.CodCidade);
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                cidades = cidades.OrderBy(parameters.SortActive, parameters.SortDirection);
            }

            return PagedList<Cidade>.ToPagedList(cidades, parameters.PageNumber, parameters.PageSize);
        }
    }
}
