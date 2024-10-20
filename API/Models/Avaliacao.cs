namespace ServicosParaGatos.Models
{
    public class Avaliacao
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public int ServicoId { get; set; }
        public Servico Servico { get; set; } = null!;
        public string Comentario { get; set; } = string.Empty;
        public int Nota { get; set; }
    }
}
