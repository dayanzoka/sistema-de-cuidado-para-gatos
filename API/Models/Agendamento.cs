namespace ServicosParaGatos.Models
{
    public class Agendamento
    {
        public int Id { get; set; }
        public DateTime DataHora { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public int ServicoId { get; set; }
        public Servico Servico { get; set; } = null!;
    }
}
