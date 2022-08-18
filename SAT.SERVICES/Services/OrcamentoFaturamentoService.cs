using System;
using System.Collections.Generic;
using System.Linq;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Enums;
using SAT.MODELS.Helpers;
using SAT.MODELS.ViewModels;
using SAT.SERVICES.Interfaces;

namespace SAT.SERVICES.Services
{
    public class OrcamentoFaturamentoService : IOrcamentoFaturamentoService
    {
        private readonly IOrcamentoFaturamentoRepository _orcamentoFaturamentoRepo;
        private readonly IOrcamentoRepository _orcamentoRepo;

        public OrcamentoFaturamentoService(
            IOrcamentoFaturamentoRepository orcamentoFaturamentoRepo,
            IOrcamentoRepository orcamentoRepo
            )
        {
            _orcamentoFaturamentoRepo = orcamentoFaturamentoRepo;
            _orcamentoRepo = orcamentoRepo;
        }

        public ListViewModel ObterPorParametros(OrcamentoFaturamentoParameters parameters)
        {
            try
            {
                List<OrcamentoFaturamentoViewModel> faturamentos = new();
                var orcamentos = _orcamentoRepo.ObterPorParametros(new OrcamentoParameters
                {
                    PageNumber = parameters.PageNumber,
                    PageSize = parameters.PageSize,
                    SortActive = parameters.SortActive,
                    SortDirection = parameters.SortDirection,
                    Filter = parameters.Filter
                });

                foreach (var orc in orcamentos)
                {
                    foreach (var material in orc?.Materiais)
                    {
                        if (material.Peca == null) continue;

                        var faturamentoMaterial = _orcamentoFaturamentoRepo.ObterPorParametros(new OrcamentoFaturamentoParameters
                        {
                            CodOrc = orc.CodOrc,
                            DescricaoNotaFiscal = $"{material?.Peca?.CodMagnus} - {material?.Peca?.NomePeca}"
                        })?.FirstOrDefault();

                        if(faturamentoMaterial != null)
                        {
                            faturamentos.Add(new OrcamentoFaturamentoViewModel
                            {
                                Codigo = material.CodOrcMaterial,
                                Cliente = orc?.Cliente?.NomeFantasia,
                                Filial = orc.OrdemServico?.Filial?.NomeFilial,
                                CodOS = orc.CodigoOrdemServico,
                                NumOSCliente = orc.OrdemServico?.NumOSCliente,
                                NumOrcamento = orc.Numero,
                                CodOrc = orc.CodOrc,
                                Tipo = OrcamentoFaturamentoTipoEnum.MATERIAL,
                                NumNF = faturamentoMaterial?.NumNF,
                                DataEmissao = faturamentoMaterial?.DataEmissaoNF,
                                DescNF = faturamentoMaterial?.DescricaoNotaFiscal,
                                IndFaturado = (double)faturamentoMaterial?.IndFaturado
                            });
                        }
                        else
                        {
                            faturamentos.Add(new OrcamentoFaturamentoViewModel
                            {
                                Codigo = material.CodOrcMaterial,
                                Cliente = orc?.Cliente?.NomeFantasia,
                                Filial = orc.OrdemServico?.Filial?.NomeFilial,
                                CodOS = orc.CodigoOrdemServico,
                                NumOSCliente = orc.OrdemServico?.NumOSCliente,
                                NumOrcamento = orc.Numero,
                                CodOrc = orc.CodOrc,
                                Tipo = OrcamentoFaturamentoTipoEnum.MATERIAL
                            });                            
                        }

                    }

                    foreach (var servico in orc?.OutrosServicos)
                    {
                        faturamentos.Add(new OrcamentoFaturamentoViewModel
                        {
                            Codigo = servico.CodOrcOutroServico,
                            Cliente = orc?.Cliente?.NomeFantasia,
                            Filial = orc?.OrdemServico?.Filial?.NomeFilial,
                            CodOS = orc.CodigoOrdemServico,
                            NumOSCliente = orc.OrdemServico?.NumOSCliente,
                            NumOrcamento = orc.Numero,
                            CodOrc = orc.CodOrc,
                            Tipo = OrcamentoFaturamentoTipoEnum.SERVICO
                        });
                    }

                    faturamentos.Add(new OrcamentoFaturamentoViewModel
                    {
                        Codigo = orc?.MaoDeObra?.CodOrcMaoObra,
                        Cliente = orc?.Cliente?.NomeFantasia,
                        Filial = orc.OrdemServico?.Filial?.NomeFilial,
                        CodOS = orc.CodigoOrdemServico,
                        NumOSCliente = orc?.OrdemServico?.NumOSCliente,
                        NumOrcamento = orc.Numero,
                        CodOrc = orc.CodOrc,
                        Tipo = OrcamentoFaturamentoTipoEnum.SERVICO
                    });
                }

                var faturamentosLista = PagedList<OrcamentoFaturamentoViewModel>.ToPagedList(faturamentos, 1, 100000);

                var lista = new ListViewModel
                {
                    Items = faturamentosLista,
                    TotalCount = orcamentos.TotalCount,
                    CurrentPage = orcamentos.CurrentPage,
                    PageSize = orcamentos.PageSize,
                    TotalPages = orcamentos.TotalPages,
                    HasNext = orcamentos.HasNext,
                    HasPrevious = orcamentos.HasPrevious
                };

                return lista;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ocorreu um erro ao consultar faturamentos: {ex.Message} {ex.StackTrace}");
            }
        }

        public OrcamentoFaturamento Criar(OrcamentoFaturamento orcamento)
        {
            _orcamentoFaturamentoRepo.Criar(orcamento);
            return orcamento;
        }

        public void Deletar(int codigo)
        {
            _orcamentoFaturamentoRepo.Deletar(codigo);
        }

        public OrcamentoFaturamento Atualizar(OrcamentoFaturamento orcamento)
        {
            _orcamentoFaturamentoRepo.Atualizar(orcamento);
            return orcamento;
        }

        public OrcamentoFaturamento ObterPorCodigo(int codigo)
        {
            return _orcamentoFaturamentoRepo.ObterPorCodigo(codigo);
        }
    }
}
