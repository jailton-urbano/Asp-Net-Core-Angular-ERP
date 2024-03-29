﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SAT.MODELS.Entities;
using SAT.SERVICES.Interfaces;

namespace SAT.API.Controllers
{
    [Authorize]
    [EnableCors("CorsApi")]
    [Route("api/[controller]")]
    [ApiController]
    public class FiltroController : ControllerBase
    {
        private readonly IFiltroService _filtroService;

        public FiltroController(IFiltroService filtroService)
        {
            _filtroService = filtroService;
        }

        [HttpPost]
        public void Post([FromBody] FiltroUsuario filtroUsuario)
        {
            _filtroService.Criar(filtroUsuario);
        }

        [HttpPut]
        public void Put([FromBody] FiltroUsuario filtroUsuario)
        {
            _filtroService.Atualizar(filtroUsuario);
        }

        [HttpDelete("{codFiltroUsuario}")]
        public void Delete(int codFiltroUsuario)
        {
            _filtroService.Deletar(codFiltroUsuario);
        }
    }
}
