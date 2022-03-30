﻿using System.Collections.Generic;
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
    [Route("api/[controller]")]
    [EnableCors("CorsApi")]
    [ApiController]
    public class AgendaTecnicoController : ControllerBase
    {
        private readonly IAgendaTecnicoService _agendaServ;

        public AgendaTecnicoController(IAgendaTecnicoService agendaServ)
        {
            _agendaServ = agendaServ;
        }

        [HttpGet]
        public List<ViewAgendaTecnicoRecurso> Get([FromQuery] AgendaTecnicoParameters parameters)
        {
            return _agendaServ.ObterPorParametros(parameters);
        }

        [HttpPost]
        public AgendaTecnico Post([FromBody] AgendaTecnico agenda)
        {
            _agendaServ.Criar(agenda);
            
            return agenda;
        }

        [HttpGet("codAgendaTecnico")]
        public void DeletarAgendaTecnico(int codAgendaTecnico)
        {
            _agendaServ.Deletar(codAgendaTecnico);
        }

        [HttpPut]
        public AgendaTecnico Put([FromBody] AgendaTecnico evento)
        {
            return _agendaServ.Atualizar(evento);
        }

        [HttpDelete("{codAgendaTecnico}")]
        public void Delete(int codAgendaTecnico)
        {
            _agendaServ.Deletar(codAgendaTecnico);
        }
    }
}