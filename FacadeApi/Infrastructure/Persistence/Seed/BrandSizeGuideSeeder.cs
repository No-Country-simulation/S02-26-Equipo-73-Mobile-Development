using Domain.Entities;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Seed
{
    /// <summary>
    /// Seeds BrandSizeGuide data: EU/US/UK conversions + foot length ranges per brand/category
    /// </summary>
    public static class BrandSizeGuideSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            if (await context.BrandSizeGuides.AnyAsync())
                return;

            // ============================================================
            // Ariat - Boots (BrandId=1, CategoryId=1)
            // EU labels, US/UK equivalents, foot length in cm
            // ============================================================
            var ariatBoots = new[]
            {
                new { EuLabel = "35", UsLabel = "5",   UkLabel = "2.5", MinCm = 22.5m, MaxCm = 23.0m },
                new { EuLabel = "36", UsLabel = "5.5", UkLabel = "3",   MinCm = 23.0m, MaxCm = 23.5m },
                new { EuLabel = "37", UsLabel = "6.5", UkLabel = "4",   MinCm = 23.5m, MaxCm = 24.0m },
                new { EuLabel = "38", UsLabel = "7",   UkLabel = "5",   MinCm = 24.0m, MaxCm = 24.5m },
                new { EuLabel = "39", UsLabel = "8",   UkLabel = "5.5", MinCm = 24.5m, MaxCm = 25.0m },
                new { EuLabel = "40", UsLabel = "8.5", UkLabel = "6.5", MinCm = 25.0m, MaxCm = 25.5m },
                new { EuLabel = "41", UsLabel = "9",   UkLabel = "7",   MinCm = 25.5m, MaxCm = 26.0m },
                new { EuLabel = "42", UsLabel = "9.5", UkLabel = "8",   MinCm = 26.5m, MaxCm = 27.0m },
                new { EuLabel = "43", UsLabel = "10",  UkLabel = "9",   MinCm = 27.0m, MaxCm = 27.5m },
                new { EuLabel = "44", UsLabel = "11",  UkLabel = "9.5", MinCm = 27.5m, MaxCm = 28.0m },
                new { EuLabel = "45", UsLabel = "12",  UkLabel = "10",  MinCm = 28.0m, MaxCm = 28.5m },
                new { EuLabel = "46", UsLabel = "13",  UkLabel = "11",  MinCm = 28.5m, MaxCm = 29.0m },
            };

            foreach (var entry in ariatBoots)
            {
                context.BrandSizeGuides.Add(new BrandSizeGuide
                {
                    BrandId = 1,
                    CategoryId = 1,
                    EuLabel = entry.EuLabel,
                    UsLabel = entry.UsLabel,
                    UkLabel = entry.UkLabel,
                    FootLengthMinCm = entry.MinCm,
                    FootLengthMaxCm = entry.MaxCm
                });
            }

            // ============================================================
            // Ariat - Gloves (BrandId=1, CategoryId=4)
            // Gloves use International sizing (XS/S/M/L/XL)
            // ============================================================
            var ariatGloves = new[]
            {
                new { EuLabel = "XS", UsLabel = "XS", UkLabel = "XS", MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "S",  UsLabel = "S",  UkLabel = "S",  MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "M",  UsLabel = "M",  UkLabel = "M",  MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "L",  UsLabel = "L",  UkLabel = "L",  MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "XL", UsLabel = "XL", UkLabel = "XL", MinCm = (decimal?)null, MaxCm = (decimal?)null },
            };

            foreach (var entry in ariatGloves)
            {
                context.BrandSizeGuides.Add(new BrandSizeGuide
                {
                    BrandId = 1,
                    CategoryId = 4,
                    EuLabel = entry.EuLabel,
                    UsLabel = entry.UsLabel,
                    UkLabel = entry.UkLabel,
                    FootLengthMinCm = entry.MinCm,
                    FootLengthMaxCm = entry.MaxCm
                });
            }

            // ============================================================
            // Cavallo - Boots (BrandId=2, CategoryId=1)
            // ============================================================
            var cavalloBoots = new[]
            {
                new { EuLabel = "36", UsLabel = "5.5", UkLabel = "3",   MinCm = 23.0m, MaxCm = 23.5m },
                new { EuLabel = "37", UsLabel = "6.5", UkLabel = "4",   MinCm = 23.5m, MaxCm = 24.0m },
                new { EuLabel = "38", UsLabel = "7",   UkLabel = "5",   MinCm = 24.0m, MaxCm = 24.5m },
                new { EuLabel = "39", UsLabel = "8",   UkLabel = "5.5", MinCm = 24.5m, MaxCm = 25.0m },
                new { EuLabel = "40", UsLabel = "8.5", UkLabel = "6.5", MinCm = 25.0m, MaxCm = 25.5m },
                new { EuLabel = "41", UsLabel = "9",   UkLabel = "7",   MinCm = 25.5m, MaxCm = 26.0m },
                new { EuLabel = "42", UsLabel = "9.5", UkLabel = "8",   MinCm = 26.5m, MaxCm = 27.0m },
                new { EuLabel = "43", UsLabel = "10",  UkLabel = "9",   MinCm = 27.0m, MaxCm = 27.5m },
                new { EuLabel = "44", UsLabel = "11",  UkLabel = "9.5", MinCm = 27.5m, MaxCm = 28.0m },
            };

            foreach (var entry in cavalloBoots)
            {
                context.BrandSizeGuides.Add(new BrandSizeGuide
                {
                    BrandId = 2,
                    CategoryId = 1,
                    EuLabel = entry.EuLabel,
                    UsLabel = entry.UsLabel,
                    UkLabel = entry.UkLabel,
                    FootLengthMinCm = entry.MinCm,
                    FootLengthMaxCm = entry.MaxCm
                });
            }

            // ============================================================
            // Riding Pants / Jackets - International sizing (applies to all brands)
            // Null CategoryId = applies to any category not explicitly covered
            // ============================================================
            var internationalSizing = new[]
            {
                new { EuLabel = "34", UsLabel = "0",  UkLabel = "6",  MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "36", UsLabel = "2",  UkLabel = "8",  MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "38", UsLabel = "4",  UkLabel = "10", MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "40", UsLabel = "6",  UkLabel = "12", MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "42", UsLabel = "8",  UkLabel = "14", MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "44", UsLabel = "10", UkLabel = "16", MinCm = (decimal?)null, MaxCm = (decimal?)null },
                new { EuLabel = "46", UsLabel = "12", UkLabel = "18", MinCm = (decimal?)null, MaxCm = (decimal?)null },
            };

            // Riding Pants (CategoryId=2) y Jackets (CategoryId=5) para Ariat
            foreach (var categoryId in new[] { 2, 5 })
            {
                foreach (var entry in internationalSizing)
                {
                    context.BrandSizeGuides.Add(new BrandSizeGuide
                    {
                        BrandId = 1,
                        CategoryId = categoryId,
                        EuLabel = entry.EuLabel,
                        UsLabel = entry.UsLabel,
                        UkLabel = entry.UkLabel,
                        FootLengthMinCm = null,
                        FootLengthMaxCm = null
                    });
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
