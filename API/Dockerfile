 # Estágio de Build: Usa uma imagem base oficial do .NET para construir a aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia o arquivo de projeto e restaura as dependências
COPY *.csproj ./
RUN dotnet restore

# Copia o restante do código e constrói a aplicação
COPY . .
RUN dotnet publish -c Release -o out

# Estágio de Runtime: Usa uma imagem base menor para executar a aplicação
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/out .

# Expõe a porta que sua aplicação .NET usa (por padrão 80 para HTTP)
EXPOSE 80

# Define o ponto de entrada da aplicação
ENTRYPOINT ["dotnet", "API.dll"]
```

