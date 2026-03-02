namespace Application.DTOs.Measurements
{
    public class UserMeasurementDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public int MeasurementTypeId { get; set; }
        public string MeasurementTypeName { get; set; }
        public string EntityTypeName { get; set; }

        public decimal Value { get; set; }

        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public string UnitSymbol { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
