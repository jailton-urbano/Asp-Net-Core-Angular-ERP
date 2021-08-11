﻿using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System.Collections.Generic;

namespace SAT.MODELS.ViewModels
{
    public class AgendamentoListViewModel : Meta
    {
        public IEnumerable<Agendamento> Agendamentos { get; set; }
    }
}