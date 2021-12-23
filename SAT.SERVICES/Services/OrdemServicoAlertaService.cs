using System.Collections.Generic;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Enums;
using SAT.SERVICES.Interfaces;
using System.Linq;
using System;
using SAT.MODELS.Entities.Constants;

namespace SAT.SERVICES.Services
{
    public class OrdemServicoAlertaService : IOrdemServicoAlertaService
    {
        private readonly IOrdemServicoRepository _ordemServicoRepo;
        private readonly ISequenciaRepository _sequenciaRepo;
        private readonly IDispBBCalcEquipamentoContratoRepository _dispBBCalcEquipContratoRepo;
        private readonly IDispBBPercRegiaoRepository _dispBBPercRegiaoRepo;
        private readonly IFeriadoRepository _feriadoRepo;

        public OrdemServicoAlertaService(
            IOrdemServicoRepository ordemServicoRepo,
            ISequenciaRepository sequenciaRepo,
            IDispBBCalcEquipamentoContratoRepository dispBBCalcEquipContratoRepo,
            IDispBBPercRegiaoRepository dispBBPercRegiaoRepo,
            IFeriadoRepository feriadoRepo
            )
        {
            _ordemServicoRepo = ordemServicoRepo;
            _sequenciaRepo = sequenciaRepo;
            _dispBBCalcEquipContratoRepo = dispBBCalcEquipContratoRepo;
            _dispBBPercRegiaoRepo = dispBBPercRegiaoRepo;
            _feriadoRepo = feriadoRepo; ;
        }

        public List<Alerta> ObterAlertas(OrdemServico os)
        {
            var alertas = new List<Alerta>();

            if (
                (os.CodUsuarioCadastro != null && os.CodUsuarioCadastro.Equals(Constants.USUARIO_SERVICO)) &&
                os.EquipamentoContrato.CodContrato.Equals(Constants.CONTRATO_BB_TECNOLOGIA) &&
                !Constants.EQUIPS_TDS_TCC_TOP_TR1150.Any(i => i.Equals(os.EquipamentoContrato.CodEquip)) &&
                Constants.TIPO_INTERVENCAO_GERAL.Any(i => i.Equals(os.CodTipoIntervencao))
                )
            {
                alertas = ObterAlertasDispBB(os, alertas);
            }

            alertas = ObterAvisoChamadoVisualizado(os, alertas);
            alertas = ObterAvisoChamadosMesmoEquip(os, alertas);
            alertas = ObterAvisoChamadosCidadePinpad(os, alertas);

            return alertas;
        }

        private List<Alerta> ObterAlertasDispBB(OrdemServico os, List<Alerta> listaAlerta)
        {
            var alerta = new Alerta
            {
                Titulo = "Chamado BB Tecnologia 0125/2017 ",
                Descricao = new List<string>(),
                Tipo = Constants.INFO
            };
            TimeSpan hrMaxPorEquip = CalculaHorasDisponiveis(os);
            TimeSpan horasConsumidas = CalculaHorasConsumidas(os);

            alerta.Descricao.Add($@"Nesta criticidade {os.EquipamentoContrato.DispBBCriticidade.CodDispBBCriticidade} 
                                    e região {os.LocalAtendimento.Cidade.UnidadeFederativa.DispBBRegiaoUF.DispBBRegiao.Nome.ToUpper()}, 
                                    cada máquina deste parque pode consumir no máximo {hrMaxPorEquip} hrs e este chamado já consumiu {horasConsumidas.TotalHours} hrs. 
                                    É de suma importância priorizar este atendimento e avaliar criteriosamente se a causa foi vandalismo/mau uso.");

            listaAlerta.Add(alerta);
            return listaAlerta;
        }

        private TimeSpan CalculaHorasConsumidas(OrdemServico os)
        {

            var dataSolicitacao = os.DataHoraAberturaOS;
            var dataAtualOuFimRat = os.RelatoriosAtendimento.Any() ? os.RelatoriosAtendimento.LastOrDefault().DataHoraSolucao : DateTime.Now;

            var diasNaoUteis = _feriadoRepo.CalculaDiasNaoUteis((DateTime)dataSolicitacao, dataAtualOuFimRat);

            int minutes = (int)(dataAtualOuFimRat - dataSolicitacao).Value.TotalMinutes;

            TimeSpan inicioSla = os.EquipamentoContrato.AcordoNivelServico.HorarioInicio.Value.TimeOfDay;
            TimeSpan fim = os.EquipamentoContrato.AcordoNivelServico.HorarioFim.Value.TimeOfDay;

            if (diasNaoUteis > 0)
            {
                var minutosNaoUteis = fim.Subtract(inicioSla).TotalMinutes * diasNaoUteis;

                var minutosTotais = Enumerable.Range(0, minutes)
                    .Select(min => dataSolicitacao.Value.AddMinutes(min))
                    .Where(dt => dt.TimeOfDay >= inicioSla && dt.TimeOfDay < fim)
                    .Count() - (int)minutosNaoUteis;

                return TimeSpan.FromHours(Convert.ToDouble(minutosTotais / 60));
            }

            return TimeSpan
                        .FromHours(
                            Enumerable.Range(0, minutes)
                            .Select(min => dataSolicitacao.Value.AddMinutes(min))
                            .Where(dt => dt.TimeOfDay >= inicioSla && dt.TimeOfDay < fim)
                            .Count() / 60);
        }

        private TimeSpan CalculaHorasDisponiveis(OrdemServico os)
        {

            var dispBBParque = _dispBBCalcEquipContratoRepo
                        .ObterPorParametros(new DispBBCalcEquipamentoContratoParameters
                        {
                            CodDispBBRegiao = os.LocalAtendimento.Cidade.UnidadeFederativa.DispBBRegiaoUF.CodDispBBRegiao,
                            Criticidade = os.EquipamentoContrato.DispBBCriticidade.CodDispBBCriticidade,
                            AnoMes = DateTime.Now.ToString("yyyyMM")
                        });

            var dispBBPerc = _dispBBPercRegiaoRepo
                                .ObterPorParametros(new DispBBPercRegiaoParameters { IndAtivo = 1 })
                                .FirstOrDefault(e => e.Criticidade == os.EquipamentoContrato.DispBBCriticidade.CodDispBBCriticidade &&
                                            e.CodDispBBRegiao == os.LocalAtendimento.Cidade.UnidadeFederativa.DispBBRegiaoUF.CodDispBBRegiao);

            var hrMaxPorEquip = Convert.ToDouble(
                                    (dispBBParque.Sum(disp => disp.MinTotais) / 60) *
                                    (dispBBPerc.Percentual / 100) /
                                    dispBBParque.Count()
                                    );

            return TimeSpan.FromHours(hrMaxPorEquip);
        }

        private List<Alerta> ObterAvisoChamadosCidadePinpad(OrdemServico os, List<Alerta> listaAlertas)
        {

            var osEquip = _ordemServicoRepo
                    .ObterPorParametros(new OrdemServicoParameters
                    {
                        Include = OrdemServicoIncludeEnum.OS_EQUIPAMENTOS,
                        CodEquipamentos = string.Join(",", Constants.EQUIPAMENTOS_PINPAD),
                        NotIn_CodStatusServicos = "2,3,16"
                    })
                    .Where(c => c.CodOS != os.CodOS &&
                            (c.LocalAtendimento != null && c.LocalAtendimento.CodCidade.Equals(os.LocalAtendimento.CodCidade)) &&
                            Constants.EQUIPAMENTOS_PINPAD.Any(i => i.Equals(c.CodEquip)))
                    .ToList();

            if (osEquip.Any())
            {
                var alerta = new Alerta
                {
                    Titulo = "Chamados de PINPAD para a mesma cidade ",
                    Descricao = new List<string>(),
                    Tipo = Constants.INFO
                };

                osEquip.ForEach(e =>
                {
                    alerta.Descricao.Add($"{e.CodOS} - {e.TipoIntervencao.NomTipoIntervencao} - {e.StatusServico.NomeStatusServico}");
                });

                listaAlertas.Add(alerta);

                return listaAlertas;
            }

            return listaAlertas;
        }

        private List<Alerta> ObterAvisoChamadoVisualizado(OrdemServico os, List<Alerta> listaAlertas)
        {
            if (os.CodStatusServico != 8) return listaAlertas;

            var alerta = new Alerta
            {
                Titulo = "Chamado visualizado pelo técnico",
                Descricao = new List<string>(),
                Tipo = Constants.SUCCESS
            };

            if (string.IsNullOrEmpty(os.CodUsuarioOSMobileLida))
            {
                alerta.Titulo = "Chamado ainda não visualizado";
                alerta.Descricao.Add($"Técnico Transferido: {os.Tecnico?.Nome}");
                alerta.Tipo = Constants.INFO;
                listaAlertas.Add(alerta);

                return listaAlertas;
            }

            alerta.Descricao.Add($"Técnico: {os.Tecnico?.Nome} às {os.DataHoraOSMobileLida}");

            listaAlertas.Add(alerta);

            return listaAlertas;
        }

        private List<Alerta> ObterAvisoChamadosMesmoEquip(OrdemServico os, List<Alerta> listaAlertas)
        {
            var osEquip = _ordemServicoRepo
                    .ObterPorParametros(new OrdemServicoParameters
                    {
                        CodEquipContrato = os.CodEquipContrato,
                        NotIn_CodStatusServicos = "2,3,16"
                    }).Where(c => c.CodOS != os.CodOS).ToList();

            if (!osEquip.Any() || !os.CodEquipContrato.HasValue) return listaAlertas;

            var alerta = new Alerta
            {
                Titulo = "Mais de um chamado aberto para este equipamento",
                Descricao = new List<string>(),
                Tipo = Constants.WARNING
            };

            osEquip.ForEach(os =>
                    {
                        alerta.Descricao.Add($"{os.CodOS} - {os.TipoIntervencao.NomTipoIntervencao} - {os.StatusServico.NomeStatusServico}");
                    });

            listaAlertas.Add(alerta);

            return listaAlertas;
        }
    }
}