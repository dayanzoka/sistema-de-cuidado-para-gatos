using System;

namespace ServicosParaGatos.Models
{
    public class Agendamento
    {
        public int Id { get; set; }
        public required DateTime DataHora { get; set; } 

        // Chaves Estrangeiras
        public int UsuarioId { get; set; }
        public int ServicoId { get; set; }

        // Propriedades de Navegação (podem ser nulas se não carregadas via Include)
        public Usuario? Usuario { get; set; } // Tornada anulável
        public Servico? Servico { get; set; } // Tornada anulável
    }
}
