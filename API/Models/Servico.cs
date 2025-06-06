namespace ServicosParaGatos.Models
{
    public class Servico
    {
        public int Id { get; set; }
        public required string NomeServico { get; set; } 
        public required string Descricao { get; set; } 
        public required string Localizacao { get; set; } 
    }
}