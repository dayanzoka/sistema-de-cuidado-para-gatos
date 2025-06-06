using Microsoft.EntityFrameworkCore;
using ServicosParaGatos.Data;
using ServicosParaGatos.Models;
using Microsoft.Extensions.Logging; 

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

Console.WriteLine($"DEBUG: Connection String lida: {connectionString ?? "NULL ou VAZIA"} (Lida diretamente da variável de ambiente)");


if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Erro: A string de conexão 'ConnectionStrings__DefaultConnection' não foi configurada ou está vazia. Verifique as variáveis de ambiente no Render.com.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ADICIONADO: Bloco para aplicar as migrações no startup da aplicação
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate(); // Aplica todas as migrações pendentes
        Console.WriteLine("Migrações do banco de dados aplicadas com sucesso!");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocorreu um erro ao aplicar as migrações do banco de dados.");
    }
}
// FIM DO BLOCO DE MIGRAÇÕES

// Aplicação do CORS
app.UseCors("AllowAll");

// Mapeamento dos endpoints (seus endpoints permanecem os mesmos)

// Usuários
app.MapGet("/usuarios/listar", async (AppDbContext db) => await db.Usuarios.ToListAsync());

app.MapPost("/usuarios/cadastrar", async (Usuario usuario, AppDbContext db) =>
{
    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();
    return Results.Created($"/usuarios/{usuario.Id}", usuario);
});

app.MapPut("/usuarios/atualizar/{id}", async (int id, Usuario updatedUsuario, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario == null) return Results.NotFound();

    usuario.Nome = updatedUsuario.Nome;
    usuario.Email = updatedUsuario.Email;
    usuario.Senha = updatedUsuario.Senha;

    await db.SaveChangesAsync();
    return Results.Ok(usuario);
});

app.MapDelete("/usuarios/deletar/{id}", async (int id, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario == null) return Results.NotFound();

    db.Usuarios.Remove(usuario);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Serviços
app.MapGet("/servicos/listar", async (AppDbContext db) => await db.Servicos.ToListAsync());

app.MapPost("/servicos/cadastrar", async (Servico servico, AppDbContext db) =>
{
    db.Servicos.Add(servico);
    await db.SaveChangesAsync();
    return Results.Created($"/servicos/{servico.Id}", servico);
});

app.MapPut("/servicos/atualizar/{id}", async (int id, Servico updatedServico, AppDbContext db) =>
{
    var servico = await db.Servicos.FindAsync(id);
    if (servico == null) return Results.NotFound();

    servico.NomeServico = updatedServico.NomeServico;
    servico.Descricao = updatedServico.Descricao;
    servico.Localizacao = updatedServico.Localizacao;

    await db.SaveChangesAsync();
    return Results.Ok(servico);
});

app.MapDelete("/servicos/deletar/{id}", async (int id, AppDbContext db) =>
{
    var servico = await db.Servicos.FindAsync(id);
    if (servico == null) return Results.NotFound();

    db.Servicos.Remove(servico);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Agendamentos
app.MapGet("/agendamentos/listar", async (AppDbContext db) => await db.Agendamentos
    .Include(a => a.Usuario)
    .Include(a => a.Servico)
    .ToListAsync());

app.MapPost("/agendamentos/cadastrar", async (Agendamento agendamento, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(agendamento.UsuarioId);
    if (usuario == null) return Results.NotFound("Usuário não encontrado");

    var servico = await db.Servicos.FindAsync(agendamento.ServicoId);
    if (servico == null) return Results.NotFound("Serviço não encontrado");

    agendamento.Usuario = usuario; // Atribui o objeto completo
    agendamento.Servico = servico; // Atribui o objeto completo

    db.Agendamentos.Add(agendamento);
    await db.SaveChangesAsync();
    return Results.Created($"/agendamentos/{agendamento.Id}", agendamento);
});

app.MapPut("/agendamentos/atualizar/{id}", async (int id, Agendamento updatedAgendamento, AppDbContext db) =>
{
    var agendamento = await db.Agendamentos.FindAsync(id);
    if (agendamento == null) return Results.NotFound();

    var usuario = await db.Usuarios.FindAsync(updatedAgendamento.UsuarioId);
    if (usuario == null) return Results.NotFound("Usuário não encontrado");

    var servico = await db.Servicos.FindAsync(updatedAgendamento.ServicoId);
    if (servico == null) return Results.NotFound("Serviço não encontrado");

    agendamento.DataHora = updatedAgendamento.DataHora;
    agendamento.UsuarioId = updatedAgendamento.UsuarioId;
    agendamento.ServicoId = updatedAgendamento.ServicoId;
    agendamento.Usuario = usuario; // Atualiza o objeto completo
    agendamento.Servico = servico; // Atualiza o objeto completo

    await db.SaveChangesAsync();
    return Results.Ok(agendamento);
});

app.MapDelete("/agendamentos/deletar/{id}", async (int id, AppDbContext db) =>
{
    var agendamento = await db.Agendamentos.FindAsync(id);
    if (agendamento == null) return Results.NotFound();

    db.Agendamentos.Remove(agendamento);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Avaliações
app.MapGet("/avaliacoes/listar", async (AppDbContext db) => await db.Avaliacoes.ToListAsync());

app.MapPost("/avaliacoes/cadastrar", async (Avaliacao avaliacao, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(avaliacao.UsuarioId);
    if (usuario == null) return Results.NotFound("Usuário não encontrado");

    var servico = await db.Servicos.FindAsync(avaliacao.ServicoId);
    if (servico == null) return Results.NotFound("Serviço não encontrado");

    avaliacao.Usuario = usuario;
    avaliacao.Servico = servico;

    db.Avaliacoes.Add(avaliacao);
    await db.SaveChangesAsync();
    return Results.Created($"/avaliacoes/{avaliacao.Id}", avaliacao);
});

app.MapPut("/avaliacoes/atualizar/{id}", async (int id, Avaliacao updatedAvaliacao, AppDbContext db) =>
{
    var avaliacao = await db.Avaliacoes.FindAsync(id);
    if (avaliacao == null) return Results.NotFound();

    avaliacao.UsuarioId = updatedAvaliacao.UsuarioId;
    avaliacao.ServicoId = updatedAvaliacao.ServicoId;
    avaliacao.Comentario = updatedAvaliacao.Comentario;
    avaliacao.Nota = updatedAvaliacao.Nota;

    await db.SaveChangesAsync();
    return Results.Ok(avaliacao);
});

app.MapDelete("/avaliacoes/deletar/{id}", async (int id, AppDbContext db) =>
{
    var avaliacao = await db.Avaliacoes.FindAsync(id);
    if (avaliacao == null) return Results.NotFound();

    db.Avaliacoes.Remove(avaliacao);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();