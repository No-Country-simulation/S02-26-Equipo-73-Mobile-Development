using Domain.Entities.Horse;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Seed
{
    public static class HorseReferenceSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            await SeedBreedsAsync(context);
            await SeedDisciplinesAsync(context);
            await SeedHorseLevelsAsync(context);
        }

        private static async Task SeedBreedsAsync(AppDbContext context)
        {
            var breeds = new[]
            {
                new { Id = 1, Name = "Thoroughbred" },
                new { Id = 2, Name = "Arabian" },
                new { Id = 3, Name = "Quarter Horse" },
                new { Id = 4, Name = "Criollo" },
                new { Id = 5, Name = "Warmblood" },
                new { Id = 6, Name = "Andalusian" },
                new { Id = 7, Name = "Friesian" },
                new { Id = 8, Name = "Appaloosa" }
            };

            foreach (var data in breeds)
            {
                var existing = await context.Breeds.FirstOrDefaultAsync(b => b.Id == data.Id);

                if (existing == null)
                {
                    context.Breeds.Add(new Breed
                    {
                        Id = data.Id,
                        Name = data.Name,
                        IsActive = true
                    });
                }
                else
                {
                    existing.Name = data.Name;
                    existing.IsActive = true;
                }
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedDisciplinesAsync(AppDbContext context)
        {
            var disciplines = new[]
            {
                new { Id = 1, Name = "Show Jumping" },
                new { Id = 2, Name = "Dressage" },
                new { Id = 3, Name = "Endurance" },
                new { Id = 4, Name = "Polo" },
                new { Id = 5, Name = "Ranch Work" },
                new { Id = 6, Name = "Trail Riding" }
            };

            foreach (var data in disciplines)
            {
                var existing = await context.Disciplines.FirstOrDefaultAsync(d => d.Id == data.Id);

                if (existing == null)
                {
                    context.Disciplines.Add(new Discipline
                    {
                        Id = data.Id,
                        Name = data.Name,
                        IsActive = true
                    });
                }
                else
                {
                    existing.Name = data.Name;
                    existing.IsActive = true;
                }
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedHorseLevelsAsync(AppDbContext context)
        {
            var levels = new[]
            {
                new { Id = 1, Name = "Recreational" },
                new { Id = 2, Name = "Amateur" },
                new { Id = 3, Name = "Professional" }
            };

            foreach (var data in levels)
            {
                var existing = await context.HorseLevels.FirstOrDefaultAsync(l => l.Id == data.Id);

                if (existing == null)
                {
                    context.HorseLevels.Add(new HorseLevel
                    {
                        Id = data.Id,
                        Name = data.Name,
                        IsActive = true
                    });
                }
                else
                {
                    existing.Name = data.Name;
                    existing.IsActive = true;
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
