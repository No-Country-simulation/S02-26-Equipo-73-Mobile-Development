using Application.DTOs.Common;
using Application.DTOs.Products;

namespace Application.Interfaces.Repositories
{
    public interface IProductRepository
    {
        Task<PagedResult<ProductDto>> GetAllAsync(ProductFilterDto filter);
        Task<ProductDto?> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(CreateProductDto createDto);
        Task<ProductDto?> UpdateAsync(int id, UpdateProductDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
