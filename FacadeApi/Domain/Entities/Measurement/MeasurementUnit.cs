namespace Domain.Entities.Measurement
{
    /// <summary>
    /// Unit of measurement (cm, inches, etc.)
    /// </summary>
    public class MeasurementUnit
    {
        public int Id { get; set; }

        /// <summary>
        /// Name of the unit (e.g., "Centimeters", "Inches")
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Symbol of the unit (e.g., "cm", "in")
        /// </summary>
        public string Symbol { get; set; }

        /// <summary>
        /// Conversion factor to base unit for automatic conversions
        /// Example: if base is cm, inches would be 2.54
        /// </summary>
        public decimal? ToBaseFactor { get; set; }
    }
}
