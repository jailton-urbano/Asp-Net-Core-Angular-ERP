using SAT.SERVICES.Interfaces;

namespace SAT.TASKS;
public partial class Worker : BackgroundService
{
    private readonly IPlantaoTecnicoService _plantaoTecnicoService;
    private readonly IPontoUsuarioService _pontoUsuarioService;
    private readonly IIntegracaoFinanceiroService _integracaoFinanceiroService;
    private readonly IIntegracaoBanrisulService _integracaoBanrisulService;
    private readonly ISatTaskService _satTaskService;
    private readonly IEmailService _emailService;

    public Worker(
        IPlantaoTecnicoService plantaoTecnicoService,
        IPontoUsuarioService pontoUsuarioService,
        IIntegracaoFinanceiroService integracaoFinanceiroService,
        IIntegracaoBanrisulService integracaoBanrisulService,
        IEmailService emailService,
        ISatTaskService satTaskService
    ) {
        _plantaoTecnicoService = plantaoTecnicoService;
        _pontoUsuarioService = pontoUsuarioService;
        _integracaoFinanceiroService = integracaoFinanceiroService;
        _integracaoBanrisulService = integracaoBanrisulService;
        _satTaskService = satTaskService;
        _emailService = emailService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _integracaoBanrisulService.ExecutarAsync();

                // if (_satTaskService.PermitirExecucao(SatTaskTipoEnum.PLANTAO_TECNICO_EMAIL))
                //     _plantaoTecnicoService.ProcessarTaskEmailsSobreaviso();

                // if (_satTaskService.PermitirExecucao(SatTaskTipoEnum.CORRECAO_INTERVALOS_RAT))
                //     _pontoUsuarioService.ProcessarTaskAtualizacaoIntervalosPonto();

                //_integracaoFinanceiroService.ExecutarAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
        }
    }
}