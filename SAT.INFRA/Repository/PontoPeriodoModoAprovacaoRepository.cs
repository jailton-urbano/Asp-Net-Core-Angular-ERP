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
    public class PontoPeriodoModoAprovacaoRepository : IPontoPeriodoModoAprovacaoRepository
    {
        private readonly AppDbContext _context;

        public PontoPeriodoModoAprovacaoRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(PontoPeriodoModoAprovacao pontoPeriodoModoAprovacao)
        {
            _context.ChangeTracker.Clear();
            PontoPeriodoModoAprovacao per = _context.PontoPeriodoModoAprovacao.SingleOrDefault(p => p.CodPontoPeriodoModoAprovacao == pontoPeriodoModoAprovacao.CodPontoPeriodoModoAprovacao);

            if (per != null)
            {
                try
                {
                    _context.Entry(per).CurrentValues.SetValues(pontoPeriodoModoAprovacao);
                    _context.SaveChanges();
                }
                catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
            }
        }

        public void Criar(PontoPeriodoModoAprovacao pontoPeriodoModoAprovacao)
        {
            try
            {
                _context.Add(pontoPeriodoModoAprovacao);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"", ex);
            }
        }

        public void Deletar(int codigo)
        {
            PontoPeriodoModoAprovacao per = _context.PontoPeriodoModoAprovacao.SingleOrDefault(p => p.CodPontoPeriodoModoAprovacao == codigo);

            if (per != null)
            {
                _context.PontoPeriodoModoAprovacao.Remove(per);

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

        public PontoPeriodoModoAprovacao ObterPorCodigo(int codigo)
        {
            return _context.PontoPeriodoModoAprovacao.SingleOrDefault(p => p.CodPontoPeriodoModoAprovacao == codigo);
        }

        public PagedList<PontoPeriodoModoAprovacao> ObterPorParametros(PontoPeriodoModoAprovacaoParameters parameters)
        {
            var query = _context.PontoPeriodoModoAprovacao
                .AsQueryable();

            if (parameters.Filter != null)
            {
                query = query.Where(
                    p =>
                    p.CodPontoPeriodoModoAprovacao.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                query = query.OrderBy($"{parameters.SortActive} {parameters.SortDirection}");
            }

            var a = query.ToQueryString();

            return PagedList<PontoPeriodoModoAprovacao>.ToPagedList(query, parameters.PageNumber, parameters.PageSize);
        }
    }
}
