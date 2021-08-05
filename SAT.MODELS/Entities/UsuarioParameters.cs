﻿using SAT.MODELS.Entities.Helpers;

namespace SAT.MODELS.Entities
{
    public class UsuarioParameters : QueryStringParameters
    {
        public string CodUsuario { get; set; }
        public int? CodFilial { get; set; }
        public int? CodPerfil { get; set; }
        public int? IndAtivo { get; set; }
    }
}