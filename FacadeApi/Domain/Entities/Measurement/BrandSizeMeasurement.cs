namespace Domain.Entities.Measurement
{
    public class BrandSizeMeasurement
    {
        public int Id { get; set; }

        public int BrandSizeId { get; set; }
        public BrandSize BrandSize { get; set; }

        public int MeasurementTypeId { get; set; }
        public MeasurementType MeasurementType { get; set; }

        public decimal MinValue { get; set; }
        public decimal MaxValue { get; set; }

        public int UnitId { get; set; }
        public MeasurementUnit Unit { get; set; }
    }
}
