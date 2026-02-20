using Domain.Entities.Identity;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Seed
{
    /// <summary>
    /// Seeds initial roles
    /// </summary>
    public class RoleSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            if (await context.Roles.AnyAsync())
                return;

            var roles = new List<Role>
            {
                new Role
                {
                    Id = 1,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    Description = "Administrator with full access to all features",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = 2,
                    Name = "User",
                    NormalizedName = "USER",
                    Description = "Standard user with basic access",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = 3,
                    Name = "Manager",
                    NormalizedName = "MANAGER",
                    Description = "Manager with access to manage products and users",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Roles.AddRange(roles);
            await context.SaveChangesAsync();
        }
    }
}
