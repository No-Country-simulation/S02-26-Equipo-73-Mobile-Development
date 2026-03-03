namespace Domain.Entities.Products
{
    public class ProductVariant
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int BrandSizeId { get; set; }
        public BrandSize BrandSize { get; set; }

        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }

        public string? Color { get; set; }
        public string? Material { get; set; }

        /// <summary>
        /// Weight in grams
        /// </summary>
        public decimal? Weight { get; set; }
    }
}
