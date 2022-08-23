﻿using System;

namespace SAT.MODELS.Entities
{
    public class AuditoriaVeiculo
    {
        public int CodAuditoriaVeiculo { get; set; }
        public int CodAuditoriaVeiculoTanque { get; set; }
        public string Placa { get; set; }
        public string Odometro { get; set; }
        public DateTime? DataHoraCad { get; set; }
    }
}