using backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS for React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowReact"); // MUST come before MapControllers

app.MapControllers();

app.Run("http://localhost:5000"); // run backend on HTTP port 5000