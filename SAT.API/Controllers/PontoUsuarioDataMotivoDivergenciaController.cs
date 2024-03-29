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
    public class PontoUsuarioDataMotivoDivergenciaController : ControllerBase
    {
        private readonly IPontoUsuarioDataMotivoDivergenciaService _pontoUsuarioDataMotivoDivergenciaService;

        public PontoUsuarioDataMotivoDivergenciaController(IPontoUsuarioDataMotivoDivergenciaService pontoUsuarioDataMotivoDivergenciaService)
        {
            _pontoUsuarioDataMotivoDivergenciaService = pontoUsuarioDataMotivoDivergenciaService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] PontoUsuarioDataMotivoDivergenciaParameters parameters)
        {
            return _pontoUsuarioDataMotivoDivergenciaService.ObterPorParametros(parameters);
        }
    }
}
