﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Enums;
using SAT.SERVICES.Interfaces;

namespace SAT.API.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
    [EnableCors("CorsApi")]
    [ApiController]
    public class ExportacaoController : ControllerBase
    {
        private IExportacaoService _exService;
        public ExportacaoController(IExportacaoService exService)
        {
			_exService = exService;
        }
		
        [HttpGet("OrdemServico")]
        public IActionResult ExportarOrdemServico([FromQuery] OrdemServicoParameters parameters)
        {
			return _exService.Exportar(parameters, ExportacaoFormatoEnum.EXCEL, ExportacaoTipoEnum.ORDEM_SERVICO);
        }

        [HttpGet("EquipamentoContrato")]
        public IActionResult ExportarEquipamentoContrato([FromQuery] EquipamentoContratoParameters parameters)
        {
			return _exService.Exportar(parameters, ExportacaoFormatoEnum.EXCEL, ExportacaoTipoEnum.EQUIPAMENTO_CONTRATO);
        }

        [HttpGet("Acao")]
        public IActionResult ExportarAcao([FromQuery] AcaoParameters parameters)
        {
			return _exService.Exportar(parameters, ExportacaoFormatoEnum.EXCEL, ExportacaoTipoEnum.ACAO);
        }

        [HttpGet("AcaoCausa")]
        public IActionResult ExportarAcaoCausa([FromQuery] AcaoComponenteParameters parameters)
        {
			return _exService.Exportar(parameters, ExportacaoFormatoEnum.EXCEL, ExportacaoTipoEnum.ACAO_COMPONENTE);
        }

        [HttpGet("Autorizada")]
        public IActionResult ExportarAutorizada([FromQuery] AutorizadaParameters parameters)
        {
			return _exService.Exportar(parameters, ExportacaoFormatoEnum.EXCEL, ExportacaoTipoEnum.AUTORIZADA);
        }

        [HttpGet("Cidade")]
        public IActionResult ExportarCidade([FromQuery] CidadeParameters parameters)
        {
			return _exService.Exportar(parameters, ExportacaoFormatoEnum.EXCEL, ExportacaoTipoEnum.CIDADE);
        }        

        [HttpGet("Cliente")]
        public IActionResult ExportarCliente([FromQuery] ClienteParameters parameters)
        {
			return _exService.Exportar(parameters, ExportacaoFormatoEnum.EXCEL, ExportacaoTipoEnum.CLIENTE);
        }        

        [HttpGet("Tecnico")]
        public IActionResult ExportarTecnico([FromQuery] TecnicoParameters parameters)
        {
			return _exService.Exportar(parameters, ExportacaoFormatoEnum.EXCEL, ExportacaoTipoEnum.TECNICO);
        }        
    }
}
