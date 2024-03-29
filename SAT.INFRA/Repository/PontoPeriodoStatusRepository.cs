using Microsoft.EntityFrameworkCore;
using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Entities.Constants;
using System.Linq.Dynamic.Core;
using SAT.MODELS.Helpers;
using System;
using System.Linq;

namespace SAT.INFRA.Repository
{
    public class PontoPeriodoStatusRepository : IPontoPeriodoStatusRepository
    {
        private readonly AppDbContext _context;

        public PontoPeriodoStatusRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(PontoPeriodoStatus pontoPeriodoStatus)
        {
            _context.ChangeTracker.Clear();
            PontoPeriodoStatus per = _context.PontoPeriodoStatus.SingleOrDefault(p => p.CodPontoPeriodoStatus == pontoPeriodoStatus.CodPontoPeriodoStatus);

            if (per != null)
            {
                try
                {
                    _context.Entry(per).CurrentValues.SetValues(pontoPeriodoStatus);
                    _context.SaveChanges();
                }
                catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
            }
        }

        public void Criar(PontoPeriodoStatus pontoPeriodoStatus)
        {
            try
            {
                _context.Add(pontoPeriodoStatus);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
        }

        public void Deletar(int codigo)
        {
            PontoPeriodoStatus per = _context.PontoPeriodoStatus.SingleOrDefault(p => p.CodPontoPeriodoStatus == codigo);

            if (per != null)
            {
                _context.PontoPeriodoStatus.Remove(per);

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

        public PontoPeriodoStatus ObterPorCodigo(int codigo)
        {
            return _context.PontoPeriodoStatus.SingleOrDefault(p => p.CodPontoPeriodoStatus == codigo);
        }

        public PagedList<PontoPeriodoStatus> ObterPorParametros(PontoPeriodoStatusParameters parameters)
        {
            var query = _context.PontoPeriodoStatus
                .AsQueryable();

            if (parameters.Filter != null)
            {
                query = query.Where(
                    p =>
                    p.CodPontoPeriodoStatus.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                query = query.OrderBy($"{parameters.SortActive} {parameters.SortDirection}");
            }

            var a = query.ToQueryString();

            return PagedList<PontoPeriodoStatus>.ToPagedList(query, parameters.PageNumber, parameters.PageSize);
        }
    }
}
