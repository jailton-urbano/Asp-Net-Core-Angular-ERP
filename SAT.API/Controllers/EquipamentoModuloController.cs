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
    public class EquipamentoModuloController : ControllerBase
    {
        private readonly IEquipamentoModuloService _equipamentoModuloService;

        public EquipamentoModuloController(IEquipamentoModuloService equipamentoModuloService)
        {
            _equipamentoModuloService = equipamentoModuloService;
        }

        [HttpGet]
        public ListViewModel Get([FromQuery] EquipamentoModuloParameters parameters)
        {
            return _equipamentoModuloService.ObterPorParametros(parameters);
        }

        [HttpGet("{codEquipamentoModulo}")]
        public EquipamentoModulo Get(int codEquipamentoModulo)
        {
            return _equipamentoModuloService.ObterPorCodigo(codEquipamentoModulo);
        }

        [HttpPost]
        public void Post([FromBody] EquipamentoModulo acao)
        {
            _equipamentoModuloService.Criar(acao);
        }

        [HttpPut]
        public void Put([FromBody] EquipamentoModulo acao)
        {
            _equipamentoModuloService.Atualizar(acao);
        }

        [HttpDelete("{codEquipamentoModulo}")]
        public void Delete(int codAcao)
        {
            _equipamentoModuloService.Deletar(codAcao);
        }
    }
}
