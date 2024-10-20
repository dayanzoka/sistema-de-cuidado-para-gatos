using Microsoft.EntityFrameworkCore;
using ServicosParaGatos.Data;
using ServicosParaGatos.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuração do contexto do banco de dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Mapeando os endpoints para usuários
app.MapGet("/usuarios", async (AppDbContext db) => await db.Usuarios.ToListAsync());

app.MapPost("/usuarios", async (Usuario usuario, AppDbContext db) =>
{
    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();
    return Results.Created($"/usuarios/{usuario.Id}", usuario);
});

app.MapPut("/usuarios/{id}", async (int id, Usuario updatedUsuario, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario == null) return Results.NotFound();

    usuario.Nome = updatedUsuario.Nome;
    usuario.Email = updatedUsuario.Email;
    usuario.Senha = updatedUsuario.Senha; 

    await db.SaveChangesAsync();
    return Results.Ok(usuario); 
});

app.MapDelete("/usuarios/{id}", async (int id, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario == null) return Results.NotFound();

    db.Usuarios.Remove(usuario);
    await db.SaveChangesAsync();
    return Results.Ok(usuario); 
});

// Mapeando os endpoints para serviços
app.MapGet("/servicos", async (AppDbContext db) => await db.Servicos.ToListAsync());

app.MapPost("/servicos", async (Servico servico, AppDbContext db) =>
{
    db.Servicos.Add(servico);
    await db.SaveChangesAsync();
    return Results.Created($"/servicos/{servico.Id}", servico);
});

app.MapPut("/servicos/{id}", async (int id, Servico updatedServico, AppDbContext db) =>
{
    var servico = await db.Servicos.FindAsync(id);
    if (servico == null) return Results.NotFound();

    servico.NomeServico = updatedServico.NomeServico;
    servico.Descricao = updatedServico.Descricao;
    servico.Localizacao = updatedServico.Localizacao;

    await db.SaveChangesAsync();
    return Results.Ok(servico); // Retorna o serviço atualizado
});

app.MapDelete("/servicos/{id}", async (int id, AppDbContext db) =>
{
    var servico = await db.Servicos.FindAsync(id);
    if (servico == null) return Results.NotFound();

    db.Servicos.Remove(servico);
    await db.SaveChangesAsync();
    return Results.Ok(servico); // Retorna o serviço excluído
});

// Mapeando os endpoints para agendamentos
app.MapGet("/agendamentos", async (AppDbContext db) => await db.Agendamentos.ToListAsync());

app.MapPost("/agendamentos", async (Agendamento agendamento, AppDbContext db) =>
{
    db.Agendamentos.Add(agendamento);
    await db.SaveChangesAsync();
    return Results.Created($"/agendamentos/{agendamento.Id}", agendamento);
});

app.MapPut("/agendamentos/{id}", async (int id, Agendamento updatedAgendamento, AppDbContext db) =>
{
    var agendamento = await db.Agendamentos.FindAsync(id);
    if (agendamento == null) return Results.NotFound();

    agendamento.UsuarioId = updatedAgendamento.UsuarioId;
    agendamento.ServicoId = updatedAgendamento.ServicoId;
    agendamento.DataHora = updatedAgendamento.DataHora;

    await db.SaveChangesAsync();
    return Results.Ok(agendamento); // Retorna o agendamento atualizado
});

app.MapDelete("/agendamentos/{id}", async (int id, AppDbContext db) =>
{
    var agendamento = await db.Agendamentos.FindAsync(id);
    if (agendamento == null) return Results.NotFound();

    db.Agendamentos.Remove(agendamento);
    await db.SaveChangesAsync();
    return Results.Ok(agendamento); // Retorna o agendamento excluído
});

// Mapeando os endpoints para avaliações
app.MapGet("/avaliacoes", async (AppDbContext db) => await db.Avaliacoes.ToListAsync());

app.MapPost("/avaliacoes", async (Avaliacao avaliacao, AppDbContext db) =>
{
    db.Avaliacoes.Add(avaliacao);
    await db.SaveChangesAsync();
    return Results.Created($"/avaliacoes/{avaliacao.Id}", avaliacao);
});

app.MapPut("/avaliacoes/{id}", async (int id, Avaliacao updatedAvaliacao, AppDbContext db) =>
{
    var avaliacao = await db.Avaliacoes.FindAsync(id);
    if (avaliacao == null) return Results.NotFound();

    avaliacao.UsuarioId = updatedAvaliacao.UsuarioId;
    avaliacao.ServicoId = updatedAvaliacao.ServicoId;
    avaliacao.Comentario = updatedAvaliacao.Comentario;
    avaliacao.Nota = updatedAvaliacao.Nota;

    await db.SaveChangesAsync();
    return Results.Ok(avaliacao); // Retorna a avaliação atualizada
});

app.MapDelete("/avaliacoes/{id}", async (int id, AppDbContext db) =>
{
    var avaliacao = await db.Avaliacoes.FindAsync(id);
    if (avaliacao == null) return Results.NotFound();

    db.Avaliacoes.Remove(avaliacao);
    await db.SaveChangesAsync();
    return Results.Ok(avaliacao); // Retorna a avaliação excluída
});

// Iniciar a aplicação
app.Run();
