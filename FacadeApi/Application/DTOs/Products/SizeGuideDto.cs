namespace Application.DTOs.Products
{
    public class SizeGuideDto
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public List<SizeGuideEntryDto> Sizes { get; set; } = new();
    }

    public class SizeGuideEntryDto
    {
        public string EuLabel { get; set; }
        public string? UsLabel { get; set; }
        public string? UkLabel { get; set; }

        // Medidas en cm
        public decimal? FootLengthMinCm { get; set; }
        public decimal? FootLengthMaxCm { get; set; }

        // Medidas en pulgadas (calculadas automáticamente)
        public decimal? FootLengthMinIn => FootLengthMinCm.HasValue
            ? Math.Round(FootLengthMinCm.Value / 2.54m, 2)
            : null;

        public decimal? FootLengthMaxIn => FootLengthMaxCm.HasValue
            ? Math.Round(FootLengthMaxCm.Value / 2.54m, 2)
            : null;
    }
}
