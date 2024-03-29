using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.ViewModels;
using SAT.SERVICES.Interfaces;

namespace SAT.API.Controllers
{
    [Authorize]
    [EnableCors("CorsApi")]
    [Route("api/[controller]")]
    [ApiController]
    public class OrcamentoOutroServicoController : ControllerBase
    {
        private readonly IOrcamentoOutroServicoService _orcamentoOutroServicoService;

        public OrcamentoOutroServicoController(IOrcamentoOutroServicoService orcamentoOutroServicoService)
        {
            _orcamentoOutroServicoService = orcamentoOutroServicoService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] OrcamentoOutroServicoParameters parameters) =>
            _orcamentoOutroServicoService.ObterPorParametros(parameters);

        [HttpGet("{codOrcOutroServico}")]
        public OrcamentoOutroServico Get(int codOrcOutroServico) =>
            _orcamentoOutroServicoService.ObterPorCodigo(codOrcOutroServico);

        [HttpPost]
        public OrcamentoOutroServico Post([FromBody] OrcamentoOutroServico orcamento) =>
            _orcamentoOutroServicoService.Criar(orcamento);

        [HttpPut]
        public OrcamentoOutroServico Put([FromBody] OrcamentoOutroServico orcamentoOutroServico) =>
            _orcamentoOutroServicoService.Atualizar(orcamentoOutroServico);

        [HttpDelete("{codOrcOutroServico}")]
        public void Delete(int codOrcOutroServico) =>
            _orcamentoOutroServicoService.Deletar(codOrcOutroServico);
    }
}