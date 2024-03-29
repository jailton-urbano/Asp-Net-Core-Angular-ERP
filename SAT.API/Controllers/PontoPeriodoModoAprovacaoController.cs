using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Entities;
using SAT.MODELS.ViewModels;
using SAT.SERVICES.Interfaces;

namespace SAT.API.Controllers
{
    [Authorize]
    [EnableCors("CorsApi")]
    [Route("api/[controller]")]
    [ApiController]
    public class PontoPeriodoModoAprovacaoController : ControllerBase
    {
        private readonly IPontoPeriodoModoAprovacaoService _pontoPeriodoModoAprovacaoService;

        public PontoPeriodoModoAprovacaoController(IPontoPeriodoModoAprovacaoService pontoPeriodoModoAprovacaoService)
        {
            _pontoPeriodoModoAprovacaoService = pontoPeriodoModoAprovacaoService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] PontoPeriodoModoAprovacaoParameters parameters)
        {
            return _pontoPeriodoModoAprovacaoService.ObterPorParametros(parameters);
        }

        [HttpGet("{codPontoPeriodoModoAprovacao}")]
        public PontoPeriodoModoAprovacao Get(int codPontoPeriodoModoAprovacao)
        {
            return _pontoPeriodoModoAprovacaoService.ObterPorCodigo(codPontoPeriodoModoAprovacao);
        }

        [HttpPost]
        public void Post([FromBody] PontoPeriodoModoAprovacao pontoPeriodoModoAprovacao)
        {
            _pontoPeriodoModoAprovacaoService.Criar(pontoPeriodoModoAprovacao: pontoPeriodoModoAprovacao);
        }

        [HttpPut]
        public void Put([FromBody] PontoPeriodoModoAprovacao pontoPeriodoModoAprovacao)
        {
            _pontoPeriodoModoAprovacaoService.Atualizar(pontoPeriodoModoAprovacao: pontoPeriodoModoAprovacao);
        }

        [HttpDelete("{codPontoPeriodoModoAprovacao}")]
        public void Delete(int codPontoPeriodoModoAprovacao)
        {
            _pontoPeriodoModoAprovacaoService.Deletar(codPontoPeriodoModoAprovacao);
        }
    }
}
