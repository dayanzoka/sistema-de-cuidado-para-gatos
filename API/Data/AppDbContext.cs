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
          
            modelBuilder.Entity<Agendamento>()
                .HasOne(a => a.Usuario)
                .WithMany(u => u.Agendamentos)
                .HasForeignKey(a => a.UsuarioId);

            modelBuilder.Entity<Agendamento>()
                .HasOne(a => a.Servico)
                .WithMany(s => s.Agendamentos)
                .HasForeignKey(a => a.ServicoId);

            modelBuilder.Entity<Avaliacao>()
                .HasOne(av => av.Usuario)
                .WithMany(u => u.Avaliacoes)
                .HasForeignKey(av => av.UsuarioId);

            modelBuilder.Entity<Avaliacao>()
                .HasOne(av => av.Servico)
                .WithMany(s => s.Avaliacoes)
                .HasForeignKey(av => av.ServicoId);
        }
    }
}
