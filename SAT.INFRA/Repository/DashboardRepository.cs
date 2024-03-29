﻿using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using System.Linq.Dynamic.Core;
using SAT.MODELS.Views;
using System.Linq;
using System.Collections.Generic;
using SAT.MODELS.Entities.Params;

namespace SAT.INFRA.Repository
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly AppDbContext _context;

        public DashboardRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<ViewDashboardIndicadoresFiliais> ObterDadosIndicadorFiliais()
        {
            return this._context.ViewDashboardIndicadoresFiliais.ToList();
        }

        public List<ViewDashboardChamadosMaisAntigosCorretivas> ObterChamadosMaisAntigosCorretivas()
        {
            return this._context.ViewDashboardChamadosMaisAntigosCorretivas.ToList();
        }

        public List<ViewDashboardChamadosMaisAntigosOrcamentos> ObterChamadosMaisAntigosOrcamentos()
        {
            return this._context.ViewDashboardChamadosMaisAntigosOrcamentos.ToList();
        }

        public List<ViewDashboardDisponibilidadeBBTSFiliais> ObterIndicadorDisponibilidadeBBTSFiliais()
        {
            return this._context.ViewDashboardDisponibilidadeBBTSFiliais.ToList();
        }

        public List<ViewDashboardDisponibilidadeBBTSMapaRegioes> ObterIndicadorDisponibilidadeBBTSMapaRegioes()
        {
            return this._context.ViewDashboardDisponibilidadeBBTSMapaRegioes.ToList();
        }

        public List<ViewDashboardDisponibilidadeBBTSMultasDisponibilidade> ObterIndicadorDisponibilidadeBBTSMultasDisponibilidade()
        {
            return this._context.ViewDashboardDisponibilidadeBBTSMultasDisponibilidade.ToList();
        }

        public List<ViewDashboardDisponibilidadeBBTSMultasRegioes> ObterIndicadorDisponibilidadeBBTSMultasRegioes()
        {
            return this._context.ViewDashboardDisponibilidadeBBTSMultasRegioes.ToList();
        }

        public List<ViewDashboardDisponibilidadeTecnicos> ObterIndicadorDisponibilidadeTecnicos()
        {
            return this._context.ViewDashboardDisponibilidadeTecnicos.ToList();
        }

        public List<ViewDashboardDisponibilidadeTecnicosMediaGlobal> ObterIndicadorDisponibilidadeTecnicosMediaGlobal()
        {
            return this._context.ViewDashboardDisponibilidadeTecnicosMediaGlobal.ToList();
        }

        public List<ViewDashboardSPA> ObterDadosSPA()
        {
            return this._context.ViewDashboardSPA.ToList();
        }

        public List<ViewDashboardSLAClientes> ObterDadosSLAClientes()
        {
            return this._context.ViewDashboardSLAClientes.ToList();
        }

        public List<ViewDashboardReincidenciaFiliais> ObterDadosReincidenciaFiliais()
        {
            return this._context.ViewDashboardReincidenciaFiliais.ToList();
        }

        public List<ViewDashboardReincidenciaQuadrimestreFiliais> ObterDadosReincidenciaQuadrimestreFilial(DashboardParameters parameters)
        {
            return this._context.ViewDashboardReincidenciaQuadrimestreFiliais.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardReincidenciaClientes> ObterDadosReincidenciaClientes()
        {
            return this._context.ViewDashboardReincidenciaClientes.ToList();
        }

        public List<ViewDashboardSPATecnicosMenorDesempenho> ObterDadosSPATecnicosMenorDesempenho(DashboardParameters parameters)
        {
            if (parameters.CodFilial.HasValue)
                return this._context.ViewDashboardSPATecnicosMenorDesempenho.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();

            return this._context.ViewDashboardSPATecnicosMenorDesempenho.ToList();
        }

        public List<ViewDashboardSPATecnicosMaiorDesempenho> ObterDadosSPATecnicosMaiorDesempenho(DashboardParameters parameters)
        {
            if (parameters.CodFilial.HasValue)
                return this._context.ViewDashboardSPATecnicosMaiorDesempenho.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();

            return this._context.ViewDashboardSPATecnicosMaiorDesempenho.ToList();
        }

        public List<ViewDashboardReincidenciaTecnicosMenosReincidentes> ObterDadosReincidenciaTecnicosMenosReincidentes()
        {
            return this._context.ViewDashboardReincidenciaTecnicosMenosReincidentes.ToList();
        }

        public List<ViewDashboardReincidenciaTecnicosMaisReincidentes> ObterDadosReincidenciaTecnicosMaisReincidentes()
        {
            return this._context.ViewDashboardReincidenciaTecnicosMaisReincidentes.ToList();
        }

        public List<ViewDashboardEquipamentosMaisReincidentes> ObterDadosEquipamentosMaisReincidentes()
        {
            return this._context.ViewDashboardEquipamentosMaisReincidentes.ToList();
        }

        public List<ViewDashboardPendenciaFiliais> ObterDadosPendenciaFiliais()
        {
            return this._context.ViewDashboardPendenciaFiliais.ToList();
        }

        public List<ViewDashboardPendenciaQuadrimestreFiliais> ObterDadosPendenciaQuadrimestreFilial(DashboardParameters parameters)
        {
            return this._context.ViewDashboardPendenciaQuadrimestreFiliais.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardTecnicosMenosPendentes> ObterDadosTecnicosMenosPendentes()
        {
            return this._context.ViewDashboardTecnicosMenosPendentes.ToList();
        }

        public List<ViewDashboardTecnicosMaisPendentes> ObterDadosTecnicosMaisPendentes()
        {
            return this._context.ViewDashboardTecnicosMaisPendentes.ToList();
        }

        public List<ViewDashboardPendenciaGlobal> ObterDadosPendenciaGlobal()
        {
            return this._context.ViewDashboardPendenciaGlobal.ToList();
        }

        public List<ViewDashboardPecasFaltantes> ObterDadosPecasFaltantes()
        {
            return this._context.ViewDashboardPecasFaltantes.ToList();
        }

        public List<ViewDashboardPecasMaisFaltantes> ObterDadosPecasMaisFaltantes()
        {
            return this._context.ViewDashboardPecasMaisFaltantes.ToList();
        }

        public List<ViewDashboardPecasCriticasMaisFaltantes> ObterDadosPecasCriticasMaisFaltantes()
        {
            return this._context.ViewDashboardPecasCriticasMaisFaltantes.ToList();
        }

        public List<ViewDashboardPecasCriticaChamadosFaltantes> ObterDadosPecasCriticasChamadosFaltantes(DashboardParameters parameters)
        {
            return this._context.ViewDashboardPecasCriticaChamadosFaltantes.Where(cod => cod.CodPeca == parameters.CodPeca).ToList();
        }

        public List<ViewDashboardPecasCriticaEstoqueFaltantes> ObterDadosPecasCriticasEstoqueFaltantes(DashboardParameters parameters)
        {
            return this._context.ViewDashboardPecasCriticaEstoqueFaltantes.Where(cod => cod.CodPeca == parameters.CodPeca).ToList();
        }

        public List<ViewDashboardDensidadeEquipamentos> ObterDadosDensidadeEquipamentos(DashboardParameters parameters)
        {
            var query = _context.ViewDashboardDensidadeEquipamentos.AsQueryable();

            if (parameters.CodFilial.HasValue)
                query = query.Where(d => d.CodFilial == parameters.CodFilial);

            if (!string.IsNullOrWhiteSpace(parameters.CodFiliais))
            {
                int[] cods = parameters.CodFiliais.Split(",").Select(a => int.Parse(a.Trim())).Distinct().ToArray();
                query = query.Where(dd => cods.Contains(dd.CodFilial.Value));
            }

            if (parameters.CodRegiao.HasValue)
                query = query.Where(d => d.CodRegiao == parameters.CodRegiao);

            if (!string.IsNullOrWhiteSpace(parameters.CodRegioes))
            {
                int[] cods = parameters.CodRegioes.Split(",").Select(a => int.Parse(a.Trim())).Distinct().ToArray();
                query = query.Where(dd => cods.Contains(dd.CodRegiao.Value));
            }

            if (parameters.CodAutorizada.HasValue)
                query = query.Where(d => d.CodAutorizada == parameters.CodAutorizada);

            if (!string.IsNullOrWhiteSpace(parameters.CodAutorizadas))
            {
                int[] cods = parameters.CodAutorizadas.Split(",").Select(a => int.Parse(a.Trim())).Distinct().ToArray();
                query = query.Where(dd => cods.Contains(dd.CodAutorizada.Value));
            }

            if (!string.IsNullOrWhiteSpace(parameters.CodClientes))
            {
                int[] cods = parameters.CodClientes.Split(",").Select(a => int.Parse(a.Trim())).Distinct().ToArray();
                query = query.Where(dd => cods.Contains(dd.CodCliente.Value));
            }

            if (!string.IsNullOrWhiteSpace(parameters.CodEquips))
            {
                int[] cods = parameters.CodEquips.Split(",").Select(a => int.Parse(a.Trim())).Distinct().ToArray();
                query = query.Where(dd => cods.Contains(dd.CodEquip.Value));
            }

            return query.ToList();
        }

        public List<ViewDashboardDensidadeTecnicos> ObterDadosDensidadeTecnicos(DashboardParameters parameters)
        {
            var query = _context.ViewDashboardDensidadeTecnicos.AsQueryable();

            if (parameters.CodFilial.HasValue)
                query = query.Where(d => d.CodFilial == parameters.CodFilial);

            if (!string.IsNullOrWhiteSpace(parameters.CodFiliais))
            {
                int[] cods = parameters.CodFiliais.Split(",").Select(a => int.Parse(a.Trim())).Distinct().ToArray();
                query = query.Where(dd => cods.Contains(dd.CodFilial.Value));
            }

            if (parameters.CodRegiao.HasValue)
                query = query.Where(d => d.CodRegiao == parameters.CodRegiao);

            if (!string.IsNullOrWhiteSpace(parameters.CodRegioes))
            {
                int[] cods = parameters.CodRegioes.Split(",").Select(a => int.Parse(a.Trim())).Distinct().ToArray();
                query = query.Where(dd => cods.Contains(dd.CodRegiao.Value));
            }

            if (parameters.CodAutorizada.HasValue)
                query = query.Where(d => d.CodAutorizada == parameters.CodAutorizada);

            if (!string.IsNullOrWhiteSpace(parameters.CodAutorizadas))
            {
                int[] cods = parameters.CodAutorizadas.Split(",").Select(a => int.Parse(a.Trim())).Distinct().ToArray();
                query = query.Where(dd => cods.Contains(dd.CodAutorizada.Value));
            }
            
            return query.ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosSLACliente> ObterDadosIndicadoresDetalhadosSLACliente(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosSLACliente.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosSLARegiao> ObterDadosIndicadoresDetalhadosSLARegiao(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosSLARegiao.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosSLATecnico> ObterDadosIndicadoresDetalhadosSLATecnico(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosSLATecnico.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosPendenciaTecnico> ObterDadosIndicadoresDetalhadosPendenciaTecnico(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosPendenciaTecnico.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosPendenciaRegiao> ObterDadosIndicadoresDetalhadosPendenciaRegiao(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosPendenciaRegiao.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosPendenciaCliente> ObterDadosIndicadoresDetalhadosPendenciaCliente(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosPendenciaCliente.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosReincidenciaTecnico> ObterDadosIndicadoresDetalhadosReincidenciaTecnico(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosReincidenciaTecnico.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosReincidenciaRegiao> ObterDadosIndicadoresDetalhadosReincidenciaRegiao(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosReincidenciaRegiao.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosReincidenciaCliente> ObterDadosIndicadoresDetalhadosReincidenciaCliente(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosReincidenciaCliente.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosPerformance> ObterDadosIndicadoresDetalhadosPerformance(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosPerformance.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosChamadosAntigos> ObterDadosIndicadoresDetalhadosChamadosAntigos(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosChamadosAntigos.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosSPACliente> ObterDadosIndicadoresDetalhadosSPACliente(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosSPACliente.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosSPARegiao> ObterDadosIndicadoresDetalhadosSPARegiao(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosSPARegiao.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }

        public List<ViewDashboardIndicadoresDetalhadosSPATecnico> ObterDadosIndicadoresDetalhadosSPATecnico(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosSPATecnico.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }        

        public List<ViewDashboardIndicadoresDetalhadosProdutividade> ObterDadosIndicadoresDetalhadosProdutividade(DashboardParameters parameters)
        {
            return this._context.ViewDashboardIndicadoresDetalhadosProdutividade.Where(cod => cod.CodFilial == parameters.CodFilial).ToList();
        }         
    }
}
