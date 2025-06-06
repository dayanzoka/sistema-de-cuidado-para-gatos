namespace ServicosParaGatos.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public required string Nome { get; set; } 
        public required string Email { get; set; } 
        public required string Senha { get; set; } 
    }
}