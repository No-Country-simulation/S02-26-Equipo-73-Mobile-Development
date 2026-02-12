namespace Application.DTOs.Products
{
    /// <summary>
    /// Product response DTO (GET operations)
    /// </summary>
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }

        /// <summary>
        /// Product images/media (returns URLs)
        /// </summary>
        public List<MediaProductDto> Media { get; set; } = new();

        public List<ProductVariantDto> Variants { get; set; } = new();
    }
}
