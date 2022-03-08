﻿using SAT.MODELS.Entities.Params;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SAT.API.Authorization;
using SAT.MODELS.Entities;
using SAT.MODELS.Enums;
using SAT.MODELS.ViewModels;
using SAT.SERVICES.Interfaces;

namespace SAT.API.Controllers
{
    // [Authorize]
    [EnableCors("CorsApi")]
    [Route("api/[controller]")]
    [ApiController]
    public class DespesaPeriodoController : ControllerBase
    {
        private readonly IDespesaPeriodoService _despesaPeriodo;

        public DespesaPeriodoController(IDespesaPeriodoService despesaPeriodo) =>
            _despesaPeriodo = despesaPeriodo;

        [CustomAuthorize(RoleGroup.FINANCEIRO, RoleEnum.FILIAL_LIDER, RoleEnum.FILIAL_COORDENADOR, RoleEnum.FILIAIS_SUPERVISOR)]
        [HttpGet]
        public ListViewModel Get([FromQuery] DespesaPeriodoParameters parameters) =>
            _despesaPeriodo.ObterPorParametros(parameters);

        [HttpGet("{codDespesaPeriodo}")]
        public DespesaPeriodo Get(int codDespesaPeriodo) =>
             _despesaPeriodo.ObterPorCodigo(codDespesaPeriodo);

        [HttpPost]
        [CustomAuthorize(RoleGroup.FINANCEIRO)]
        public void Post([FromBody] DespesaPeriodo despesa) =>
            _despesaPeriodo.Criar(despesa);

        [HttpPut]
        [CustomAuthorize(RoleGroup.FINANCEIRO)]
        public void Put([FromBody] DespesaPeriodo despesa) =>
            _despesaPeriodo.Atualizar(despesa);

        [HttpDelete("{codDespesaPeriodo}")]
        public void Delete(int codDespesaPeriodo) =>
            _despesaPeriodo.Deletar(codDespesaPeriodo);
    }
}