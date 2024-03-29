﻿using Microsoft.AspNetCore.Authorization;
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
    public class RegiaoAutorizadaController : ControllerBase
    {
        private IRegiaoAutorizadaService _regiaoAutorizadaService;

        public RegiaoAutorizadaController(IRegiaoAutorizadaService regiaoAutorizadaService)
        {
            _regiaoAutorizadaService = regiaoAutorizadaService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] RegiaoAutorizadaParameters parameters)
        {
            return _regiaoAutorizadaService.ObterPorParametros(parameters);
        }

        [HttpGet("{codRegiao}/{codAutorizada}/{codFilial}")]
        public RegiaoAutorizada Get(int codRegiao, int codAutorizada, int codFilial)
        {
            return this._regiaoAutorizadaService.ObterPorCodigo(codRegiao, codAutorizada, codFilial);
        }

        [HttpPost]
        public void Post([FromBody] RegiaoAutorizada regiaoAutorizada)
        {
            _regiaoAutorizadaService.Criar(regiaoAutorizada);
        }

        [HttpDelete("{codRegiao}/{codAutorizada}/{codFilial}")]
        public void Delete(int codRegiao, int codAutorizada, int codFilial)
        {
            _regiaoAutorizadaService.Deletar(codRegiao, codAutorizada, codFilial);
        }
    }
}
