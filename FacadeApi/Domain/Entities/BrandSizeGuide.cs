namespace Domain.Entities
{
    /// <summary>
    /// Guía de tallas por marca/categoría con conversiones entre sistemas y medidas reales
    /// </summary>
    public class BrandSizeGuide
    {
        public int Id { get; set; }

        public int BrandId { get; set; }
        public virtual Brand Brand { get; set; }

        /// <summary>
        /// Categoría a la que aplica (null = todas las categorías de esa marca)
        /// </summary>
        public int? CategoryId { get; set; }
        public virtual ProductCategory? Category { get; set; }

        /// <summary>
        /// Talla en sistema EU (referencia base)
        /// </summary>
        public string EuLabel { get; set; }

        /// <summary>
        /// Equivalencia en sistema US
        /// </summary>
        public string? UsLabel { get; set; }

        /// <summary>
        /// Equivalencia en sistema UK
        /// </summary>
        public string? UkLabel { get; set; }

        /// <summary>
        /// Largo de pie mínimo en cm
        /// </summary>
        public decimal? FootLengthMinCm { get; set; }

        /// <summary>
        /// Largo de pie máximo en cm
        /// </summary>
        public decimal? FootLengthMaxCm { get; set; }
    }
}
