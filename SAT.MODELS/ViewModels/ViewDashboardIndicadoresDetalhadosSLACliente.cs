namespace SAT.MODELS.ViewModels
{
    public class ViewDashboardIndicadoresDetalhadosSLACliente
    {
        public int CodFilial { get; set; }
        public string Filial { get; set; }
        public string NomeFantasia { get; set; }
        public int Dentro { get; set; }
        public int Fora { get; set; }
        public int TotalGeral { get; set; }
        public decimal Percentual { get; set; }
    }
}
