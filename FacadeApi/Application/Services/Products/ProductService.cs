using Application.Common.Errors;
using Application.DTOs.Common;
using Application.DTOs.Products;
using Application.Interfaces.Repositories;
using System.Net;

namespace Application.Services.Products
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<PagedResult<ProductDto>> GetAllProductsAsync(ProductFilterDto filter)
        {
            return await _productRepository.GetAllAsync(filter);
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
                throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND, 
                    $"Product with ID {id} not found");

            return product;
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto)
        {
            try
            {
                return await _productRepository.CreateAsync(createDto);
            }
            catch (Exception ex)
            {
                throw ApiErrorException.InternalServerError(ErrorCodes.PRODUCT_CREATE_FAILED, 
                    $"Failed to create product: {ex.Message}");
            }
        }

        public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateDto)
        {
            var exists = await _productRepository.ExistsAsync(id);
            if (!exists)
                throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND, 
                    $"Product with ID {id} not found");

            try
            {
                return await _productRepository.UpdateAsync(id, updateDto);
            }
            catch (Exception ex)
            {
                throw ApiErrorException.InternalServerError(ErrorCodes.PRODUCT_UPDATE_FAILED, 
                    $"Failed to update product: {ex.Message}");
            }
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var exists = await _productRepository.ExistsAsync(id);
            if (!exists)
                throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND, 
                    $"Product with ID {id} not found");

            try
            {
                return await _productRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                throw ApiErrorException.InternalServerError(ErrorCodes.PRODUCT_DELETE_FAILED, 
                    $"Failed to delete product: {ex.Message}");
            }
        }
    }
}
