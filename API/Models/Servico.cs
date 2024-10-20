namespace ServicosParaGatos.Models
{
    public class Servico
    {
        public int Id { get; set; }
        public string NomeServico { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string Localizacao { get; set; } = string.Empty;
        public List<Agendamento> Agendamentos { get; set; } = new();
        public List<Avaliacao> Avaliacoes { get; set; } = new();
    }
}
