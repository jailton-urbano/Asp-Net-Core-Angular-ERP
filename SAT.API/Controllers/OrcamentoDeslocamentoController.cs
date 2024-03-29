﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SAT.MODELS.Entities;
using SAT.SERVICES.Interfaces;

namespace SAT.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [EnableCors("CorsApi")]
    [ApiController]
    public class OrcamentoDeslocamentoController : ControllerBase
    {
        private IOrcamentoDeslocamentoService _orcDeslocamentoService;
        public OrcamentoDeslocamentoController(IOrcamentoDeslocamentoService orcDeslocamentoService)
        {
            _orcDeslocamentoService = orcDeslocamentoService;
        }

        [HttpPost]
        public OrcamentoDeslocamento Post([FromBody] OrcamentoDeslocamento deslocamento) =>
            _orcDeslocamentoService.Criar(deslocamento);

        [HttpPut]
        public OrcamentoDeslocamento Put([FromBody] OrcamentoDeslocamento deslocamento) =>
            _orcDeslocamentoService.Atualizar(deslocamento);
    }
}