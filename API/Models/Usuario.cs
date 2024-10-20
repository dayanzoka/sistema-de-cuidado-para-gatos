namespace ServicosParaGatos.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public List<Agendamento> Agendamentos { get; set; } = new();
        public List<Avaliacao> Avaliacoes { get; set; } = new();
    }
}
