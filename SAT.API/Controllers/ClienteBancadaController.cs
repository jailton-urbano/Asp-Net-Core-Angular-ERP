﻿using Microsoft.AspNetCore.Authorization;
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
    public class ClienteBancadaController : ControllerBase
    {
        private readonly IClienteBancadaService _ClienteBancadaService;

        public ClienteBancadaController(IClienteBancadaService ClienteBancadaService)
        {
            _ClienteBancadaService = ClienteBancadaService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] ClienteBancadaParameters parameters)
        {
            return _ClienteBancadaService.ObterPorParametros(parameters);
        }

        [HttpGet("{codClienteBancada}")]
        public ClienteBancada Get(int codClienteBancada)
        {
            return _ClienteBancadaService.ObterPorCodigo(codClienteBancada);
        }

        [HttpPost]
        public ClienteBancada Post([FromBody] ClienteBancada ClienteBancada)
        {
            return _ClienteBancadaService.Criar(ClienteBancada);
        }

        [HttpPut]
        public void Put([FromBody] ClienteBancada ClienteBancada)
        {
            _ClienteBancadaService.Atualizar(ClienteBancada);
        }

        [HttpDelete("{codClienteBancada}")]
        public void Delete(int codClienteBancada)
        {
            _ClienteBancadaService.Deletar(codClienteBancada);
        }
    }
}
