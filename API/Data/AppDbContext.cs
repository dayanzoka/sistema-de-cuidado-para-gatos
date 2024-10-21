using Microsoft.EntityFrameworkCore;
using ServicosParaGatos.Models;

namespace ServicosParaGatos.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Servico> Servicos { get; set; } = null!;
        public DbSet<Agendamento> Agendamentos { get; set; } = null!;
        public DbSet<Avaliacao> Avaliacoes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
