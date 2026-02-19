namespace Domain.Entities.Measurement
{
    /// <summary>
    /// Represents an entity type that can have measurements (Rider, Horse, Product)
    /// </summary>
    public class MeasurementEntity
    {
        public int Id { get; set; }
        
        /// <summary>
        /// Name of the entity (e.g., "Rider", "Horse", "Product")
        /// </summary>
        public string Name { get; set; }
        
        /// <summary>
        /// Description of the entity type
        /// </summary>
        public string? Description { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation property
        public virtual ICollection<MeasurementType> MeasurementTypes { get; set; }
    }
}
