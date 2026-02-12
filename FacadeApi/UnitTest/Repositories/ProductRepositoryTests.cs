using Application.DTOs.Products;
using AutoFixture;
using AutoMapper;
using Domain.Entities.Products;
using Domain.Entities;
using FluentAssertions;
using Infrastructure.Context;
using Infrastructure.Mapper;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace UnitTest.Repositories
{
    public class ProductRepositoryTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly ProductRepository _repository;
        private readonly Fixture _fixture;

        public ProductRepositoryTests()
        {
            // Setup InMemory database
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            // Setup AutoMapper
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMap>();
            }, NullLoggerFactory.Instance);
            _mapper = config.CreateMapper();

            _repository = new ProductRepository(_context, _mapper);
            _fixture = new Fixture();

            // Configurar AutoFixture para evitar problemas con navegación circular
            _fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
                .ForEach(b => _fixture.Behaviors.Remove(b));
            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());

            SeedDatabase();
        }

        private void SeedDatabase()
        {
            // Seed Brands
            var brands = new List<Brand>
            {
                new Brand { Id = 1, Name = "Ariat" },
                new Brand { Id = 2, Name = "Tucci" }
            };
            _context.Brands.AddRange(brands);

            // Seed Categories
            var categories = new List<ProductCategory>
            {
                new ProductCategory { Id = 1, Name = "Boots" },
                new ProductCategory { Id = 2, Name = "Helmets" }
            };
            _context.ProductCategories.AddRange(categories);

            // Seed SizeSystems
            var sizeSystems = new List<SizeSystem>
            {
                new SizeSystem { Id = 1, Name = "EU" }
            };
            _context.SizeSystems.AddRange(sizeSystems);

            // Seed BrandSizes
            var brandSizes = new List<BrandSize>
            {
                new BrandSize { Id = 1, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "42" },
                new BrandSize { Id = 2, BrandId = 1, CategoryId = 1, SizeSystemId = 1, Label = "43" }
            };
            _context.BrandSizes.AddRange(brandSizes);

            // Seed Products
            var products = new List<Product>
            {
                new Product
                {
                    Id = 1,
                    Name = "Heritage Boot",
                    Description = "Classic boot",
                    Price = 199.99m,
                    IsActive = true,
                    BrandId = 1,
                    CategoryId = 1
                },
                new Product
                {
                    Id = 2,
                    Name = "Safety Helmet",
                    Description = "Protective helmet",
                    Price = 89.99m,
                    IsActive = true,
                    BrandId = 2,
                    CategoryId = 2
                }
            };
            _context.Products.AddRange(products);

            _context.SaveChanges();
        }

        #region GetAllAsync Tests

        [Fact]
        public async Task GetAllAsync_WithNoFilters_ReturnsAllProducts()
        {
            // Arrange
            var filter = new ProductFilterDto
            {
                PageNumber = 1,
                PageSize = 10
            };

            // Act
            var result = await _repository.GetAllAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2);
            result.TotalCount.Should().Be(2);
        }

        [Fact]
        public async Task GetAllAsync_WithBrandFilter_ReturnsFilteredProducts()
        {
            // Arrange
            var filter = new ProductFilterDto
            {
                BrandId = 1,
                PageNumber = 1,
                PageSize = 10
            };

            // Act
            var result = await _repository.GetAllAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.Items.First().BrandName.Should().Be("Ariat");
        }

        [Fact]
        public async Task GetAllAsync_WithCategoryFilter_ReturnsFilteredProducts()
        {
            // Arrange
            var filter = new ProductFilterDto
            {
                CategoryId = 2,
                PageNumber = 1,
                PageSize = 10
            };

            // Act
            var result = await _repository.GetAllAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.Items.First().CategoryName.Should().Be("Helmets");
        }

        [Fact]
        public async Task GetAllAsync_WithPriceFilter_ReturnsFilteredProducts()
        {
            // Arrange
            var filter = new ProductFilterDto
            {
                MinPrice = 100,
                MaxPrice = 200,
                PageNumber = 1,
                PageSize = 10
            };

            // Act
            var result = await _repository.GetAllAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.Items.First().Name.Should().Be("Heritage Boot");
        }

        [Fact]
        public async Task GetAllAsync_WithPagination_ReturnsCorrectPage()
        {
            // Arrange
            var filter = new ProductFilterDto
            {
                PageNumber = 1,
                PageSize = 1
            };

            // Act
            var result = await _repository.GetAllAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.TotalCount.Should().Be(2);
            result.TotalPages.Should().Be(2);
            result.HasNext.Should().BeTrue();
        }

        #endregion

        #region GetByIdAsync Tests

        [Fact]
        public async Task GetByIdAsync_WithExistingId_ReturnsProduct()
        {
            // Arrange
            var productId = 1;

            // Act
            var result = await _repository.GetByIdAsync(productId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(productId);
            result.Name.Should().Be("Heritage Boot");
            result.BrandName.Should().Be("Ariat");
            result.CategoryName.Should().Be("Boots");
        }

        [Fact]
        public async Task GetByIdAsync_WithNonExistingId_ReturnsNull()
        {
            // Arrange
            var productId = 999;

            // Act
            var result = await _repository.GetByIdAsync(productId);

            // Assert
            result.Should().BeNull();
        }

        #endregion

        #region CreateAsync Tests

        [Fact]
        public async Task CreateAsync_WithValidData_CreatesProduct()
        {
            // Arrange
            var createDto = new CreateProductDto
            {
                Name = "New Boot",
                Description = "Brand new boot",
                Price = 299.99m,
                BrandId = 1,
                CategoryId = 1
            };

            // Act
            var result = await _repository.CreateAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(createDto.Name);
            result.Price.Should().Be(createDto.Price);

            // Verify in database
            var dbProduct = await _context.Products.FindAsync(result.Id);
            dbProduct.Should().NotBeNull();
            dbProduct.Name.Should().Be(createDto.Name);
        }

        #endregion

        #region UpdateAsync Tests

        [Fact]
        public async Task UpdateAsync_WithExistingProduct_UpdatesProduct()
        {
            // Arrange
            var productId = 1;
            var updateDto = new UpdateProductDto
            {
                Name = "Updated Heritage Boot",
                Description = "Updated description",
                Price = 249.99m,
                BrandId = 1,
                CategoryId = 1,
                IsActive = true
            };

            // Act
            var result = await _repository.UpdateAsync(productId, updateDto);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(updateDto.Name);
            result.Price.Should().Be(updateDto.Price);

            // Verify in database
            var dbProduct = await _context.Products.FindAsync(productId);
            dbProduct.Name.Should().Be(updateDto.Name);
            dbProduct.Price.Should().Be(updateDto.Price);
        }

        [Fact]
        public async Task UpdateAsync_WithNonExistingProduct_ReturnsNull()
        {
            // Arrange
            var productId = 999;
            var updateDto = new UpdateProductDto
            {
                Name = "Non Existing",
                Description = "Test",
                Price = 99.99m,
                BrandId = 1,
                CategoryId = 1,
                IsActive = true
            };

            // Act
            var result = await _repository.UpdateAsync(productId, updateDto);

            // Assert
            result.Should().BeNull();
        }

        #endregion

        #region DeleteAsync Tests

        [Fact]
        public async Task DeleteAsync_WithExistingProduct_DeletesProduct()
        {
            // Arrange
            var productId = 1;

            // Act
            var result = await _repository.DeleteAsync(productId);

            // Assert
            result.Should().BeTrue();

            // Verify in database
            var dbProduct = await _context.Products.FindAsync(productId);
            dbProduct.Should().BeNull();
        }

        [Fact]
        public async Task DeleteAsync_WithNonExistingProduct_ReturnsFalse()
        {
            // Arrange
            var productId = 999;

            // Act
            var result = await _repository.DeleteAsync(productId);

            // Assert
            result.Should().BeFalse();
        }

        #endregion

        #region ExistsAsync Tests

        [Fact]
        public async Task ExistsAsync_WithExistingProduct_ReturnsTrue()
        {
            // Arrange
            var productId = 1;

            // Act
            var result = await _repository.ExistsAsync(productId);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task ExistsAsync_WithNonExistingProduct_ReturnsFalse()
        {
            // Arrange
            var productId = 999;

            // Act
            var result = await _repository.ExistsAsync(productId);

            // Assert
            result.Should().BeFalse();
        }

        #endregion

        #region UpdateMediaAsync Tests

        [Fact]
        public async Task UpdateMediaAsync_WithNewMedia_AddsMedia()
        {
            // Arrange
            var productId = 1;
            var mediaList = new List<MediaProductInputDto>
            {
                new MediaProductInputDto
                {
                    Value = "https://cdn.example.com/image1.jpg",
                    Order = 0,
                    IsPrimary = true,
                    MediaType = "image"
                },
                new MediaProductInputDto
                {
                    Value = "https://cdn.example.com/image2.jpg",
                    Order = 1,
                    IsPrimary = false,
                    MediaType = "image"
                }
            };

            // Act
            await _repository.UpdateMediaAsync(productId, mediaList);

            // Assert
            var mediaInDb = await _context.MediaProducts
                .Where(m => m.ProductId == productId)
                .OrderBy(m => m.Order)
                .ToListAsync();

            mediaInDb.Should().HaveCount(2);
            mediaInDb.First().Url.Should().Be("https://cdn.example.com/image1.jpg");
            mediaInDb.First().IsPrimary.Should().BeTrue();
        }

        [Fact]
        public async Task UpdateMediaAsync_WithExistingMedia_UpdatesMedia()
        {
            // Arrange
            var productId = 1;

            // Add initial media
            var initialMedia = new MediaProduct
            {
                ProductId = productId,
                Url = "https://cdn.example.com/old.jpg",
                Order = 0,
                IsPrimary = true
            };
            _context.MediaProducts.Add(initialMedia);
            await _context.SaveChangesAsync();

            var updatedMediaList = new List<MediaProductInputDto>
            {
                new MediaProductInputDto
                {
                    Id = initialMedia.Id,
                    Value = "https://cdn.example.com/updated.jpg",
                    Order = 0,
                    IsPrimary = true
                }
            };

            // Act
            await _repository.UpdateMediaAsync(productId, updatedMediaList);

            // Assert
            var mediaInDb = await _context.MediaProducts.FindAsync(initialMedia.Id);
            mediaInDb.Should().NotBeNull();
            mediaInDb.Url.Should().Be("https://cdn.example.com/updated.jpg");
        }

        [Fact]
        public async Task UpdateMediaAsync_RemovesMediaNotInList()
        {
            // Arrange
            var productId = 1;

            // Add initial media
            var media1 = new MediaProduct { ProductId = productId, Url = "url1.jpg", Order = 0 };
            var media2 = new MediaProduct { ProductId = productId, Url = "url2.jpg", Order = 1 };
            _context.MediaProducts.AddRange(media1, media2);
            await _context.SaveChangesAsync();

            // Only keep media1
            var updatedMediaList = new List<MediaProductInputDto>
            {
                new MediaProductInputDto
                {
                    Id = media1.Id,
                    Value = media1.Url,
                    Order = 0
                }
            };

            // Act
            await _repository.UpdateMediaAsync(productId, updatedMediaList);

            // Assert
            var mediaInDb = await _context.MediaProducts
                .Where(m => m.ProductId == productId)
                .ToListAsync();

            mediaInDb.Should().HaveCount(1);
            mediaInDb.First().Id.Should().Be(media1.Id);
        }

        #endregion

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
