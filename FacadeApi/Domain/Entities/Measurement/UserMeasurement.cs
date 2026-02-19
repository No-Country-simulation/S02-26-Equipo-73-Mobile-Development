namespace Domain.Entities.Measurement
{
    /// <summary>
    /// Stores user-specific measurements for recommendations
    /// </summary>
    public class UserMeasurement
    {
        public int Id { get; set; }
        
        /// <summary>
        /// User ID (from authentication system)
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// Type of measurement (Foot Length, Calf Width, etc.)
        /// </summary>
        public int MeasurementTypeId { get; set; }
        public virtual MeasurementType MeasurementType { get; set; }
        
        /// <summary>
        /// Measurement value
        /// </summary>
        public decimal Value { get; set; }
        
        /// <summary>
        /// Unit of measurement
        /// </summary>
        public int UnitId { get; set; }
        public virtual MeasurementUnit Unit { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
