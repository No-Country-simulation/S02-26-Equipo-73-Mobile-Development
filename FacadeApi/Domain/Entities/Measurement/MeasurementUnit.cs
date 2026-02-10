namespace Domain.Entities.Measurement
{
    public class MeasurementUnit
    {
        public int Id { get; set; }

        public string Name { get; set; } // Centimeters, Inches
        public string Symbol { get; set; } // cm, in

        public decimal? ToBaseFactor { get; set; }
        // Para conversiones automáticas si se define unidad base
    }
}
