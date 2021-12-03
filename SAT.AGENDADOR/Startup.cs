using Microsoft.EntityFrameworkCore;
using SAT.INFRA.Context;
using SAT.INFRA.Repository;
using SAT.SERVICES.Services;
using System.Configuration;

namespace SAT.AGENDADOR
{
    public class Startup
    {
        private IndicadorService _indicadorService;

        public IndicadorService IndicadorService { get { return this._indicadorService; } }

        public Startup()
        {
            this.ConfigureServices();
        }

        public void ConfigureServices()
        {
            AppDbContext __dbContext = new AppDbContext
                             (new DbContextOptionsBuilder<AppDbContext>().UseSqlServer(ConfigurationManager.AppSettings["Prod"]).Options);

            /** Inicializa os reposit�rios e servi�os **/

            // Reposit�rios
            TecnicoRepository tecnicoRepository = new(__dbContext);
            FeriadoRepository feriadoRepository = new(__dbContext);
            DashboardRepository dashboardRepository = new(__dbContext);
            DispBBDesvioRepository dispBBDesvioRepository = new(__dbContext);
            DispBBRegiaoFilialRepository dispBBRegiaoFilialRepository = new(__dbContext);
            DispBBPercRegiaoRepository dispBBPercRegiaoRepository = new(__dbContext);
            OrdemServicoRepository osRepository = new(__dbContext, feriadoRepository);
            DispBBCriticidadeRepository dispBBCriticidadeRepository = new(__dbContext);
            EquipamentoContratoRepository equipamentoContratoRepository = new(__dbContext);

            // Servi�os
            FeriadoService feriadoService = new FeriadoService(feriadoRepository);
            DashboardService dashboardService = new(dashboardRepository, feriadoService);


            // Inicializa os servi�os que ser�o usados
            _indicadorService = new IndicadorService(
                osRepository, feriadoService, equipamentoContratoRepository, dispBBRegiaoFilialRepository, dispBBCriticidadeRepository,
               dispBBPercRegiaoRepository, dispBBDesvioRepository, dashboardService, tecnicoRepository);
        }
    }
}