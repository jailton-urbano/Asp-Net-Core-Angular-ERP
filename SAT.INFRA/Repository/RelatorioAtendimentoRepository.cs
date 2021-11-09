﻿using Microsoft.EntityFrameworkCore;
using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System.Linq.Dynamic.Core;
using System.Linq;
using System.Reflection;

namespace SAT.INFRA.Repository
{
    public class RelatorioAtendimentoRepository : IRelatorioAtendimentoRepository
    {
        private readonly AppDbContext _context;

        public RelatorioAtendimentoRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(RelatorioAtendimento relatorioAtendimento)
        {
            RelatorioAtendimento rat = _context.RelatorioAtendimento.FirstOrDefault(rat => rat.CodRAT == relatorioAtendimento.CodRAT);

            if (rat != null)
            {
                _context.Entry(rat).CurrentValues.SetValues(relatorioAtendimento);
                _context.SaveChanges();
            }
        }

        public void Criar(RelatorioAtendimento relatorioAtendimento)
        {
            _context.Add(relatorioAtendimento);
            _context.SaveChanges();
        }

        public void Deletar(int codRAT)
        {
            RelatorioAtendimento rat = _context.RelatorioAtendimento.FirstOrDefault(rat => rat.CodRAT == codRAT);

            if (rat != null)
            {
                _context.RelatorioAtendimento.Remove(rat);
                _context.SaveChanges();
            }
        }

        public RelatorioAtendimento ObterPorCodigo(int codigo)
        {
            var relatorio = _context.RelatorioAtendimento
                .Include(r => r.StatusServico)
                .Include(r => r.Tecnico)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.TipoServico)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.TipoCausa)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.Causa)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.Acao)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.Defeito)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.GrupoCausa)
                .Include(r => r.RelatorioAtendimentoDetalhes)
                    .ThenInclude(d => d.RelatorioAtendimentoDetalhePecas)
                        .ThenInclude(dp => dp.Peca)
                .FirstOrDefault(rat => rat.CodRAT == codigo);

            return relatorio;
        }

        public PagedList<RelatorioAtendimento> ObterPorParametros(RelatorioAtendimentoParameters parameters)
        {
            var relatorios = _context.RelatorioAtendimento
                .Include(r => r.Tecnico)
                .Include(r => r.StatusServico)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.TipoServico)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.TipoCausa)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.GrupoCausa)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.Causa)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.Acao)
                .Include(r => r.RelatorioAtendimentoDetalhes).ThenInclude(d => d.Defeito)
                .Include(r => r.StatusServico)
                .AsQueryable();

            if (parameters.Filter != null)
            {
                relatorios = relatorios.Where(
                    r =>
                    r.CodRAT.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    r.NumRAT.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.CodRAT != null)
            {
                relatorios = relatorios.Where(r => r.CodRAT == parameters.CodRAT);
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                relatorios = relatorios.OrderBy(string.Format("{0} {1}", parameters.SortActive, parameters.SortDirection));
            }

            return PagedList<RelatorioAtendimento>.ToPagedList(relatorios, parameters.PageNumber, parameters.PageSize);
        }
    }
}
