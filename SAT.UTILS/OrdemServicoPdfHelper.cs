using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SAT.MODELS.Entities;
namespace SAT.UTILS
{
    public class OrdemServicoPdfHelper : IDocument
    {

        public OrdemServico OrdemServico { get; }

        public OrdemServicoPdfHelper(OrdemServico ordemServico)
        {
            OrdemServico = ordemServico;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        static IContainer CellStyle(IContainer container)
        {
            return container.BorderColor(Colors.Grey.Lighten2).PaddingVertical(3);
        }

        static IContainer TitleStyle(IContainer container)
        {
            return container.PaddingVertical(5);
        }

        static TextStyle FontStyle()
        {
            return TextStyle.Default.FontSize(8).LineHeight(0.8f);
        }

        public void Compose(IDocumentContainer container)
        {
            container
                .Page(page =>
                {
                    page.MarginVertical(15);
                    page.MarginHorizontal(30);

                    page.Header().Element(ComposeHeader);
                    page.Content().Element(ComposeContent);
                    page.Footer().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem().AlignRight().Text(x =>
                        {
                            x.CurrentPageNumber().FontSize(8);
                            x.Span(" / ").FontSize(8);
                            x.TotalPages().FontSize(8);
                        });
                    });
                });
        }

        void ComposeHeader(IContainer container)
        {
            container.PaddingBottom(5).Row(row =>
            {
                row.ConstantItem(280).Column(column =>
                {

                    column.Item().Row(async cr =>
                    {
                        cr.Spacing(20);

                        using (HttpClient webClient = new HttpClient())
                        {
                            byte[] dataArr = await webClient.GetAsync("https://sat.perto.com.br/sat.v2.frontend/assets/images/logo/logo.png").Result.Content.ReadAsByteArrayAsync();

                            cr.ConstantItem(60).AlignMiddle().Image(dataArr, ImageScaling.FitArea);
                        } 
                        cr.RelativeItem().Column(t =>
                        {
                            t.Item().Text($"Perto S.A").SemiBold().FontSize(8);
                            t.Item().Text($"Tecnologia para Bancos e Varejo").FontSize(8);
                            t.Item().Text($"Rua Nissin Castiel, 640 Distrito Industrial").FontSize(8);
                            t.Item().Text($"CEP: 94045-420 | Gravataí | RS | Brasil").FontSize(8);
                            t.Item().Text($"(51) 3489-8700 - www.perto.com.br").FontSize(8);
                        });
                    });
                });

                row.RelativeItem().Column(column =>
                {
                    column.Item().AlignCenter().AlignMiddle().Text(tx =>
                     { 
                        tx.Span("OS  ").Style(TextStyle.Default.FontColor(Colors.Grey.Medium).FontSize(20));
                        tx.Span($"{OrdemServico.CodOS}").Style(TextStyle.Default.FontSize(24));
                     });
                });
            });
        }

        void ComposeContent(IContainer container)
        {
            container.Border(1).BorderColor(Colors.Grey.Lighten1).Padding(10).Column(column =>
            {
                column.Spacing(1);

                column.Item().Element(ComporDadosOs);
                column.Item().Element(ComporRelatorios);
                column.Item().PageBreak();
                if (true)
                {
                    var laudo = new LaudoPdfHelper(OrdemServico);
                    column.Item().AlignCenter().Text($"RELATÓRIO DE AVALIAÇÃO TÉCNICA - DETECÇÃO ANALÍTICA DE FALHAS").Bold();
                    column.Item().Element(laudo.ComporSituacao);
                    column.Item().Element(laudo.ComporChecagemVisual);
                    column.Item().Element(laudo.ComporInfraEstruturaSite);
                    column.Item().Element(laudo.ComporConclusao);
                    column.Item().Element(laudo.ComporAssinatura);
                }
            });
        }

        void ComporDadosOs(IContainer container)
        {
            container.Padding(10).Grid(grid =>
            {
                grid.VerticalSpacing(5);
                grid.HorizontalSpacing(15);
                grid.AlignCenter();

                grid.Item(4).Text(t =>
                {
                    t.Span($"Intervenção: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.TipoIntervencao.NomTipoIntervencao}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Abertura: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.DataHoraAberturaOS}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Solicitado em: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.DataHoraSolicitacao}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"OS Cliente: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.NumOSCliente}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"OS 4º: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.NumOSQuarteirizada}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Status: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.StatusServico?.NomeStatusServico}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Cliente: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.Cliente.NumBanco} - {OrdemServico.Cliente.NomeFantasia}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Agência: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.LocalAtendimento?.NumAgencia}/{OrdemServico.LocalAtendimento?.DCPosto}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Endereço: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.LocalAtendimento?.Endereco}").FontSize(8);
                });

                grid.Item(6).Text(t =>
                {
                    t.Span($"Bairro: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.LocalAtendimento?.Bairro?? ""}").FontSize(8);
                });

                grid.Item(6).Text(t =>
                {
                    t.Span($"Cidade: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.LocalAtendimento?.Cidade.NomeCidade?? ""}").FontSize(8);
                });

                
                grid.Item(4).Text(t =>
                {
                    t.Span($"Solicitante: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.NomeSolicitante}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Contato: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.NomeContato}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Telefone: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.LocalAtendimento?.Telefone1_DEL} \n                  {OrdemServico.LocalAtendimento?.Telefone2_DEL}").FontSize(8);
                });
                
                grid.Item(4).Text(t =>
                {
                    t.Span($"Equipamento: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.EquipamentoContrato?.Equipamento.NomeEquip}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Série: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.EquipamentoContrato?.NumSerie}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"SLA: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.EquipamentoContrato?.AcordoNivelServico.NomeSLA}").FontSize(8);
                });

                grid.Item(12).Text(t =>
                {
                    t.Span($"Defeito: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.DefeitoRelatado}").FontSize(8);
                });

                grid.Item(12).Text(t =>
                {
                    t.Span($"Obs OS: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.ObservacaoCliente}").FontSize(8);
                });

               grid.Item(4).Text(t =>
                {
                    t.Span($"FILIAL: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.EquipamentoContrato?.Filial.NomeFilial}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"PAT: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.EquipamentoContrato?.Autorizada.NomeFantasia}").FontSize(8);
                });

                grid.Item(4).Text(t =>
                {
                    t.Span($"Região: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.EquipamentoContrato?.Regiao.NomeRegiao}").FontSize(8);
                });

                grid.Item(12).Text(t =>
                {
                    t.Span($"Data/Hora Fim SLA: ").FontSize(8).Bold();
                    t.Span($"{OrdemServico.PrazosAtendimento.LastOrDefault()?.DataHoraLimiteAtendimento.ToString() ?? ""}").FontSize(8);
                });
            });
        }

        void ComporRelatorios(IContainer container)
        {
            container.BorderTop(1).BorderColor(Colors.Grey.Lighten1).Padding(10).Grid(grid =>
            {
                int index = 1;
                OrdemServico.RelatoriosAtendimento.ForEach((rel) =>
                {
                    grid.VerticalSpacing(5);
                    grid.HorizontalSpacing(10);
                    grid.AlignCenter();

                    grid.Item(12).AlignLeft().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Text($"Atendimento #{index}").Bold();
                    index++;

                    grid.Item(6).Text(t =>
                    {
                        t.Span($"Técnico: ").FontSize(8).Bold();
                        t.Span($"{rel.Tecnico.Nome}").FontSize(8);
                    });

                    grid.Item(6).Text(t =>
                    {
                        t.Span($"Status: ").FontSize(8).Bold();
                        t.Span($"{rel.StatusServico.NomeStatusServico}").FontSize(8);
                    });

                    grid.Item(6).Text(t =>
                    {
                        t.Span($"Nº: ").FontSize(8).Bold();
                        t.Span($"{rel.NumRAT}").FontSize(8);
                    });

                    grid.Item(6).Text(t =>
                    {
                        t.Span($"Acompanhante: ").FontSize(8).Bold();
                        t.Span($"{rel.NomeAcompanhante}").FontSize(8);
                    });

                    var detalhe = rel.RelatorioAtendimentoDetalhes.FirstOrDefault();

                    if (detalhe != null) {
                        grid.Item(12).Text( tx =>
                        {
                            tx.Span($"Tipo Serviço: {detalhe.TipoServico.NomeServico}").FontSize(8).Bold();
                            var tipoServico = detalhe.TipoServico.CodETipoServico.StartsWith("1") ? "MÁQUINA" : "EXTRA-MÁQUINA";
                            tx.Span($"  ({tipoServico})").FontSize(8);
                        });
                    }

                    
                    grid.Item(4).Text(t =>
                    {
                        t.Span($"Início: ").FontSize(8).Bold();
                        t.Span($"{rel.DataHoraInicio}").FontSize(8);
                    });

                    grid.Item(4).Text(t =>
                    {
                        t.Span($"Término: ").FontSize(8).Bold();
                        t.Span($"{rel.DataHoraSolucao}").FontSize(8);
                    });

                    grid.Item(4).Text(t =>
                    {
                        t.Span($"Horas gastas: ").FontSize(8).Bold();
                        t.Span($"{rel.DataHoraSolucao.Subtract(rel.DataHoraInicio).Hours.ToString("00")}:{rel.DataHoraSolucao.Subtract(rel.DataHoraInicio).Minutes.ToString("00")}").FontSize(8);
                    });

                    grid.Item(12).Text(t =>
                    {
                        t.Span($"Desc. Solução: ").FontSize(8).Bold();
                        t.Span($"{rel.RelatoSolucao}").FontSize(8);
                    });

                    grid.Item(12).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Element(TitleStyle).Text("PEÇAS").FontSize(10).Bold();
                        });

                        if (rel.RelatorioAtendimentoDetalhes.SelectMany(del => del.RelatorioAtendimentoDetalhePecas).Any())
                        {
                            table.Cell().Table(t2 =>
                            {
                                t2.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.ConstantColumn(80);
                                });
                                t2.Header(h2 =>
                                {
                                    h2.Cell().Element(CellStyle).Text("Causa").Style(FontStyle()).Bold();
                                    h2.Cell().Element(CellStyle).Text("Defeito").Style(FontStyle()).Bold();
                                    h2.Cell().Element(CellStyle).Text("Ação").Style(FontStyle()).Bold();
                                    h2.Cell().Element(CellStyle).Text("Peças").Style(FontStyle()).Bold();
                                });

                                rel.RelatorioAtendimentoDetalhes.ForEach(det =>
                                {
                                    t2.Cell().Element(CellStyle).Text($"{det.Causa.CodECausa} - {det.Causa.NomeCausa}").Style(FontStyle());
                                    t2.Cell().Element(CellStyle).Text($"{det.Defeito.CodEDefeito} - {det.Defeito.NomeDefeito}").Style(FontStyle());
                                    t2.Cell().Element(CellStyle).Text($"{det.Acao.CodEAcao} - {det.Acao.NomeAcao}").Style(FontStyle());
                                    t2.Cell().Element(CellStyle).Text(txt => 
                                    {  
                                        det.RelatorioAtendimentoDetalhePecas.ForEach(peca =>
                                        {
                                            txt.Span($"{peca.Peca?.CodMagnus} P({peca.QtdePecas})").Style(FontStyle());
                                        });
                                    });
                                });
                            });
                        }
                        else
                        {
                            table.Cell().Text("Nenhuma peça utilizada");
                        }
                    });
                });
            });
        }

    }
}