namespace Application.DTOs.Horses
{
    public class HorseMeasurementDto
    {
        public int Id { get; set; }
        public decimal? WithersHeight { get; set; }
        public decimal? BackLength { get; set; }
        public decimal? ChestCircumference { get; set; }
        public decimal? WithersWidth { get; set; }
        public decimal? NeckLength { get; set; }
        public decimal? CannonCircumference { get; set; }
        public decimal? HeadLength { get; set; }

        public string? BackType { get; set; }
        public string? WithersType { get; set; }
        public string? ShoulderType { get; set; }
    }
}
