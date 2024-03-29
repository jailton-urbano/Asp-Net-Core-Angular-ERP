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
    public class FotoController : ControllerBase
    {
        private readonly IFotoService _fotoService;

        public FotoController(IFotoService fotoService)
        {
            _fotoService = fotoService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] FotoParameters parameters)
        {
            return _fotoService.ObterPorParametros(parameters);
        }

        [HttpGet("{codFoto}")]
        public Foto Get(int codFoto)
        {
            return _fotoService.ObterPorCodigo(codFoto);
        }

        [HttpPost]
        public void Post([FromBody] Foto foto)
        {
            _fotoService.Criar(foto);
        }

        [HttpDelete("{codFoto}")]
        public void Delete(int codFoto)
        {
            _fotoService.Deletar(codFoto);
        }

        [HttpPost("{imageUrl}")]
        public void AlterarFotoPerfil([FromBody] ImagemPerfilModel model)
        {
            _fotoService.AlterarFotoPerfil(model);
        }

        [HttpGet]
        [Route("BuscaFotoUsuario/{codUsuario}")]
        public ImagemPerfilModel BuscaFotoUsuario(string codUsuario)
        {
            return _fotoService.BuscarFotoUsuario(codUsuario);
        }

    }
}