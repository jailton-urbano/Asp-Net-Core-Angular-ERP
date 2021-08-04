﻿using SAT.API.Context;
using SAT.API.Repositories.Interfaces;
using System.Linq.Dynamic.Core;
using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace SAT.API.Repositories
{
    public class PecaRepository : IPecaRepository
    {
        private readonly AppDbContext _context;

        public PecaRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(Peca peca)
        {
            Peca p = _context.Peca.FirstOrDefault(p => p.CodPeca == peca.CodPeca);

            if (p != null)
            {
                _context.Entry(p).CurrentValues.SetValues(peca);
                _context.SaveChanges();
            }
        }

        public void Criar(Peca peca)
        {
            _context.Add(peca);
            _context.SaveChanges();
        }

        public void Deletar(int codPeca)
        {
            Peca p = _context.Peca.FirstOrDefault(p => p.CodPeca == codPeca);

            if (p != null)
            {
                _context.Peca.Remove(p);
                _context.SaveChanges();
            }
        }

        public Peca ObterPorCodigo(int codigo)
        {
            return _context.Peca.FirstOrDefault(p => p.CodPeca == codigo);
        }

        public PagedList<Peca> ObterPorParametros(PecaParameters parameters)
        {
            var pecas = _context.Peca
                .Include(p => p.PecaStatus)
                .Include(p => p.PecaFamilia)
                .AsQueryable();

            if (parameters.Filter != null)
            {
                pecas = pecas.Where(
                    p =>
                    p.CodPeca.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    p.NomePeca.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)

                );
            }

            if (parameters.CodPeca != null)
            {
                pecas = pecas.Where(p => p.CodPeca == parameters.CodPeca);
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                pecas = pecas.OrderBy(parameters.SortActive, parameters.SortDirection);
            }

            return PagedList<Peca>.ToPagedList(pecas, parameters.PageNumber, parameters.PageSize);
        }
    }
}