namespace ServicosParaGatos.Models
{
    public class Avaliacao
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } 
        public int ServicoId { get; set; }
        public Servico Servico { get; set; } 
        public string Comentario { get; set; } 
        public int Nota { get; set; }
    }
}
