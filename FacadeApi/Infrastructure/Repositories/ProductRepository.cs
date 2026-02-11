using Application.DTOs.Common;
using Application.DTOs.Products;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Domain.Entities.Products;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ProductDto>> GetAllAsync(ProductFilterDto filter)
        {
            var query = _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.BrandSize)
                .AsQueryable();

            // Aplicar filtros
            if (filter.BrandId.HasValue)
            {
                query = query.Where(p => p.BrandId == filter.BrandId.Value);
            }

            if (filter.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == filter.CategoryId.Value);
            }

            if (filter.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);
            }

            if (filter.BrandSizeId.HasValue)
            {
                query = query.Where(p => p.Variants.Any(v => v.BrandSizeId == filter.BrandSizeId.Value));
            }

            // Contar total antes de paginar
            var totalCount = await query.CountAsync();

            // Aplicar ordenamiento
            query = filter.SortBy switch
            {
                ProductSortBy.Name => filter.SortDescending 
                    ? query.OrderByDescending(p => p.Name) 
                    : query.OrderBy(p => p.Name),
                ProductSortBy.Price => filter.SortDescending 
                    ? query.OrderByDescending(p => p.Price) 
                    : query.OrderBy(p => p.Price),
                ProductSortBy.Brand => filter.SortDescending 
                    ? query.OrderByDescending(p => p.Brand.Name) 
                    : query.OrderBy(p => p.Brand.Name),
                _ => query.OrderBy(p => p.Id)
            };

            // Aplicar paginación
            var products = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    IsActive = p.IsActive,
                    BrandId = p.BrandId,
                    BrandName = p.Brand.Name,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    Variants = p.Variants.Select(v => new ProductVariantDto
                    {
                        Id = v.Id,
                        ProductId = v.ProductId,
                        BrandSizeId = v.BrandSizeId,
                        SizeLabel = v.BrandSize.Label,
                        Price = v.Price,
                        Stock = v.Stock,
                        IsActive = v.IsActive
                    }).ToList()
                })
                .ToListAsync();

            return new PagedResult<ProductDto>
            {
                Items = products,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.BrandSize)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return null;

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                IsActive = product.IsActive,
                BrandId = product.BrandId,
                BrandName = product.Brand.Name,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                Variants = product.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    ProductId = v.ProductId,
                    BrandSizeId = v.BrandSizeId,
                    SizeLabel = v.BrandSize.Label,
                    Price = v.Price,
                    Stock = v.Stock,
                    IsActive = v.IsActive
                }).ToList()
            };
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto createDto)
        {
            var product = new Product
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Price = createDto.Price,
                BrandId = createDto.BrandId,
                CategoryId = createDto.CategoryId,
                IsActive = true
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(product.Id);
        }

        public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto updateDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return null;

            product.Name = updateDto.Name;
            product.Description = updateDto.Description;
            product.Price = updateDto.Price;
            product.BrandId = updateDto.BrandId;
            product.CategoryId = updateDto.CategoryId;
            product.IsActive = updateDto.IsActive;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Products.AnyAsync(p => p.Id == id);
        }
    }
}
