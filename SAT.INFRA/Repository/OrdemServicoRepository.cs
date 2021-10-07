﻿using Microsoft.EntityFrameworkCore;
using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System.Linq.Dynamic.Core;
using System.Linq;
using System;

namespace SAT.INFRA.Repository
{
    public class OrdemServicoRepository : IOrdemServicoRepository
    {
        private readonly AppDbContext _context;

        public OrdemServicoRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Criar(OrdemServico ordemServico)
        {
            _context.Add(ordemServico);
            _context.SaveChanges();
        }

        public void Atualizar(OrdemServico ordemServico)
        {
            OrdemServico os = _context.OrdemServico.FirstOrDefault(os => os.CodOS == ordemServico.CodOS);

            if (os != null)
            {
                _context.Entry(os).CurrentValues.SetValues(ordemServico);
                _context.SaveChanges();
            }
        }

        public void Deletar(int codOS)
        {
            OrdemServico os = _context.OrdemServico.FirstOrDefault(os => os.CodOS == codOS);

            if (os != null)
            {
                _context.OrdemServico.Remove(os);
                _context.SaveChanges();
            }
        }

        public PagedList<OrdemServico> ObterPorParametros(OrdemServicoParameters parameters)
        {
            var query = _context.OrdemServico
                .Include(os => os.StatusServico)
                .Include(os => os.TipoIntervencao)
                .Include(os => os.LocalAtendimento)
                .Include(os => os.LocalAtendimento.Cidade)
                .Include(os => os.LocalAtendimento.Cidade.UnidadeFederativa)
                .Include(os => os.Equipamento)
                .Include(os => os.Agendamentos)
                .Include(os => os.EquipamentoContrato)
                .Include(os => os.EquipamentoContrato.AcordoNivelServico)
                .Include(os => os.RegiaoAutorizada)
                .Include(os => os.RegiaoAutorizada.Filial)
                .Include(os => os.RegiaoAutorizada.Autorizada)
                .Include(os => os.RegiaoAutorizada.Regiao)
                .Include(os => os.Cliente)
                .Include(os => os.Cliente.Cidade)
                .Include(os => os.Tecnico)
                .Include(os => os.RelatoriosAtendimento)
                .Include(os => os.EquipamentoContrato.Contrato)
                .Include(os => os.PrazosAtendimento)
                .Include(os => os.RelatoriosAtendimento)
                .Include(os => os.RelatoriosAtendimento)
                .AsQueryable();

            if (parameters.CodOS != null)
            {
                query = query.Where(os => os.CodOS == parameters.CodOS);
            }

            if (parameters.NumOSCliente != null)
            {
                query = query.Where(os => os.NumOSCliente == parameters.NumOSCliente);
            }

            if (parameters.PA != null)
            {
                query = query.Where(os => os.RegiaoAutorizada.PA == parameters.PA);
            }

            if (parameters.NumOSQuarteirizada != null)
            {
                query = query.Where(os => os.NumOSQuarteirizada == parameters.NumOSQuarteirizada);
            }

            if (parameters.CodEquipContrato != null)
            {
                query = query.Where(os => os.CodEquipContrato == parameters.CodEquipContrato);
            }

            if (parameters.DataAberturaInicio != DateTime.MinValue && parameters.DataAberturaFim != DateTime.MinValue)
            {
                query = query.Where(
                    os =>
                    os.DataHoraAberturaOS >= parameters.DataAberturaInicio &&
                    os.DataHoraAberturaOS <= parameters.DataAberturaFim);
            }

            if (parameters.DataFechamentoInicio != DateTime.MinValue && parameters.DataFechamentoFim != DateTime.MinValue)
            {
                query = query.Where(
                    os =>
                    os.DataHoraFechamento >= parameters.DataFechamentoInicio &&
                    os.DataHoraFechamento <= parameters.DataFechamentoFim);
            }

            if (parameters.Filter != null)
            {
                query = query.Where(
                    t =>
                    t.CodOS.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    t.Cliente.NumBanco.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    t.Cliente.NomeFantasia.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.CodTiposGrupo != null)
            {
                query = query.Where(
                    os =>
                    os.EquipamentoContrato != null &&
                    parameters.CodTiposGrupo.Contains(os.EquipamentoContrato.CodTipoEquip.ToString())
                );
            }

            if (parameters.CodStatusServicos != null)
            {
                query = query.Where(
                    os =>
                    parameters.CodStatusServicos.Contains(os.CodStatusServico.ToString())
                );
            }

            if (parameters.CodRegioes != null)
            {
                var regioes = parameters.CodRegioes.Split(",");
                query = query.Where(os => regioes.Any(r => r == os.RegiaoAutorizada.CodRegiao.ToString()));
            }

            if (parameters.CodTiposIntervencao != null)
            {
                query = query.Where(
                    os =>
                    parameters.CodTiposIntervencao.Contains(os.CodTipoIntervencao.ToString())
                );
            }

            if (parameters.CodClientes != null)
            {
                query = query.Where(
                    os =>
                    parameters.CodClientes.Contains(os.CodCliente.ToString())
                );
            }

            if (parameters.CodEquipamentos != null)
            {
                query = query.Where(
                    os =>
                    parameters.CodEquipamentos.Contains(os.CodEquip.ToString())
                );
            }

            if (parameters.CodFiliais != null)
            {
                int[] filiais = parameters.CodFiliais.Split(',').Select(f => int.Parse(f)).ToArray();
                query = query.Where(
                    os =>
                    parameters.CodFiliais.Contains(os.CodFilial.ToString())
                );
            }

            if (parameters.CodAutorizadas != null)
            {
                query = query.Where(
                    os =>
                    parameters.CodAutorizadas.Contains(os.CodAutorizada.ToString())
                );
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                var property = parameters.SortActive;

                switch (property)
                {
                    case "fimSLA":
                        query = parameters.SortDirection == "asc" ?
                        query.Where(q => q.PrazosAtendimento.Any())
                             .OrderBy(q => q.PrazosAtendimento
                             .OrderBy(pa => pa.DataHoraLimiteAtendimento)
                             .Select(pa => pa.DataHoraLimiteAtendimento)
                             .FirstOrDefault()) :
                        query.Where(q => q.PrazosAtendimento.Any())
                             .OrderByDescending(q => q.PrazosAtendimento
                             .OrderByDescending(pa => pa.DataHoraLimiteAtendimento)
                             .Select(pa => pa.DataHoraLimiteAtendimento)
                             .FirstOrDefault());
                        break;

                    case "statusOS":
                        query = parameters.SortDirection == "asc" ?
                            query.OrderBy(q => q.StatusServico.Abrev) :
                            query.OrderByDescending(q => q.StatusServico.Abrev);
                        break;

                    case "nomeRegiao":
                        query = parameters.SortDirection == "asc" ?
                            query.OrderBy(q => q.EquipamentoContrato.Regiao.NomeRegiao) :
                            query.OrderByDescending(q => q.EquipamentoContrato.Regiao.NomeRegiao);
                        break;

                    case "pa":
                        query = parameters.SortDirection == "asc" ?
                            query.OrderBy(q => q.RegiaoAutorizada.PA) :
                            query.OrderByDescending(q => q.RegiaoAutorizada.PA);
                        break;
                    case "nomeLocal":
                        query = parameters.SortDirection == "asc" ?
                            query.OrderBy(q => q.LocalAtendimento.NomeLocal) :
                            query.OrderByDescending(q => q.LocalAtendimento.NomeLocal);
                        break;

                    case "numBanco":
                        query = parameters.SortDirection == "asc" ?
                            query.Where(q => !string.IsNullOrEmpty(q.Cliente.NumBanco))
                                 .OrderBy(q => q.Cliente.NumBanco) :
                            query.Where(q => !string.IsNullOrEmpty(q.Cliente.NumBanco))
                                 .OrderByDescending(q => q.Cliente.NumBanco);
                        break;

                    case "nomeEquip":
                        query = parameters.SortDirection == "asc" ?
                            query.Where(q => !string.IsNullOrEmpty(q.Equipamento.NomeEquip))
                                 .OrderBy(q => q.Equipamento.NomeEquip) :
                        query.Where(q => !string.IsNullOrEmpty(q.Equipamento.NomeEquip))
                             .OrderByDescending(q => q.Equipamento.NomeEquip);
                        break;

                    case "nomeSLA":
                        query = parameters.SortDirection == "asc" ?
                            query.Where(q => !string.IsNullOrEmpty(q.EquipamentoContrato.AcordoNivelServico.NomeSLA))
                                 .OrderBy(q => q.EquipamentoContrato.AcordoNivelServico.NomeSLA) :
                            query.Where(q => !string.IsNullOrEmpty(q.EquipamentoContrato.AcordoNivelServico.NomeSLA))
                                .OrderByDescending(q => q.EquipamentoContrato.AcordoNivelServico.NomeSLA);
                        break;

                    case "numSerie":
                        query = parameters.SortDirection == "asc" ?
                            query.Where(q => !string.IsNullOrEmpty(q.EquipamentoContrato.NumSerie))
                                 .OrderBy(q => q.EquipamentoContrato.NumSerie) :
                            query.Where(q => !string.IsNullOrEmpty(q.EquipamentoContrato.NumSerie))
                                 .OrderByDescending(q => q.EquipamentoContrato.NumSerie);
                        break;

                    case "nomeTecnico":
                        query = parameters.SortDirection == "asc" ?
                            query.Where(q => !string.IsNullOrEmpty(q.Tecnico.Nome))
                                 .OrderBy(q => q.Tecnico.Nome) :
                            query.Where(q => !string.IsNullOrEmpty(q.Tecnico.Nome))
                                 .OrderByDescending(q => q.Tecnico.Nome);
                        break;

                    default:
                        query = query.OrderBy(string.Format("{0} {1}", parameters.SortActive, parameters.SortDirection));
                        break;
                }
            }

            return PagedList<OrdemServico>.ToPagedList(query, parameters.PageNumber, parameters.PageSize);
        }

        public OrdemServico ObterPorCodigo(int codigo)
        {
            var ordemServico = _context.OrdemServico
                .Include(os => os.StatusServico)
                .Include(os => os.TipoIntervencao)
                .Include(os => os.LocalAtendimento)
                .Include(os => os.LocalAtendimento.Cidade)
                .Include(os => os.LocalAtendimento.Cidade.UnidadeFederativa)
                .Include(os => os.Equipamento)
                .Include(os => os.EquipamentoContrato)
                .Include(os => os.EquipamentoContrato.AcordoNivelServico)
                .Include(os => os.RegiaoAutorizada)
                .Include(os => os.RegiaoAutorizada.Filial)
                .Include(os => os.RegiaoAutorizada.Autorizada)
                .Include(os => os.RegiaoAutorizada.Regiao)
                .Include(os => os.Cliente)
                .Include(os => os.Cliente.Cidade)
                .Include(os => os.Tecnico)
                .Include(os => os.RelatoriosAtendimento)
                .Include(os => os.EquipamentoContrato.Contrato)
                .Include(os => os.Fotos)
                .Include(os => os.Agendamentos)
                .Include(os => os.PrazosAtendimento)
                .Include(os => os.Intencoes)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.ProtocolosSTN)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.RelatorioAtendimentoDetalhes)
                        .ThenInclude(d => d.TipoCausa)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.RelatorioAtendimentoDetalhes)
                        .ThenInclude(d => d.GrupoCausa)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.RelatorioAtendimentoDetalhes)
                        .ThenInclude(d => d.Causa)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.RelatorioAtendimentoDetalhes)
                        .ThenInclude(d => d.Acao)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.RelatorioAtendimentoDetalhes)
                        .ThenInclude(d => d.Defeito)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.Tecnico)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.StatusServico)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.TipoServico)
                .Include(os => os.RelatoriosAtendimento)
                    .ThenInclude(a => a.CheckinsCheckouts)
                .Include(os => os.OrdensServicoRelatorioInstalacao)
                .FirstOrDefault(os => os.CodOS == codigo);

            return ordemServico;
        }
    }
}
