# Stage 1: Build React Vite Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build ASP.NET Core Web API
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /src

# Copy csproj files for dependency restore
COPY backend/TestPlatform.Domain/TestPlatform.Domain.csproj backend/TestPlatform.Domain/
COPY backend/TestPlatform.Data/TestPlatform.Data.csproj backend/TestPlatform.Data/
COPY backend/TestPlatform.Service/TestPlatform.Service.csproj backend/TestPlatform.Service/
COPY backend/TestPlatform.WebApi/TestPlatform.WebApi.csproj backend/TestPlatform.WebApi/

RUN dotnet restore backend/TestPlatform.WebApi/TestPlatform.WebApi.csproj

# Copy backend source files
COPY backend/ backend/

# Copy built React dist folder directly into WebApi wwwroot
COPY --from=frontend-build /frontend/dist ./backend/TestPlatform.WebApi/wwwroot

# Publish Web API
RUN dotnet publish backend/TestPlatform.WebApi/TestPlatform.WebApi.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=backend-build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_USE_POLLING_FILE_WATCHER=1
EXPOSE 8080
EXPOSE 5000

ENTRYPOINT ["dotnet", "TestPlatform.WebApi.dll"]
