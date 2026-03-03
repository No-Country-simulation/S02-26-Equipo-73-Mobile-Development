namespace Application.DTOs.Products
{
    public class ProductVariantDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }

        // Size info descriptiva (no expone el ID interno)
        public string SizeLabel { get; set; }
        public string SizeSystem { get; set; }

        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }

        public string? Color { get; set; }
        public string? Material { get; set; }

        /// <summary>
        /// Peso en gramos
        /// </summary>
        public decimal? Weight { get; set; }
    }
}
