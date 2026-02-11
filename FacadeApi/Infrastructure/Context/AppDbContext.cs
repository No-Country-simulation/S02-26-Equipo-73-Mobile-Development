using Domain.Entities;
using Domain.Entities.Measurement;
using Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<MeasurementUnit> MeasurementUnits { get; set; }
        public virtual DbSet<MeasurementType> MeasurementTypes { get; set; }
        public virtual DbSet<SizeSystem> SizeSystems { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<ProductCategory> ProductCategories { get; set; }
        public virtual DbSet<BrandSize> BrandSizes { get; set; }
        public virtual DbSet<BrandSizeMeasurement> BrandSizeMeasurements { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Price).HasPrecision(18,2);
            });

            builder.Entity<MeasurementUnit>(entity =>
            {
                entity.ToTable("MeasurementUnits");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(x => x.Symbol)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.HasIndex(x => x.Name).IsUnique();
                entity.HasIndex(x => x.Symbol).IsUnique();
            });

            builder.Entity<MeasurementType>(entity =>
            {
                entity.ToTable("MeasurementTypes");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(x => x.EntityType)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasIndex(x => x.Name);
            });

            // =============================
            // SizeSystem
            // =============================
            builder.Entity<SizeSystem>(entity =>
            {
                entity.ToTable("SizeSystems");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasIndex(x => x.Name).IsUnique();
            });

            // =============================
            // Brand
            // =============================
            builder.Entity<Brand>(entity =>
            {
                entity.ToTable("Brands");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasIndex(x => x.Name).IsUnique();
            });

            // =============================
            // ProductCategory
            // =============================
            builder.Entity<ProductCategory>(entity =>
            {
                entity.ToTable("ProductCategories");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasIndex(x => x.Name).IsUnique();
            });

            // =============================
            // BrandSize
            // =============================
            builder.Entity<BrandSize>(entity =>
            {
                entity.ToTable("BrandSizes");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Label)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(x => x.Brand)
                    .WithMany()
                    .HasForeignKey(x => x.BrandId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Category)
                    .WithMany()
                    .HasForeignKey(x => x.CategoryId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.SizeSystem)
                    .WithMany()
                    .HasForeignKey(x => x.SizeSystemId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Evita duplicados tipo:
                // Ariat - Boots - EU - 43
                entity.HasIndex(x => new { x.BrandId, x.CategoryId, x.SizeSystemId, x.Label })
                    .IsUnique();
            });

            // =============================
            // BrandSizeMeasurement
            // =============================
            builder.Entity<BrandSizeMeasurement>(entity =>
            {
                entity.ToTable("BrandSizeMeasurements");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.MinValue)
                    .HasColumnType("decimal(10,2)");

                entity.Property(x => x.MaxValue)
                    .HasColumnType("decimal(10,2)");

                entity.HasOne(x => x.BrandSize)
                    .WithMany()
                    .HasForeignKey(x => x.BrandSizeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.MeasurementType)
                    .WithMany()
                    .HasForeignKey(x => x.MeasurementTypeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.Unit)
                    .WithMany()
                    .HasForeignKey(x => x.UnitId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Índice CLAVE para recomendaciones rápidas
                entity.HasIndex(x => new { x.MeasurementTypeId, x.UnitId });
            });
        }
    }
}
