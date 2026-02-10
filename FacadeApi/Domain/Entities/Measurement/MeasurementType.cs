namespace Domain.Entities.Measurement
{
    public class MeasurementType
    {
        public int Id { get; set; }

        public string Name { get; set; }
        // Foot Length, Calf Width, Seat Size, Rider Height, etc

        public string EntityType { get; set; }
        // Rider, Horse, Product
    }
}
