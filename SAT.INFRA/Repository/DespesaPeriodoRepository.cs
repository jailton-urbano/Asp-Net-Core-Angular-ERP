using Microsoft.EntityFrameworkCore;
using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Helpers;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace SAT.INFRA.Repository
{
    public class DespesaPeriodoRepository : IDespesaPeriodoRepository
    {
        private readonly AppDbContext _context;

        public DespesaPeriodoRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(DespesaPeriodo despesa)
        {
            _context.ChangeTracker.Clear();
            DespesaPeriodo d = _context.DespesaPeriodo.FirstOrDefault(l => l.CodDespesaPeriodo == despesa.CodDespesaPeriodo);

            if (d != null)
            {
                _context.Entry(d).CurrentValues.SetValues(despesa);
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

        public void Criar(DespesaPeriodo despesa)
        {
            _context.Add(despesa);
            _context.SaveChanges();
        }

        public void Deletar(int codigo)
        {
            throw new NotImplementedException();
        }

        public DespesaPeriodo ObterPorCodigo(int codigo) =>
            _context.DespesaPeriodo
                .FirstOrDefault(d => d.CodDespesaPeriodo == codigo);

        public PagedList<DespesaPeriodo> ObterPorParametros(DespesaPeriodoParameters parameters)
        {
            var despesasPeriodo = ObterQuery(parameters);

            return PagedList<DespesaPeriodo>.ToPagedList(despesasPeriodo, parameters.PageNumber, parameters.PageSize);
        }

        public IQueryable<DespesaPeriodo> ObterQuery(DespesaPeriodoParameters parameters)
        {
            var despesasPeriodo = _context.DespesaPeriodo.AsQueryable();

            if (parameters.IndAtivo.HasValue)
                despesasPeriodo = despesasPeriodo.Where(e => e.IndAtivo == parameters.IndAtivo);

            if (parameters.InicioPeriodo.HasValue && parameters.FimPeriodo.HasValue)
                despesasPeriodo =
                    despesasPeriodo.Where(e => e.DataInicio >= parameters.InicioPeriodo.Value && e.DataFim <= parameters.FimPeriodo.Value);

            if (!string.IsNullOrEmpty(parameters.SortActive) && !string.IsNullOrEmpty(parameters.SortDirection))
                despesasPeriodo = despesasPeriodo.OrderBy($"{parameters.SortActive} {parameters.SortDirection}");

            return despesasPeriodo.AsNoTracking();
        }
    }
}