﻿using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SAT.MODELS.Entities;
using SAT.SERVICES.Interfaces;
using System.Collections.Generic;

namespace SAT.API.Controllers
{
    //[Authorize]
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
        public List<AgendaTecnico> Get([FromQuery] AgendaTecnicoParameters parameters)
        {
            return _agendaServ.ObterAgendaPorParametros(parameters);
        }

        [HttpPut("{codAgendaTecnico}")]
        public void Put(int id, [FromBody] AgendaTecnico agenda)
        {
            _agendaServ.AtualizarAgenda(agenda);
        }

        [HttpDelete("{codAgendaTecnico}")]
        public void Delete(int codAgendaTecnico)
        {
            _agendaServ.DeletarAgenda(codAgendaTecnico);
        }

         
        [HttpPost("Evento")]
        public AgendaTecnicoEvento CriarEvento([FromBody] AgendaTecnicoEvento evento)
        {
           return _agendaServ.CriarEvento(evento);
        }

        [HttpPut("Evento")]
        public void AtualizarEvento([FromBody] AgendaTecnicoEvento evento)
        {
            _agendaServ.AtualizarEvento(evento);
        }

        [HttpDelete("Evento/{codAgendaTecnicoEvento}")]
        public void DeletarEvento([FromBody] int codAgendaTecnicoEvento)
        {
            _agendaServ.DeletarEvento(codAgendaTecnicoEvento);
        }
    }
}