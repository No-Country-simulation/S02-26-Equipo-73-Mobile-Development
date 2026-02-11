using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Services.Products;
using Infrastructure.Context;
using Infrastructure.Persistence.Seed;
using Infrastructure.Repositories;
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
            services.AddRepositories();
            services.AddApplicationServices();
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

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IProductRepository, ProductRepository>();
            return services;
        }

        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IProductService, ProductService>();
            return services;
        }

        public static IServiceCollection SeedDataAsync(this IServiceCollection services)
        {
            services.AddScoped<IDataSeeder, InitialDataSeeder>();
            return services;
        }
    }
}
