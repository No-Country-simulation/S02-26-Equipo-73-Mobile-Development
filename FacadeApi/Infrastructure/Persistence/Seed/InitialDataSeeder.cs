using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.Measurement;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Seed
{
    public class InitialDataSeeder : IDataSeeder
    {
        private readonly AppDbContext _context;

        public InitialDataSeeder(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            await SeedUnits();
            await SeedMeasurementTypes();
            await SeedSizeSystems();
            await SeedCategories();
            await SeedBrandsAndSizes();
        }
        private async Task SeedUnits()
        {
            if (await _context.MeasurementUnits.AnyAsync())
                return;

            _context.MeasurementUnits.AddRange(
                new MeasurementUnit { Id = 1, Name = "Centimeters", Symbol = "cm", ToBaseFactor = 1 },
                new MeasurementUnit { Id = 2, Name = "Inches", Symbol = "in", ToBaseFactor = 2.54m }
            );

            await _context.SaveChangesAsync();
        }

        private async Task SeedMeasurementTypes()
        {
            if (await _context.MeasurementTypes.AnyAsync())
                return;

            _context.MeasurementTypes.AddRange(
                new MeasurementType { Id = 1, Name = "Foot Length", EntityType = "Rider" },
                new MeasurementType { Id = 2, Name = "Calf Circumference", EntityType = "Rider" }
            );

            await _context.SaveChangesAsync();
        }
        private async Task SeedSizeSystems()
        {
            if (await _context.SizeSystems.AnyAsync())
                return;

            _context.SizeSystems.AddRange(
                new SizeSystem { Id = 1, Name = "EU" },
                new SizeSystem { Id = 2, Name = "US" }
            );

            await _context.SaveChangesAsync();
        }
        private async Task SeedCategories()
        {
            if (await _context.ProductCategories.AnyAsync())
                return;

            _context.ProductCategories.Add(
                new ProductCategory { Id = 1, Name = "Boots" }
            );

            await _context.SaveChangesAsync();
        }
        private async Task SeedBrandsAndSizes()
        {
            if (await _context.Brands.AnyAsync())
                return;

            var ariat = new Brand { Name = "Ariat" };
            var tucci = new Brand { Name = "Tucci" };

            _context.Brands.AddRange(ariat, tucci);
            await _context.SaveChangesAsync();

            var sizes = new List<BrandSize>
        {
            new BrandSize { BrandId = ariat.Id, CategoryId = 1, SizeSystemId = 1, Label = "42" },
            new BrandSize { BrandId = ariat.Id, CategoryId = 1, SizeSystemId = 1, Label = "43" },
            new BrandSize { BrandId = tucci.Id, CategoryId = 1, SizeSystemId = 1, Label = "42" },
            new BrandSize { BrandId = tucci.Id, CategoryId = 1, SizeSystemId = 1, Label = "43" }
        };

            _context.BrandSizes.AddRange(sizes);
            await _context.SaveChangesAsync();

            _context.BrandSizeMeasurements.AddRange(
                new BrandSizeMeasurement
                {
                    BrandSizeId = sizes[0].Id,
                    MeasurementTypeId = 1,
                    UnitId = 1,
                    MinValue = 26.5m,
                    MaxValue = 27.0m
                },
                new BrandSizeMeasurement
                {
                    BrandSizeId = sizes[1].Id,
                    MeasurementTypeId = 1,
                    UnitId = 1,
                    MinValue = 27.1m,
                    MaxValue = 27.8m
                }
            );

            await _context.SaveChangesAsync();
        }
    }
}
