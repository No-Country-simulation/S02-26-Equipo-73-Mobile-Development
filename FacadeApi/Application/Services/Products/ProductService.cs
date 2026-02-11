using Application.DTOs.Common;
using Application.DTOs.Products;
using Application.Interfaces.Repositories;

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
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto)
        {
            return await _productRepository.CreateAsync(createDto);
        }

        public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateDto)
        {
            var exists = await _productRepository.ExistsAsync(id);
            if (!exists)
                return null;

            return await _productRepository.UpdateAsync(id, updateDto);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.DeleteAsync(id);
        }
    }
}
