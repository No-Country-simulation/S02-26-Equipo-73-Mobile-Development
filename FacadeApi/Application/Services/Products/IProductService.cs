using Application.DTOs.Common;
using Application.DTOs.Products;

namespace Application.Services.Products
{
    public interface IProductService
    {
        Task<PagedResult<ProductDto>> GetAllProductsAsync(ProductFilterDto filter);
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto createDto);
        Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateDto);
        Task<bool> DeleteProductAsync(int id);
    }
}
