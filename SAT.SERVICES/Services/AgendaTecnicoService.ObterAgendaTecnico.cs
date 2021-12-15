﻿using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Enums;
using SAT.SERVICES.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SAT.SERVICES.Services
{
    public partial class AgendaTecnicoService : IAgendaTecnicoService
    {
        public AgendaTecnico[] ObterAgendaTecnico(AgendaTecnicoParameters parameters)
        {
            List<AgendaTecnico> agendamentos =
                this.ObterAgenda(parameters.InicioPeriodoAgenda.Value, parameters.FimPeriodoAgenda.Value, parameters.CodTecnicos);

            var pontos = this.ObterPontosDoDiaAsync(parameters).Result;
            var intervalos = this.CriaIntervalosDoDia(agendamentos, parameters);
            var agendamentosValidados = this.ValidaAgendamentos(agendamentos);

            agendamentosValidados.AddRange(pontos);
            agendamentosValidados.AddRange(intervalos);

            return agendamentosValidados.Distinct().ToArray();
        }

        private List<AgendaTecnico> ObterAgenda(DateTime inicioPeriodo, DateTime fimPeriodo, string codTecnicos) =>
           this._agendaRepo.ObterQuery(new AgendaTecnicoParameters
           {
               InicioPeriodoAgenda = DateTime.Now.DayOfWeek == DayOfWeek.Monday ? inicioPeriodo.AddDays(-7) : inicioPeriodo,
               FimPeriodoAgenda = fimPeriodo,
               CodTecnicos = codTecnicos,
               IndAtivo = 1
           }).ToList();

        private List<AgendaTecnico> ObterAgenda(DateTime inicioPeriodo, DateTime fimPeriodo, int codTecnico) =>
           this._agendaRepo.ObterQuery(new AgendaTecnicoParameters
           {
               InicioPeriodoAgenda = inicioPeriodo,
               FimPeriodoAgenda = fimPeriodo,
               CodTecnico = codTecnico,
               IndAtivo = 1
           }).ToList();

        private List<AgendaTecnico> ValidaAgendamentos(List<AgendaTecnico> agendamentos)
        {
            List<AgendaTecnico> eventosValidados = new List<AgendaTecnico>();

            var tasks = agendamentos.GroupBy(i => i.CodTecnico);

            foreach (var t in tasks)
            {
                if (t.ToList()
                   .Where(i => i.IndAgendamento == 0 && i.Tipo == AgendaTecnicoTypeEnum.OS)
                   .Any(i => i.Fim.Date < DateTime.Now.Date && i.OrdemServico.CodStatusServico != (int)StatusServicoEnum.FECHADO))
                {
                    var eventosRealocados = this.RealocaEventosTecnico(t.ToList());
                    eventosValidados.AddRange(eventosRealocados);
                    continue;
                }

                eventosValidados.AddRange(t.ToList().Where(i => i.IndAgendamento == 1).ToList());

                t.ToList()
                .Where(i => i.IndAgendamento == 0 && i.Tipo == AgendaTecnicoTypeEnum.OS)
                .OrderBy(i => i.Inicio)
                .ToList().ForEach(i =>
                {
                    if (i.Fim.Date == DateTime.Now.Date && i.Fim < DateTime.Now)
                    {
                        i.Cor = GetStatusColor(i.OrdemServico.CodStatusServico);
                        this._agendaRepo.Atualizar(i);
                        eventosValidados.Add(i);
                    }
                    else eventosValidados.Add(i);
                });
            }

            return eventosValidados;
        }

        private List<AgendaTecnico> CriaIntervalosDoDia(List<AgendaTecnico> agendamentos, AgendaTecnicoParameters parameters)
        {
            List<AgendaTecnico> novosIntervalos = new List<AgendaTecnico>();

            if (string.IsNullOrWhiteSpace(parameters.CodTecnicos)) return novosIntervalos;

            var codTecnicos = parameters.CodTecnicos
                .Split(",")
                .Select(i => i.Trim())
                .Distinct()
                .ToList();

            var intervalosDoDia =
                agendamentos
                .Where(i => i.Tipo == AgendaTecnicoTypeEnum.INTERVALO && i.Inicio.Date == DateTime.Today.Date).ToList();

            if (intervalosDoDia.Count() == codTecnicos.Count()) return intervalosDoDia;

            codTecnicos.ToList().ForEach(codTec =>
            {
                var codTecnico = Convert.ToInt32(codTec);

                if (!intervalosDoDia.Any(i => i.CodTecnico == codTecnico))
                {
                    AgendaTecnico a = new AgendaTecnico
                    {
                        CodTecnico = codTecnico,
                        CodUsuarioCad = "ADMIN",
                        DataHoraCad = DateTime.Now,
                        Cor = this.GetTypeColor(AgendaTecnicoTypeEnum.INTERVALO),
                        Tipo = AgendaTecnicoTypeEnum.INTERVALO,
                        Titulo = "INTERVALO",
                        Inicio = this.InicioIntervalo,
                        Fim = this.FimIntervalo,
                        IndAgendamento = 0,
                        IndAtivo = 1
                    };

                    var ag = this._agendaRepo.Criar(a);
                    intervalosDoDia.Add(ag);
                }
            });

            return intervalosDoDia;
        }

        private async Task<List<AgendaTecnico>> ObterPontosDoDiaAsync(AgendaTecnicoParameters parameters)
        {
            if (string.IsNullOrEmpty(parameters.CodTecnicos)) return null;

            List<AgendaTecnico> pontos = new List<AgendaTecnico>();

            var tecnicos = this._tecnicoRepo.ObterQuery(
                new TecnicoParameters
                {
                    CodTecnicos = parameters.CodTecnicos
                })
                .AsEnumerable();

            await Task.WhenAll(tecnicos.Select(t => Task.Run(() =>
            {
                t.Usuario.PontosUsuario.ForEach(p =>
                {
                    pontos.Add(new AgendaTecnico
                    {
                        CodTecnico = t.CodTecnico,
                        Cor = this.GetTypeColor(AgendaTecnicoTypeEnum.PONTO),
                        Tipo = AgendaTecnicoTypeEnum.PONTO,
                        Inicio = p.DataHoraRegistro,
                        Fim = p.DataHoraRegistro.AddMilliseconds(25),
                        IndAgendamento = 0,
                        IndAtivo = 1
                    });
                });
            })));

            return pontos;
        }

        // Realoca eventos devido a atraso
        private List<AgendaTecnico> RealocaEventosTecnico(List<AgendaTecnico> agendasTecnico)
        {
            var codTecnico = agendasTecnico.FirstOrDefault().CodTecnico;

            AgendaTecnico ultimoEvento = null;
            OrdemServico ultimaOS = null;

            agendasTecnico
            .Where(i => i.IndAgendamento == 0 && i.Tipo == AgendaTecnicoTypeEnum.OS && i.OrdemServico.CodStatusServico != (int)StatusServicoEnum.FECHADO)
            .OrderBy(i => i.Inicio)
            .ToList()
            .ForEach(e =>
            {
                OrdemServico os = e.OrdemServico;

                var deslocamento = this.DistanciaEmMinutos(os, ultimaOS);
                var start = ultimoEvento != null ? ultimoEvento.Fim : this.InicioExpediente;

                // se começa durante a sugestão de intervalo
                if (this.isIntervalo(start))
                    start = this.FimIntervalo;
                else if (start >= this.FimExpediente)
                {
                    start = start.AddDays(1);
                    if (this.isIntervalo(start))
                        start = new DateTime(start.Year, start.Month, start.Day, this.FimIntervalo.Hour, this.FimIntervalo.Minute, 0);
                }

                var duracao = (e.Fim - e.Inicio).TotalMinutes;

                // adiciona deslocamento
                start = start.AddMinutes(deslocamento);
                if (this.isIntervalo(start))
                    start = this.FimIntervalo;
                else if (start >= this.FimExpediente)
                {
                    start = start.AddDays(1);
                    if (this.isIntervalo(start))
                        start = new DateTime(start.Year, start.Month, start.Day, this.FimIntervalo.Hour, this.FimIntervalo.Minute, 0);
                }

                // se termina durante a sugestao de intervalo
                var end = start.AddMinutes(duracao);
                if (this.isIntervalo(end))
                {
                    start = end.AddMinutes(deslocamento);
                    end = start.AddMinutes(duracao);
                }

                e.Inicio = start;
                e.Fim = end;
                e.CodUsuarioCad = "ADMIN";
                e.DataHoraCad = DateTime.Now;
                e.Cor = this.GetTypeColor(AgendaTecnicoTypeEnum.OS);
                var ag = this._agendaRepo.Atualizar(e);

                ultimoEvento = ag;
                ultimaOS = os;
            });

            return agendasTecnico;
        }

        private string GetStatusColor(int statusOS)
        {
            switch (statusOS)
            {
                case 3:
                    return "#4c4cff";
                default:
                    return "#ff4c4c";
            }
        }
    }
}