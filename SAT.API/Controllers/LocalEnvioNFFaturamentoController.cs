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
    public class LocalEnvioNFFaturamentoController : ControllerBase
    {
        private readonly ILocalEnvioNFFaturamentoService _localEnvioNFFaturamentoService;

        public LocalEnvioNFFaturamentoController(
            ILocalEnvioNFFaturamentoService localEnvioNFFaturamentoService
        )
        {
            _localEnvioNFFaturamentoService = localEnvioNFFaturamentoService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] LocalEnvioNFFaturamentoParameters parameters)
        {
            return _localEnvioNFFaturamentoService.ObterPorParametros(parameters);
        }

        [HttpGet("{CodLocalEnvioNffaturamento}")]
        public LocalEnvioNFFaturamento Get(int CodLocalEnvioNffaturamento)
        {
            return _localEnvioNFFaturamentoService.ObterPorCodigo(CodLocalEnvioNffaturamento);
        }

        [HttpPost]
        public LocalEnvioNFFaturamento Post([FromBody] LocalEnvioNFFaturamento localEnvioNFFaturamento)
        {
            return _localEnvioNFFaturamentoService.Criar(localEnvioNFFaturamento);
        }

        [HttpPut]
        public void Put([FromBody] LocalEnvioNFFaturamento localEnvioNFFaturamento)
        {
            _localEnvioNFFaturamentoService.Atualizar(localEnvioNFFaturamento);
        }

        [HttpDelete("{CodLocalEnvioNffaturamento}")]
        public void Delete(int CodLocalEnvioNffaturamento)
        {
            _localEnvioNFFaturamentoService.Deletar(CodLocalEnvioNffaturamento);
        }
    }
}
