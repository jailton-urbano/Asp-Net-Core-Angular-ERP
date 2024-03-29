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
    public class PontoPeriodoIntervaloAcessoDataController : ControllerBase
    {
        private readonly IPontoPeriodoIntervaloAcessoDataService _pontoPeriodoIntervaloAcessoDataService;

        public PontoPeriodoIntervaloAcessoDataController(IPontoPeriodoIntervaloAcessoDataService pontoPeriodoIntervaloAcessoDataService)
        {
            _pontoPeriodoIntervaloAcessoDataService = pontoPeriodoIntervaloAcessoDataService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] PontoPeriodoIntervaloAcessoDataParameters parameters)
        {
            return _pontoPeriodoIntervaloAcessoDataService.ObterPorParametros(parameters);
        }

        [HttpGet("{codPontoPeriodoIntervaloAcessoData}")]
        public PontoPeriodoIntervaloAcessoData Get(int codPontoPeriodoIntervaloAcessoData)
        {
            return _pontoPeriodoIntervaloAcessoDataService.ObterPorCodigo(codPontoPeriodoIntervaloAcessoData);
        }

        [HttpPost]
        public void Post([FromBody] PontoPeriodoIntervaloAcessoData pontoPeriodoIntervaloAcessoData)
        {
            _pontoPeriodoIntervaloAcessoDataService.Criar(pontoPeriodoIntervaloAcessoData: pontoPeriodoIntervaloAcessoData);
        }

        [HttpPut]
        public void Put([FromBody] PontoPeriodoIntervaloAcessoData pontoPeriodoIntervaloAcessoData)
        {
            _pontoPeriodoIntervaloAcessoDataService.Atualizar(pontoPeriodoIntervaloAcessoData: pontoPeriodoIntervaloAcessoData);
        }

        [HttpDelete("{codPontoPeriodoIntervaloAcessoData}")]
        public void Delete(int codPontoPeriodoIntervaloAcessoData)
        {
            _pontoPeriodoIntervaloAcessoDataService.Deletar(codPontoPeriodoIntervaloAcessoData);
        }
    }
}
