
using MemoryGameKidsBack.Models;
using MemoryGameKidsBack.Repository;
using MemoryGameKidsBack.Services;
using MemoryGameKidsBack.UnitOfWorks;
using Microsoft.EntityFrameworkCore;
using System;

namespace MemoryGameKidsBack
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //Add Context with Connection
            builder.Services.AddDbContext<KidsMemoreyTestDBContext>(option =>
            option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            


            builder.Services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IGameSessionService, GameSessionService>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost",
                    policy =>
                    {
                        policy
                            .SetIsOriginAllowed(origin =>
                                origin.StartsWith("http://localhost:") ||
                                origin.StartsWith("http://127.0.0.1:")
                            )
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors("AllowLocalhost");
            app.MapControllers();

            app.Run();
        }
    }
}
