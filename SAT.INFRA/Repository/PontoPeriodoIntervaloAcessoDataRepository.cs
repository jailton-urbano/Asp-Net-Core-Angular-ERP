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
    public class PontoPeriodoIntervaloAcessoDataRepository : IPontoPeriodoIntervaloAcessoDataRepository
    {
        private readonly AppDbContext _context;

        public PontoPeriodoIntervaloAcessoDataRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(PontoPeriodoIntervaloAcessoData pontoPeriodoIntervaloAcessoData)
        {
            _context.ChangeTracker.Clear();
            PontoPeriodoIntervaloAcessoData per = _context.PontoPeriodoIntervaloAcessoData
                .SingleOrDefault(p => p.CodPontoPeriodoIntervaloAcessoData == pontoPeriodoIntervaloAcessoData.CodPontoPeriodoIntervaloAcessoData);

            if (per != null)
            {
                try
                {
                    _context.Entry(per).CurrentValues.SetValues(pontoPeriodoIntervaloAcessoData);
                    _context.SaveChanges();
                }
                catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
            }
        }

        public void Criar(PontoPeriodoIntervaloAcessoData pontoPeriodoIntervaloAcessoData)
        {
            try
            {
                _context.Add(pontoPeriodoIntervaloAcessoData);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
        }

        public void Deletar(int codigo)
        {
            PontoPeriodoIntervaloAcessoData per = _context.PontoPeriodoIntervaloAcessoData.SingleOrDefault(p => p.CodPontoPeriodoIntervaloAcessoData == codigo);

            if (per != null)
            {
                _context.PontoPeriodoIntervaloAcessoData.Remove(per);

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

        public PontoPeriodoIntervaloAcessoData ObterPorCodigo(int codigo)
        {
            return _context.PontoPeriodoIntervaloAcessoData.SingleOrDefault(p => p.CodPontoPeriodoIntervaloAcessoData == codigo);
        }

        public PagedList<PontoPeriodoIntervaloAcessoData> ObterPorParametros(PontoPeriodoIntervaloAcessoDataParameters parameters)
        {
            var query = _context.PontoPeriodoIntervaloAcessoData
                .AsQueryable();

            if (parameters.Filter != null)
            {
                query = query.Where(
                    p =>
                    p.CodPontoPeriodoIntervaloAcessoData.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                query = query.OrderBy($"{parameters.SortActive} {parameters.SortDirection}");
            }

            var a = query.ToQueryString();

            return PagedList<PontoPeriodoIntervaloAcessoData>.ToPagedList(query, parameters.PageNumber, parameters.PageSize);
        }
    }
}
