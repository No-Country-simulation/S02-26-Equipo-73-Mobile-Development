using Application.Common.Errors;
using Application.DTOs.Common;
using Application.DTOs.Products;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Services.Products;
using AutoFixture;
using FluentAssertions;
using Moq;
using Xunit;

namespace UnitTest.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockRepository;
        private readonly Mock<IStorageService> _mockStorageService;
        private readonly ProductService _service;
        private readonly Fixture _fixture;

        public ProductServiceTests()
        {
            _mockRepository = new Mock<IProductRepository>();
            _mockStorageService = new Mock<IStorageService>();
            _service = new ProductService(_mockRepository.Object, _mockStorageService.Object);
            _fixture = new Fixture();
        }

        #region GetAllProductsAsync Tests

        [Fact]
        public async Task GetAllProductsAsync_WithValidFilter_ReturnsPagedResult()
        {
            // Arrange
            var filter = new ProductFilterDto
            {
                PageNumber = 1,
                PageSize = 10
            };

            var expectedResult = new PagedResult<ProductDto>
            {
                Items = _fixture.CreateMany<ProductDto>(5).ToList(),
                TotalCount = 5,
                PageNumber = 1,
                PageSize = 10
            };

            _mockRepository
                .Setup(r => r.GetAllAsync(filter))
                .ReturnsAsync(expectedResult);

            // Act
            var result = await _service.GetAllProductsAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(5);
            result.TotalCount.Should().Be(5);
            _mockRepository.Verify(r => r.GetAllAsync(filter), Times.Once);
        }

        [Fact]
        public async Task GetAllProductsAsync_WithEmptyResult_ReturnsEmptyPagedResult()
        {
            // Arrange
            var filter = new ProductFilterDto();
            var emptyResult = new PagedResult<ProductDto>
            {
                Items = new List<ProductDto>(),
                TotalCount = 0,
                PageNumber = 1,
                PageSize = 10
            };

            _mockRepository
                .Setup(r => r.GetAllAsync(filter))
                .ReturnsAsync(emptyResult);

            // Act
            var result = await _service.GetAllProductsAsync(filter);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().BeEmpty();
            result.TotalCount.Should().Be(0);
        }

        #endregion

        #region GetProductByIdAsync Tests

        [Fact]
        public async Task GetProductByIdAsync_WithExistingId_ReturnsProduct()
        {
            // Arrange
            var productId = 1;
            var expectedProduct = _fixture.Create<ProductDto>();

            _mockRepository
                .Setup(r => r.GetByIdAsync(productId))
                .ReturnsAsync(expectedProduct);

            // Act
            var result = await _service.GetProductByIdAsync(productId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedProduct);
            _mockRepository.Verify(r => r.GetByIdAsync(productId), Times.Once);
        }

        [Fact]
        public async Task GetProductByIdAsync_WithNonExistingId_ThrowsNotFoundException()
        {
            // Arrange
            var productId = 999;

            _mockRepository
                .Setup(r => r.GetByIdAsync(productId))
                .ReturnsAsync((ProductDto)null);

            // Act
            Func<Task> act = async () => await _service.GetProductByIdAsync(productId);

            // Assert
            await act.Should().ThrowAsync<ApiErrorException>()
                .Where(e => e.ErrorResponse.ErrorCode == ErrorCodes.PRODUCT_NOT_FOUND);
        }

        #endregion

        #region CreateProductAsync Tests

        [Fact]
        public async Task CreateProductAsync_WithValidData_ReturnsCreatedProduct()
        {
            // Arrange
            var createDto = new CreateProductDto
            {
                Name = "Test Product",
                Description = "Test Description",
                Price = 99.99m,
                BrandId = 1,
                CategoryId = 1,
                Media = new List<MediaProductInputDto>()
            };

            var expectedProduct = _fixture.Build<ProductDto>()
                .With(p => p.Name, createDto.Name)
                .Create();

            _mockRepository
                .Setup(r => r.CreateAsync(createDto))
                .ReturnsAsync(expectedProduct);

            // Act
            var result = await _service.CreateProductAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(createDto.Name);
            _mockRepository.Verify(r => r.CreateAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task CreateProductAsync_WithBase64Image_UploadsAndCreatesProduct()
        {
            // Arrange
            var createDto = new CreateProductDto
            {
                Name = "Product with Image",
                Description = "Description",
                Price = 199.99m,
                BrandId = 1,
                CategoryId = 1,
                Media = new List<MediaProductInputDto>
                {
                    new MediaProductInputDto
                    {
                        Value = "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
                        Order = 0,
                        IsPrimary = true
                    }
                }
            };

            var uploadedUrl = "https://cdn.example.com/products/image.jpg";
            var createdProduct = _fixture.Create<ProductDto>();

            _mockStorageService
                .Setup(s => s.ProcessImageUrlAsync(It.IsAny<string>(), "products"))
                .ReturnsAsync(uploadedUrl);

            _mockRepository
                .Setup(r => r.CreateAsync(createDto))
                .ReturnsAsync(createdProduct);

            _mockRepository
                .Setup(r => r.UpdateMediaAsync(It.IsAny<int>(), It.IsAny<List<MediaProductInputDto>>()))
                .Returns(Task.CompletedTask);

            _mockRepository
                .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(createdProduct);

            // Act
            var result = await _service.CreateProductAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            _mockStorageService.Verify(s => s.ProcessImageUrlAsync(It.IsAny<string>(), "products"), Times.Once);
            _mockRepository.Verify(r => r.UpdateMediaAsync(It.IsAny<int>(), It.IsAny<List<MediaProductInputDto>>()), Times.Once);
        }

        [Fact]
        public async Task CreateProductAsync_WithExistingUrl_DoesNotUpload()
        {
            // Arrange
            var createDto = new CreateProductDto
            {
                Name = "Product with URL",
                Description = "Description",
                Price = 299.99m,
                BrandId = 1,
                CategoryId = 1,
                Media = new List<MediaProductInputDto>
                {
                    new MediaProductInputDto
                    {
                        Value = "https://cdn.example.com/existing-image.jpg",
                        Order = 0,
                        IsPrimary = true
                    }
                }
            };

            var createdProduct = _fixture.Create<ProductDto>();

            _mockRepository
                .Setup(r => r.CreateAsync(createDto))
                .ReturnsAsync(createdProduct);

            _mockRepository
                .Setup(r => r.UpdateMediaAsync(It.IsAny<int>(), It.IsAny<List<MediaProductInputDto>>()))
                .Returns(Task.CompletedTask);

            _mockRepository
                .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(createdProduct);

            // Act
            var result = await _service.CreateProductAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            _mockStorageService.Verify(s => s.ProcessImageUrlAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        #endregion

        #region UpdateProductAsync Tests

        [Fact]
        public async Task UpdateProductAsync_WithExistingProduct_ReturnsUpdatedProduct()
        {
            // Arrange
            var productId = 1;
            var updateDto = new UpdateProductDto
            {
                Name = "Updated Product",
                Description = "Updated Description",
                Price = 149.99m,
                BrandId = 1,
                CategoryId = 1,
                IsActive = true,
                Media = new List<MediaProductInputDto>()
            };

            var updatedProduct = _fixture.Build<ProductDto>()
                .With(p => p.Id, productId)
                .With(p => p.Name, updateDto.Name)
                .Create();

            _mockRepository
                .Setup(r => r.ExistsAsync(productId))
                .ReturnsAsync(true);

            _mockRepository
                .Setup(r => r.UpdateAsync(productId, updateDto))
                .ReturnsAsync(updatedProduct);

            _mockRepository
                .Setup(r => r.UpdateMediaAsync(productId, It.IsAny<List<MediaProductInputDto>>()))
                .Returns(Task.CompletedTask);

            _mockRepository
                .Setup(r => r.GetByIdAsync(productId))
                .ReturnsAsync(updatedProduct);

            // Act
            var result = await _service.UpdateProductAsync(productId, updateDto);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(updateDto.Name);
            _mockRepository.Verify(r => r.UpdateAsync(productId, updateDto), Times.Once);
        }

        [Fact]
        public async Task UpdateProductAsync_WithNonExistingProduct_ThrowsNotFoundException()
        {
            // Arrange
            var productId = 999;
            var updateDto = new UpdateProductDto
            {
                Name = "Updated Product",
                Description = "Updated Description",
                Price = 149.99m,
                BrandId = 1,
                CategoryId = 1,
                IsActive = true
            };

            _mockRepository
                .Setup(r => r.ExistsAsync(productId))
                .ReturnsAsync(false);

            // Act
            Func<Task> act = async () => await _service.UpdateProductAsync(productId, updateDto);

            // Assert
            await act.Should().ThrowAsync<ApiErrorException>()
                .Where(e => e.ErrorResponse.ErrorCode == ErrorCodes.PRODUCT_NOT_FOUND);
        }

        [Fact]
        public async Task UpdateProductAsync_WithNewImage_UploadsImage()
        {
            // Arrange
            var productId = 1;
            var updateDto = new UpdateProductDto
            {
                Name = "Updated Product",
                Description = "Updated",
                Price = 199.99m,
                BrandId = 1,
                CategoryId = 1,
                IsActive = true,
                Media = new List<MediaProductInputDto>
                {
                    new MediaProductInputDto
                    {
                        Value = "data:image/jpeg;base64,NEW_IMAGE",
                        Order = 0,
                        IsPrimary = true
                    }
                }
            };

            var uploadedUrl = "https://cdn.example.com/products/new-image.jpg";
            var updatedProduct = _fixture.Create<ProductDto>();

            _mockRepository.Setup(r => r.ExistsAsync(productId)).ReturnsAsync(true);
            _mockStorageService.Setup(s => s.ProcessImageUrlAsync(It.IsAny<string>(), "products")).ReturnsAsync(uploadedUrl);
            _mockRepository.Setup(r => r.UpdateAsync(productId, updateDto)).ReturnsAsync(updatedProduct);
            _mockRepository.Setup(r => r.UpdateMediaAsync(productId, It.IsAny<List<MediaProductInputDto>>())).Returns(Task.CompletedTask);
            _mockRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(updatedProduct);

            // Act
            var result = await _service.UpdateProductAsync(productId, updateDto);

            // Assert
            result.Should().NotBeNull();
            _mockStorageService.Verify(s => s.ProcessImageUrlAsync(It.IsAny<string>(), "products"), Times.Once);
        }

        #endregion

        #region DeleteProductAsync Tests

        [Fact]
        public async Task DeleteProductAsync_WithExistingProduct_ReturnsTrue()
        {
            // Arrange
            var productId = 1;

            _mockRepository
                .Setup(r => r.ExistsAsync(productId))
                .ReturnsAsync(true);

            _mockRepository
                .Setup(r => r.DeleteAsync(productId))
                .ReturnsAsync(true);

            // Act
            var result = await _service.DeleteProductAsync(productId);

            // Assert
            result.Should().BeTrue();
            _mockRepository.Verify(r => r.DeleteAsync(productId), Times.Once);
        }

        [Fact]
        public async Task DeleteProductAsync_WithNonExistingProduct_ThrowsNotFoundException()
        {
            // Arrange
            var productId = 999;

            _mockRepository
                .Setup(r => r.ExistsAsync(productId))
                .ReturnsAsync(false);

            // Act
            Func<Task> act = async () => await _service.DeleteProductAsync(productId);

            // Assert
            await act.Should().ThrowAsync<ApiErrorException>()
                .Where(e => e.ErrorResponse.ErrorCode == ErrorCodes.PRODUCT_NOT_FOUND);

            _mockRepository.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
        }

        #endregion
    }
}
