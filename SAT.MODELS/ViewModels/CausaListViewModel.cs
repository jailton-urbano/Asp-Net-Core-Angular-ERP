﻿using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System.Collections.Generic;

namespace SAT.MODELS.ViewModels
{
    public class CausaListViewModel : Meta
    {
        public IEnumerable<Causa> Causas { get; set; }
    }
}
