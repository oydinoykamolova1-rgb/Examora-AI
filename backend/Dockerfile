# Multi-stage Dockerfile for ASP.NET Core Web API on Render.com
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files for dependency restoration
COPY ["TestPlatform.Domain/TestPlatform.Domain.csproj", "TestPlatform.Domain/"]
COPY ["TestPlatform.Data/TestPlatform.Data.csproj", "TestPlatform.Data/"]
COPY ["TestPlatform.Service/TestPlatform.Service.csproj", "TestPlatform.Service/"]
COPY ["TestPlatform.WebApi/TestPlatform.WebApi.csproj", "TestPlatform.WebApi/"]

RUN dotnet restore "TestPlatform.WebApi/TestPlatform.WebApi.csproj"

# Copy source code and build
COPY . .
RUN dotnet publish "TestPlatform.WebApi/TestPlatform.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_USE_POLLING_FILE_WATCHER=1
EXPOSE 8080
EXPOSE 5000

ENTRYPOINT ["dotnet", "TestPlatform.WebApi.dll"]
