using Amazon.S3;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Services.Products;
using Infrastructure.AWS.S3;
using Infrastructure.Context;
using Infrastructure.Mapper;
using Infrastructure.Persistence.Seed;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
            services.AddAuthenticationSupase(_config);
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
        public static IServiceCollection AddAuthenticationSupase(this IServiceCollection services, IConfiguration _config)
        {
            var projectId = _config["Supabase:ProjectId"];
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = "ApiJwt";
                opt.DefaultChallengeScheme = "ApiJwt";
            })
                .AddJwtBearer("SupabaseJwt", options =>
                {
                    options.Authority = $"https://{projectId}.supabase.co/auth/v1";

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = false,
                        ValidateLifetime = true
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine("❌ AUTH FAILED:");
                            Console.WriteLine(context.Exception.ToString());
                            return Task.CompletedTask;
                        }
                    };
                })
                .AddJwtBearer("ApiJwt", options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = "https://tu-api.com",

                        ValidateAudience = true,
                        ValidAudience = "tu-api-client",

                        ValidateLifetime = true,

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes("TU_API_SECRET_KEY"))
                    };
                });


            return services;
        }
    }
}
