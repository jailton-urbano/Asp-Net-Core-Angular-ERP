using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SAT.MODELS.Entities;
using SAT.MODELS.ViewModels;
using SAT.MODELS.Entities.Params;
using SAT.SERVICES.Interfaces;

namespace SAT.API.Controllers
{
    [Authorize]
    [EnableCors("CorsApi")]
    [Route("api/[controller]")]
    [ApiController]
    public class PosVendaController : ControllerBase
    {
        private IPosVendaService _posVendaService;

        public PosVendaController(
            IPosVendaService posVendaService
        )
        {
            _posVendaService = posVendaService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] PosVendaParameters parameters)
        {
            return _posVendaService.ObterPorParametros(parameters);
        }

        [HttpGet("{codPosVenda}")]
        public PosVenda Get(int codPosVenda)
        {
            return _posVendaService.ObterPorCodigo(codPosVenda);
        }
    }
}
