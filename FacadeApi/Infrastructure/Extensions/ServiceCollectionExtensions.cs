using Application.Interfaces;
using Infrastructure.Context;
using Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration _config)
        {
            // Register infrastructure services here
            // e.g., services.AddScoped<IMyService, MyService>();
            services.AddDataContext(_config);
            services.SeedDataAsync();
            return services;
        }
        public static IServiceCollection AddDataContext(this IServiceCollection services, IConfiguration _config)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(_config.GetConnectionString("Default"));
            });

            return services;
        }

        public static IServiceCollection SeedDataAsync(this IServiceCollection services)
        {
            services.AddScoped<IDataSeeder, InitialDataSeeder>();
            return services;
        }
    }
}
