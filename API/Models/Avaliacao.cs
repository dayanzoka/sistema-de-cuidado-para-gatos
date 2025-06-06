namespace ServicosParaGatos.Models
{
    public class Avaliacao
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }
        public int ServicoId { get; set; }

        public Usuario? Usuario { get; set; } // Tornada anulável
        public Servico? Servico { get; set; } // Tornada anulável

        public required string Comentario { get; set; } // Adicionado 'required' (presumindo que sempre haverá um comentário)
        public required int Nota { get; set; } // Adicionado 'required'
    }
}