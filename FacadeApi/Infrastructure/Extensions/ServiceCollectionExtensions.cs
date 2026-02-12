using Amazon.S3;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Services.Products;
using Infrastructure.AWS.S3;
using Infrastructure.Context;
using Infrastructure.Mapper;
using Infrastructure.Persistence.Seed;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

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
            services.AddAutoMapperExtension();
            services.AddAWSS3(_config);
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

        public static IServiceCollection AddAutoMapperExtension(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg => { }, typeof(AutoMap));
            return services;
        }

        public static IServiceCollection AddAWSS3(this IServiceCollection services, IConfiguration _config)
        {
            // Configure StorageSettings from appsettings.json
            services.Configure<StorageSettings>(_config.GetSection("StorageSettings"));

            // Register Amazon S3 client
            services.AddSingleton<IAmazonS3>(sp =>
            {
                var config = sp.GetRequiredService<IOptions<StorageSettings>>().Value;
                var s3Config = new AmazonS3Config
                {
                    ForcePathStyle = true,
                    ServiceURL = config.Endpoint,
                    UseHttp = !config.UseSsl
                };
                return new AmazonS3Client(config.AccessKey, config.SecretKey, s3Config);
            });

            // Uncomment to enable IStorageService abstraction
            services.AddScoped<IStorageService, StorageService>();

            return services;
        }
    }
}
