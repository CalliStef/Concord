using System.Text.Json.Serialization;
using Concord.Models;
using Concord.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Newtonsoft.Json;


DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);


var port = Environment.GetEnvironmentVariable("PORT") ?? "8081";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");


builder.Services.AddDbContext<DatabaseContext>(opt =>
{
    opt.UseNpgsql(
        connectionString,
        o => o.MigrationsAssembly("Concord")
    );
    if (builder.Environment.IsDevelopment())
    {
        opt.LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors();
    }
});


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services
    .AddControllers()
    .AddNewtonsoftJson(
        options => options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
    );

builder.Services.AddSignalR().AddJsonProtocol(o =>
{
    o.PayloadSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.MapControllers();
app.MapHub<ChatHub>("/r/chat");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
