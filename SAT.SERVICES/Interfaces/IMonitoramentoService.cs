﻿using SAT.MODELS.Entities;
using System.Collections.Generic;

namespace SAT.SERVICES.Interfaces
{
    public interface IMonitoramentoService
    {
        MonitoramentoCliente[] ObterPorParametros(MonitoramentoClienteParameters parameters);
    }
}