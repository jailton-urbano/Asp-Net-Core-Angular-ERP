using Microsoft.EntityFrameworkCore;
using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Constants;
using System.Linq.Dynamic.Core;
using SAT.MODELS.Helpers;
using System;
using System.Linq;

namespace SAT.INFRA.Repository
{
    public class PontoPeriodoRepository : IPontoPeriodoRepository
    {
        private readonly AppDbContext _context;

        public PontoPeriodoRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(PontoPeriodo pontoPeriodo)
        {
            _context.ChangeTracker.Clear();
            PontoPeriodo per = _context.PontoPeriodo.SingleOrDefault(p => p.CodPontoPeriodo == pontoPeriodo.CodPontoPeriodo);

            if (per != null)
            {
                try
                {
                    _context.Entry(per).CurrentValues.SetValues(pontoPeriodo);
                    _context.SaveChanges();
                }
                catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
            }
        }

        public void Criar(PontoPeriodo pontoPeriodo)
        {
            try
            {
                _context.Add(pontoPeriodo);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
        }

        public void Deletar(int codigo)
        {
            PontoPeriodo per = _context.PontoPeriodo.SingleOrDefault(p => p.CodPontoPeriodo == codigo);

            if (per != null)
            {
                _context.PontoPeriodo.Remove(per);

                try
                {
                    _context.SaveChanges();
                }
                catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
            }
        }

        public PontoPeriodo ObterPorCodigo(int codigo)
        {
            return _context.PontoPeriodo
                .Include(pp => pp.PontoPeriodoStatus)
                .Include(pp => pp.PontoPeriodoModoAprovacao)
                .Include(pp => pp.PontoPeriodoIntervaloAcessoData)
                .SingleOrDefault(p => p.CodPontoPeriodo == codigo);
        }

        public PagedList<PontoPeriodo> ObterPorParametros(PontoPeriodoParameters parameters)
        {
            var query = _context.PontoPeriodo
                .Include(pp => pp.PontoPeriodoStatus)
                .Include(pp => pp.PontoPeriodoModoAprovacao)
                .Include(pp => pp.PontoPeriodoIntervaloAcessoData)
                .AsQueryable();

            if (parameters.Filter != null)
            {
                query = query.Where(
                    p =>
                    p.CodPontoPeriodo.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                query = query.OrderBy($"{parameters.SortActive} {parameters.SortDirection}");
            }

            var a = query.ToQueryString();

            return PagedList<PontoPeriodo>.ToPagedList(query, parameters.PageNumber, parameters.PageSize);
        }
    }
}
