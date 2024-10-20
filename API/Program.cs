using Microsoft.EntityFrameworkCore;
using ServicosParaGatos.Data;
using ServicosParaGatos.Models;

var builder = WebApplication.CreateBuilder(args);

// banco de dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

//  usuários
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
    return Results.Ok(usuario); 
});

// serviços
app.MapGet("/servicos/listars", async (AppDbContext db) => await db.Servicos.ToListAsync());

app.MapPost("/servicos/cadastrars", async (Servico servico, AppDbContext db) =>
{
    db.Servicos.Add(servico);
    await db.SaveChangesAsync();
    return Results.Created($"/servicos/{servico.Id}", servico);
});

app.MapPut("/servicos/atualizars/{id}", async (int id, Servico updatedServico, AppDbContext db) =>
{
    var servico = await db.Servicos.FindAsync(id);
    if (servico == null) return Results.NotFound();

    servico.NomeServico = updatedServico.NomeServico;
    servico.Descricao = updatedServico.Descricao;
    servico.Localizacao = updatedServico.Localizacao;

    await db.SaveChangesAsync();
    return Results.Ok(servico); 
});

app.MapDelete("/servicos/deletars/{id}", async (int id, AppDbContext db) =>
{
    var servico = await db.Servicos.FindAsync(id);
    if (servico == null) return Results.NotFound();

    db.Servicos.Remove(servico);
    await db.SaveChangesAsync();
    return Results.Ok(servico); 
});

// agendamentos
app.MapGet("/agendamentos/listara", async (AppDbContext db) => await db.Agendamentos.ToListAsync());

app.MapPost("/agendamentos/cadastrara", async (Agendamento agendamento, AppDbContext db) =>
{
    db.Agendamentos.Add(agendamento);
    await db.SaveChangesAsync();
    return Results.Created($"/agendamentos/{agendamento.Id}", agendamento);
});

app.MapPut("/agendamentos/atualizara/{id}", async (int id, Agendamento updatedAgendamento, AppDbContext db) =>
{
    var agendamento = await db.Agendamentos.FindAsync(id);
    if (agendamento == null) return Results.NotFound();

    agendamento.UsuarioId = updatedAgendamento.UsuarioId;
    agendamento.ServicoId = updatedAgendamento.ServicoId;
    agendamento.DataHora = updatedAgendamento.DataHora;

    await db.SaveChangesAsync();
    return Results.Ok(agendamento); 
});

app.MapDelete("/agendamentos/deletara/{id}", async (int id, AppDbContext db) =>
{
    var agendamento = await db.Agendamentos.FindAsync(id);
    if (agendamento == null) return Results.NotFound();

    db.Agendamentos.Remove(agendamento);
    await db.SaveChangesAsync();
    return Results.Ok(agendamento); 
});

// avaliações
app.MapGet("/avaliacoes/listarv", async (AppDbContext db) => await db.Avaliacoes.ToListAsync());

app.MapPost("/avaliacoes/cadastrarv", async (Avaliacao avaliacao, AppDbContext db) =>
{
    db.Avaliacoes.Add(avaliacao);
    await db.SaveChangesAsync();
    return Results.Created($"/avaliacoes/{avaliacao.Id}", avaliacao);
});

app.MapPut("/avaliacoes/atualizarv/{id}", async (int id, Avaliacao updatedAvaliacao, AppDbContext db) =>
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

app.MapDelete("/avaliacoes/deletarv/{id}", async (int id, AppDbContext db) =>
{
    var avaliacao = await db.Avaliacoes.FindAsync(id);
    if (avaliacao == null) return Results.NotFound();

    db.Avaliacoes.Remove(avaliacao);
    await db.SaveChangesAsync();
    return Results.Ok(avaliacao); 
});

app.Run();
