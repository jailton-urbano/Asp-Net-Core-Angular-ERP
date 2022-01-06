﻿using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Enums;
using SAT.MODELS.ViewModels;
using SAT.SERVICES.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SAT.SERVICES.Services
{
    public class MonitoramentoService : IMonitoramentoService
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly IOrdemServicoRepository _osRepository;

        public MonitoramentoService(IClienteRepository clienteRepository, IOrdemServicoRepository osRepository)
        {
            this._clienteRepository = clienteRepository;
            this._osRepository = osRepository;
        }

        public List<MonitoramentoClienteViewModel> ObterPorParametros()
        {
            List<MonitoramentoClienteViewModel> retorno = new();

            List<Cliente> listaClientes = this._clienteRepository.ObterPorQuery(new ClienteParameters
            {
                IndAtivo = 1
            })
            .ToList();

            var clientesViaIntegracao =
                this._osRepository.ObterQuery(new OrdemServicoParameters
                {
                    FilterType = OrdemServicoFilterEnum.FILTER_OS_INTEGRACAO_MONITORAMENTO_OUTROS_CLIENTES,
                    Include = OrdemServicoIncludeEnum.OS_INTEGRACAO_MONITORAMENTO
                })
                .AsEnumerable()
                .GroupBy(gr => gr.CodCliente)
                .ToList();


            retorno.AddRange((from os in clientesViaIntegracao
                              select new MonitoramentoClienteViewModel
                              {
                                  Nome = listaClientes.FirstOrDefault(s => os.Key == s.CodCliente).NomeFantasia,
                                  DataProcessamento = (DateTime)os.FirstOrDefault().DataHoraAberturaOS
                              })
                            .Distinct()
                            .ToList());

            var dadosBB = this._osRepository.ObterQuery(new OrdemServicoParameters
            {
                FilterType = OrdemServicoFilterEnum.FILTER_OS_INTEGRACAO_MONITORAMENTO_BB,
                Include = OrdemServicoIncludeEnum.OS_INTEGRACAO_MONITORAMENTO
            })
            .ToList();

            // BB Garantia 
            DateTime ultimoChamadoBBGarantia = dadosBB.Where(s => s.EquipamentoContrato.IndGarantia == 1).FirstOrDefault().DataHoraAberturaOS.Value;
            retorno.Add(new MonitoramentoClienteViewModel
            {
                Nome = "BB Garantia",
                DataProcessamento = ultimoChamadoBBGarantia
            });

            // BB Cobra 
            var ultimoChamadoBBCobra = dadosBB.Where(s => s.EquipamentoContrato.IndGarantia == 0).FirstOrDefault().DataHoraAberturaOS.Value;
            retorno.Add(new MonitoramentoClienteViewModel
            {
                Nome = "BB Cobra",
                DataProcessamento = ultimoChamadoBBCobra
            });

            return retorno.OrderByDescending(s => s.DataProcessamento).ToList();
        }
    }
}