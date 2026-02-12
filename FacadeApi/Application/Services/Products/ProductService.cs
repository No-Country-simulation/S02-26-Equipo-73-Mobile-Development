using Application.Common.Errors;
using Application.DTOs.Common;
using Application.DTOs.Products;
using Application.Helpers;
using Application.Interfaces;
using Application.Interfaces.Repositories;

namespace Application.Services.Products
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IStorageService _storageService;

        public ProductService(
            IProductRepository productRepository,
            IStorageService storageService)
        {
            _productRepository = productRepository;
            _storageService = storageService;
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
                // Process images
                var processedMedia = await ProcessMediaAsync(createDto.Media);

                var product = await _productRepository.CreateAsync(createDto);

                // Save processed media URLs
                if (processedMedia.Any())
                {
                    await _productRepository.UpdateMediaAsync(product.Id, processedMedia);

                    // Reload product with media
                    product = await _productRepository.GetByIdAsync(product.Id);
                }

                return product;
            }
            catch (Exception ex) when (ex is not ApiErrorException)
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
                // Process images (new base64 or existing URLs)
                var processedMedia = await ProcessMediaAsync(updateDto.Media);

                var product = await _productRepository.UpdateAsync(id, updateDto);

                // Update media
                await _productRepository.UpdateMediaAsync(id, processedMedia);

                // Reload product with updated media
                return await _productRepository.GetByIdAsync(id);
            }
            catch (Exception ex) when (ex is not ApiErrorException)
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

        /// <summary>
        /// Processes media input (base64 or URLs)
        /// - If Value is a URL: keep it (existing image)
        /// - If Value is base64: upload it and return new URL
        /// </summary>
        private async Task<List<MediaProductInputDto>> ProcessMediaAsync(
            List<MediaProductInputDto> mediaInputs)
        {
            var processedMedia = new List<MediaProductInputDto>();
            const string folder = "products";

            foreach (var media in mediaInputs)
            {
                if (string.IsNullOrWhiteSpace(media.Value))
                    continue;

                // If it's already a URL, keep it (no update needed)
                if (media.Value.IsUrl())
                {
                    processedMedia.Add(media);
                    continue;
                }

                // It's base64, upload it
                try
                {
                    // ProcessImageUrlAsync returns the full URL after upload
                    var uploadedUrl = await _storageService.ProcessImageUrlAsync(
                        media.Value,
                        folder);

                    processedMedia.Add(new MediaProductInputDto
                    {
                        Id = media.Id,
                        Value = uploadedUrl,
                        MediaType = media.MediaType,
                        Order = media.Order,
                        IsPrimary = media.IsPrimary
                    });
                }
                catch (Exception ex)
                {
                    throw ApiErrorException.InternalServerError(
                        ErrorCodes.EXTERNAL_SERVICE_ERROR,
                        $"Failed to upload image: {ex.Message}");
                }
            }

            return processedMedia;
        }
    }
}
