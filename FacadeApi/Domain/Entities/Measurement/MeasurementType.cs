namespace Domain.Entities.Measurement
{
    /// <summary>
    /// Type of measurement (Foot Length, Calf Width, Seat Size, etc.)
    /// </summary>
    public class MeasurementType
    {
        public int Id { get; set; }

        /// <summary>
        /// Name of the measurement type (e.g., "Foot Length", "Calf Width")
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Entity type ID (references MeasurementEntity)
        /// </summary>
        public int EntityTypeId { get; set; }
        public virtual MeasurementEntity EntityType { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
