using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.Measurement;
using Domain.Entities.Products;
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
            await SeedBrands();
            await SeedBrandSizes();
            await SeedBrandSizeMeasurements();
            await SeedProducts();
            await SeedProductVariants();
        }

        private async Task SeedUnits()
        {
            var units = new[]
            {
                new { Id = 1, Name = "Centimeters", Symbol = "cm", ToBaseFactor = 1m },
                new { Id = 2, Name = "Inches", Symbol = "in", ToBaseFactor = 2.54m },
                new { Id = 3, Name = "Millimeters", Symbol = "mm", ToBaseFactor = 0.1m }
            };

            foreach (var unitData in units)
            {
                var existing = await _context.MeasurementUnits
                    .FirstOrDefaultAsync(u => u.Id == unitData.Id);

                if (existing == null)
                {
                    _context.MeasurementUnits.Add(new MeasurementUnit
                    {
                        Id = unitData.Id,
                        Name = unitData.Name,
                        Symbol = unitData.Symbol,
                        ToBaseFactor = unitData.ToBaseFactor
                    });
                }
                else
                {
                    existing.Name = unitData.Name;
                    existing.Symbol = unitData.Symbol;
                    existing.ToBaseFactor = unitData.ToBaseFactor;
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task SeedMeasurementTypes()
        {
            var types = new[]
            {
                new { Id = 1, Name = "Foot Length", EntityType = "Rider" },
                new { Id = 2, Name = "Calf Circumference", EntityType = "Rider" },
                new { Id = 3, Name = "Ankle Circumference", EntityType = "Rider" },
                new { Id = 4, Name = "Instep Height", EntityType = "Rider" }
            };

            foreach (var typeData in types)
            {
                var existing = await _context.MeasurementTypes
                    .FirstOrDefaultAsync(t => t.Id == typeData.Id);

                if (existing == null)
                {
                    _context.MeasurementTypes.Add(new MeasurementType
                    {
                        Id = typeData.Id,
                        Name = typeData.Name,
                        EntityType = typeData.EntityType
                    });
                }
                else
                {
                    existing.Name = typeData.Name;
                    existing.EntityType = typeData.EntityType;
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task SeedSizeSystems()
        {
            var systems = new[]
            {
                new { Id = 1, Name = "EU" },
                new { Id = 2, Name = "US" },
                new { Id = 3, Name = "UK" },
                new { Id = 4, Name = "International" }
            };

            foreach (var systemData in systems)
            {
                var existing = await _context.SizeSystems
                    .FirstOrDefaultAsync(s => s.Id == systemData.Id);

                if (existing == null)
                {
                    _context.SizeSystems.Add(new SizeSystem
                    {
                        Id = systemData.Id,
                        Name = systemData.Name
                    });
                }
                else
                {
                    existing.Name = systemData.Name;
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task SeedCategories()
        {
            var categories = new[]
            {
                new { Id = 1, Name = "Boots" },
                new { Id = 2, Name = "Riding Pants" },
                new { Id = 3, Name = "Helmets" },
                new { Id = 4, Name = "Gloves" },
                new { Id = 5, Name = "Jackets" }
            };

            foreach (var categoryData in categories)
            {
                var existing = await _context.ProductCategories
                    .FirstOrDefaultAsync(c => c.Id == categoryData.Id);

                if (existing == null)
                {
                    _context.ProductCategories.Add(new ProductCategory
                    {
                        Id = categoryData.Id,
                        Name = categoryData.Name
                    });
                }
                else
                {
                    existing.Name = categoryData.Name;
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task SeedBrands()
        {
            var brands = new[]
            {
                new { Id = 1, Name = "Ariat" },
                new { Id = 2, Name = "Tucci" },
                new { Id = 3, Name = "Cavallo" },
                new { Id = 4, Name = "Mountain Horse" },
                new { Id = 5, Name = "Dublin" }
            };

            foreach (var brandData in brands)
            {
                var existing = await _context.Brands
                    .FirstOrDefaultAsync(b => b.Id == brandData.Id);

                if (existing == null)
                {
                    _context.Brands.Add(new Brand
                    {
                        Id = brandData.Id,
                        Name = brandData.Name
                    });
                }
                else
                {
                    existing.Name = brandData.Name;
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task SeedBrandSizes()
        {
            var sizes = new[]
            {
                // Ariat Boots - EU
                new { Id = 1, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "38" },
                new { Id = 2, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "39" },
                new { Id = 3, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "40" },
                new { Id = 4, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "41" },
                new { Id = 5, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "42" },
                new { Id = 6, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "43" },
                new { Id = 7, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "44" },
                
                // Ariat Boots - US
                new { Id = 8, BrandId = 1, CategoryId = 1, SizeSystemId = 2, Label = "6" },
                new { Id = 9, BrandId = 1, CategoryId = 1, SizeSystemId = 2, Label = "7" },
                new { Id = 10, BrandId = 1, CategoryId = 1, SizeSystemId = 2, Label = "8" },
                new { Id = 11, BrandId = 1, CategoryId = 1, SizeSystemId = 2, Label = "9" },
                new { Id = 12, BrandId = 1, CategoryId = 1, SizeSystemId = 2, Label = "10" },
                
                // Tucci Boots - EU
                new { Id = 13, BrandId = 2, CategoryId = 1, SizeSystemId = 1, Label = "38" },
                new { Id = 14, BrandId = 2, CategoryId = 1, SizeSystemId = 1, Label = "39" },
                new { Id = 15, BrandId = 2, CategoryId = 1, SizeSystemId = 1, Label = "40" },
                new { Id = 16, BrandId = 2, CategoryId = 1, SizeSystemId = 1, Label = "41" },
                new { Id = 17, BrandId = 2, CategoryId = 1, SizeSystemId = 1, Label = "42" },
                new { Id = 18, BrandId = 2, CategoryId = 1, SizeSystemId = 1, Label = "43" },
                
                // Cavallo Boots - EU
                new { Id = 19, BrandId = 3, CategoryId = 1, SizeSystemId = 1, Label = "38" },
                new { Id = 20, BrandId = 3, CategoryId = 1, SizeSystemId = 1, Label = "39" },
                new { Id = 21, BrandId = 3, CategoryId = 1, SizeSystemId = 1, Label = "40" },
                new { Id = 22, BrandId = 3, CategoryId = 1, SizeSystemId = 1, Label = "41" },
                new { Id = 23, BrandId = 3, CategoryId = 1, SizeSystemId = 1, Label = "42" }
            };

            foreach (var sizeData in sizes)
            {
                var existing = await _context.BrandSizes
                    .FirstOrDefaultAsync(s => s.BrandId == sizeData.BrandId 
                        && s.CategoryId == sizeData.CategoryId 
                        && s.SizeSystemId == sizeData.SizeSystemId 
                        && s.Label == sizeData.Label);

                if (existing == null)
                {
                    _context.BrandSizes.Add(new BrandSize
                    {
                        BrandId = sizeData.BrandId,
                        CategoryId = sizeData.CategoryId,
                        SizeSystemId = sizeData.SizeSystemId,
                        Label = sizeData.Label
                    });
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task SeedBrandSizeMeasurements()
        {
            // Solo agregar si no existen medidas
            if (await _context.BrandSizeMeasurements.AnyAsync())
                return;

            var brandSizes = await _context.BrandSizes.ToListAsync();
            var measurements = new List<BrandSizeMeasurement>();

            // Ariat EU 38-44 (Foot Length)
            var ariatEuSizes = brandSizes.Where(s => s.BrandId == 1 && s.SizeSystemId == 1).OrderBy(s => s.Label).ToList();
            decimal baseFootLength = 24.0m;
            
            foreach (var size in ariatEuSizes)
            {
                measurements.Add(new BrandSizeMeasurement
                {
                    BrandSizeId = size.Id,
                    MeasurementTypeId = 1, // Foot Length
                    UnitId = 1, // cm
                    MinValue = baseFootLength,
                    MaxValue = baseFootLength + 0.7m
                });
                baseFootLength += 0.7m;
            }

            _context.BrandSizeMeasurements.AddRange(measurements);
            await _context.SaveChangesAsync();
        }

        private async Task SeedProducts()
        {
            var products = new[]
            {
                // Ariat Products
                new { Id = 1, Name = "Ariat Heritage IV Paddock Boot", Description = "Classic paddock boot with elastic twin gore and pull tabs for easy on/off", Price = 179.99m, BrandId = 1, CategoryId = 1, IsActive = true },
                new { Id = 2, Name = "Ariat Heritage Contour II Field Zip Boot", Description = "Field boot with full-grain leather and moisture-wicking technology", Price = 249.99m, BrandId = 1, CategoryId = 1, IsActive = true },
                new { Id = 3, Name = "Ariat Challenge Square Toe Dress Boot", Description = "Professional dress boot with leather sole and elegant square toe", Price = 329.99m, BrandId = 1, CategoryId = 1, IsActive = true },
                new { Id = 4, Name = "Ariat Devon Pro VX Paddock Boot", Description = "Advanced paddock boot with premium leather and enhanced durability", Price = 299.99m, BrandId = 1, CategoryId = 1, IsActive = true },
                
                // Tucci Products
                new { Id = 5, Name = "Tucci Harley Tall Boot", Description = "Italian crafted tall boot with superior comfort and style", Price = 599.99m, BrandId = 2, CategoryId = 1, IsActive = true },
                new { Id = 6, Name = "Tucci Marilyn Tall Boot", Description = "Elegant tall boot with soft calfskin leather", Price = 649.99m, BrandId = 2, CategoryId = 1, IsActive = true },
                new { Id = 7, Name = "Tucci Giovanni Paddock Boot", Description = "Luxurious paddock boot with traditional styling", Price = 399.99m, BrandId = 2, CategoryId = 1, IsActive = true },
                
                // Cavallo Products
                new { Id = 8, Name = "Cavallo Linus Jump Boot", Description = "Versatile jump boot with exceptional fit", Price = 459.99m, BrandId = 3, CategoryId = 1, IsActive = true },
                new { Id = 9, Name = "Cavallo Piaffe Dressage Boot", Description = "Premium dressage boot for competitive riders", Price = 529.99m, BrandId = 3, CategoryId = 1, IsActive = true },
                new { Id = 10, Name = "Cavallo Simple Boot", Description = "Easy-care synthetic boot perfect for everyday riding", Price = 189.99m, BrandId = 3, CategoryId = 1, IsActive = true },
                
                // Mountain Horse Products
                new { Id = 11, Name = "Mountain Horse Sovereign Field Boot", Description = "High-quality field boot with waterproof membrane", Price = 379.99m, BrandId = 4, CategoryId = 1, IsActive = true },
                new { Id = 12, Name = "Mountain Horse Rimfrost Rider Boot", Description = "Insulated winter riding boot with supreme warmth", Price = 289.99m, BrandId = 4, CategoryId = 1, IsActive = true },
                
                // Dublin Products
                new { Id = 13, Name = "Dublin River Boots", Description = "Waterproof country boot for all-weather riding", Price = 159.99m, BrandId = 5, CategoryId = 1, IsActive = true },
                new { Id = 14, Name = "Dublin Evolution Lace Front Boot", Description = "Modern design with front lacing system", Price = 199.99m, BrandId = 5, CategoryId = 1, IsActive = true },
                new { Id = 15, Name = "Dublin Altitude Riding Boot", Description = "Comfortable everyday riding boot with great value", Price = 139.99m, BrandId = 5, CategoryId = 1, IsActive = true }
            };

            foreach (var productData in products)
            {
                var existing = await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == productData.Id);

                if (existing == null)
                {
                    _context.Products.Add(new Product
                    {
                        Name = productData.Name,
                        Description = productData.Description,
                        Price = productData.Price,
                        BrandId = productData.BrandId,
                        CategoryId = productData.CategoryId,
                        IsActive = productData.IsActive
                    });
                }
                else
                {
                    existing.Name = productData.Name;
                    existing.Description = productData.Description;
                    existing.Price = productData.Price;
                    existing.BrandId = productData.BrandId;
                    existing.CategoryId = productData.CategoryId;
                    existing.IsActive = productData.IsActive;
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task SeedProductVariants()
        {
            // Solo agregar si no existen variantes
            if (await _context.ProductVariants.AnyAsync())
                return;

            var products = await _context.Products.ToListAsync();
            var brandSizes = await _context.BrandSizes.ToListAsync();
            var variants = new List<ProductVariant>();

            // Para cada producto Ariat (IDs 1-4), agregar variantes con tallas EU 38-44
            var ariatProducts = products.Where(p => p.BrandId == 1).ToList();
            var ariatSizes = brandSizes.Where(s => s.BrandId == 1 && s.SizeSystemId == 1).ToList();

            foreach (var product in ariatProducts)
            {
                foreach (var size in ariatSizes)
                {
                    variants.Add(new ProductVariant
                    {
                        ProductId = product.Id,
                        BrandSizeId = size.Id,
                        Price = product.Price, // Mismo precio que el producto base
                        Stock = Random.Shared.Next(5, 25), // Stock aleatorio entre 5 y 25
                        IsActive = true
                    });
                }
            }

            // Para cada producto Tucci (IDs 5-7), agregar variantes con tallas EU 38-43
            var tucciProducts = products.Where(p => p.BrandId == 2).ToList();
            var tucciSizes = brandSizes.Where(s => s.BrandId == 2 && s.SizeSystemId == 1).ToList();

            foreach (var product in tucciProducts)
            {
                foreach (var size in tucciSizes)
                {
                    variants.Add(new ProductVariant
                    {
                        ProductId = product.Id,
                        BrandSizeId = size.Id,
                        Price = product.Price + 10, // Precio ligeramente mayor
                        Stock = Random.Shared.Next(3, 15),
                        IsActive = true
                    });
                }
            }

            // Para cada producto Cavallo (IDs 8-10), agregar variantes con tallas EU 38-42
            var cavalloProducts = products.Where(p => p.BrandId == 3).ToList();
            var cavalloSizes = brandSizes.Where(s => s.BrandId == 3 && s.SizeSystemId == 1).ToList();

            foreach (var product in cavalloProducts)
            {
                foreach (var size in cavalloSizes)
                {
                    variants.Add(new ProductVariant
                    {
                        ProductId = product.Id,
                        BrandSizeId = size.Id,
                        Price = product.Price,
                        Stock = Random.Shared.Next(5, 20),
                        IsActive = true
                    });
                }
            }

            _context.ProductVariants.AddRange(variants);
            await _context.SaveChangesAsync();
        }
    }
}
