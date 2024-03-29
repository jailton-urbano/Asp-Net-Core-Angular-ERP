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
    public class GrupoCausaController : ControllerBase
    {
        private readonly IGrupoCausaService _grupoCausaService;

        public GrupoCausaController(IGrupoCausaService grupoCausaService)
        {
            _grupoCausaService = grupoCausaService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] GrupoCausaParameters parameters)
        {
            return _grupoCausaService.ObterPorParametros(parameters);
        }

        [HttpGet("{codGrupoCausa}")]
        public GrupoCausa Get(int codGrupoCausa)
        {
            return _grupoCausaService.ObterPorCodigo(codGrupoCausa);
        }

        [HttpPost]
        public void Post([FromBody] GrupoCausa grupoCausa)
        {
            _grupoCausaService.Criar(grupoCausa);
        }

        [HttpPut]
        public void Put([FromBody] GrupoCausa grupoCausa)
        {
            _grupoCausaService.Atualizar(grupoCausa);
        }

        [HttpDelete("{codGrupoCausa}")]
        public void Delete(int codGrupoCausa)
        {
            _grupoCausaService.Deletar(codGrupoCausa);
        }
    }
}
