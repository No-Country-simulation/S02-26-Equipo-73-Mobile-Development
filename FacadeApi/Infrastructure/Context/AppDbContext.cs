using Domain.Entities;
using Domain.Entities.Identity;
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
        public virtual DbSet<MediaProduct> MediaProducts { get; set; }  
        public virtual DbSet<ProductVariant> ProductVariants { get; set; }
        public virtual DbSet<MeasurementUnit> MeasurementUnits { get; set; }
        public virtual DbSet<MeasurementType> MeasurementTypes { get; set; }
        public virtual DbSet<MeasurementEntity> MeasurementEntities { get; set; }
        public virtual DbSet<UserMeasurement> UserMeasurements { get; set; }
        public virtual DbSet<SizeSystem> SizeSystems { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<ProductCategory> ProductCategories { get; set; }
        public virtual DbSet<BrandSize> BrandSizes { get; set; }
        public virtual DbSet<BrandSizeMeasurement> BrandSizeMeasurements { get; set; }

        // Identity
        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<ApplicationUserRole> ApplicationUserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // =============================
            // Product
            // =============================
            builder.Entity<Product>(entity =>
            {
                entity.ToTable("Products");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.Property(e => e.Price)
                    .HasPrecision(18, 2);

                entity.HasOne(e => e.Brand)
                    .WithMany()
                    .HasForeignKey(e => e.BrandId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Category)
                    .WithMany()
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relaciones de auditoría
                entity.HasOne(e => e.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.UpdatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.UpdatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.CreatedAt);

                entity.Property(e => e.UpdatedAt);

                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => e.BrandId);
                entity.HasIndex(e => e.CategoryId);
                entity.HasIndex(e => e.IsActive);
                entity.HasIndex(e => e.CreatedBy);
                entity.HasIndex(e => e.UpdatedBy);
            });

            // =============================
            // ProductVariant
            // =============================
            builder.Entity<ProductVariant>(entity =>
            {
                entity.ToTable("ProductVariants");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Price)
                    .HasPrecision(18, 2);

                entity.HasOne(e => e.Product)
                    .WithMany(p => p.Variants)
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.BrandSize)
                    .WithMany()
                    .HasForeignKey(e => e.BrandSizeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.ProductId);
                entity.HasIndex(e => e.BrandSizeId);
                entity.HasIndex(e => e.IsActive);
                
                // Evita duplicados: mismo producto con misma talla
                entity.HasIndex(e => new { e.ProductId, e.BrandSizeId })
                    .IsUnique();
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

            // =============================
            // MeasurementEntity
            // =============================
            builder.Entity<MeasurementEntity>(entity =>
            {
                entity.ToTable("MeasurementEntities");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(x => x.Description)
                    .HasMaxLength(255);

                entity.HasIndex(x => x.Name).IsUnique();
            });

            // =============================
            // MeasurementType
            // =============================
            builder.Entity<MeasurementType>(entity =>
            {
                entity.ToTable("MeasurementTypes");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasOne(x => x.EntityType)
                    .WithMany(e => e.MeasurementTypes)
                    .HasForeignKey(x => x.EntityTypeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(x => x.Name);
                entity.HasIndex(x => x.EntityTypeId);
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

                // Relaciones de auditoría
                entity.HasOne(x => x.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(x => x.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.UpdatedByUser)
                    .WithMany()
                    .HasForeignKey(x => x.UpdatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(x => x.CreatedAt);

                entity.Property(x => x.UpdatedAt);

                entity.HasIndex(x => x.Name).IsUnique();
                entity.HasIndex(x => x.CreatedBy);
                entity.HasIndex(x => x.UpdatedBy);
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

                // Relaciones de auditoría
                entity.HasOne(x => x.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(x => x.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.UpdatedByUser)
                    .WithMany()
                    .HasForeignKey(x => x.UpdatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(x => x.CreatedAt);

                entity.Property(x => x.UpdatedAt);

                entity.HasIndex(x => x.Name).IsUnique();
                entity.HasIndex(x => x.CreatedBy);
                entity.HasIndex(x => x.UpdatedBy);
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

            // =============================
            // MediaProduct
            // =============================
            builder.Entity<MediaProduct>(entity =>
            {
                entity.ToTable("MediaProducts");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Url)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.MediaType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("image");

                entity.Property(e => e.Order)
                    .HasDefaultValue(0);

                entity.Property(e => e.IsPrimary)
                    .HasDefaultValue(false);

                entity.HasOne(e => e.Product)
                    .WithMany(p => p.MediaProducts)
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.ProductId);
                entity.HasIndex(e => new { e.ProductId, e.IsPrimary });
                entity.HasIndex(e => new { e.ProductId, e.Order });
            });

            // =============================
            // UserMeasurement
            // =============================
            builder.Entity<UserMeasurement>(entity =>
            {
                entity.ToTable("UserMeasurements");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Value)
                    .HasColumnType("decimal(10,2)")
                    .IsRequired();

                entity.Property(x => x.CreatedAt);

                entity.Property(x => x.UpdatedAt);

                // Relación con ApplicationUser
                entity.HasOne(x => x.User)
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.MeasurementType)
                    .WithMany()
                    .HasForeignKey(x => x.MeasurementTypeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.Unit)
                    .WithMany()
                    .HasForeignKey(x => x.UnitId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Índices para queries rápidas
                entity.HasIndex(x => x.UserId);
                entity.HasIndex(x => new { x.UserId, x.MeasurementTypeId });
            });

            // =============================
            // ApplicationUser
            // =============================
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.ToTable("ApplicationUsers");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.SupabaseId)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(x => x.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(x => x.FirstName)
                    .HasMaxLength(100);

                entity.Property(x => x.LastName)
                    .HasMaxLength(100);

                entity.Property(x => x.Phone)
                    .HasMaxLength(20);

                entity.Property(x => x.ProfileImageUrl)
                    .HasMaxLength(500);

                entity.Property(x => x.IsActive)
                    .HasDefaultValue(true);

                entity.Property(x => x.IsDeleted)
                    .HasDefaultValue(false);

                entity.Property(x => x.CreatedAt);

                entity.Property(x => x.UpdatedAt);

                entity.HasIndex(x => x.SupabaseId).IsUnique();
                entity.HasIndex(x => x.Email).IsUnique();
                entity.HasIndex(x => x.IsActive);
                entity.HasIndex(x => x.IsDeleted);
            });

            // =============================
            // Role
            // =============================
            builder.Entity<Role>(entity =>
            {
                entity.ToTable("Roles");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(x => x.NormalizedName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(x => x.Description)
                    .HasMaxLength(255);

                entity.Property(x => x.CreatedAt);

                entity.Property(x => x.UpdatedAt);

                entity.HasIndex(x => x.Name).IsUnique();
                entity.HasIndex(x => x.NormalizedName).IsUnique();
            });

            // =============================
            // ApplicationUserRole (Many-to-Many)
            // =============================
            builder.Entity<ApplicationUserRole>(entity =>
            {
                entity.ToTable("ApplicationUserRoles");

                entity.HasKey(x => new { x.UserId, x.RoleId });

                entity.Property(x => x.AssignedAt);

                entity.HasOne(x => x.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(x => x.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(x => x.UserId);
                entity.HasIndex(x => x.RoleId);
            });
        }
    }
}
