using Domain.Enums;

namespace Domain.Entities.Horse
{
    public class HorseMeasurement
    {
        public int Id { get; set; }
        public decimal? WithersHeight { get; set; }
        public decimal? BackLength { get; set; }
        public decimal? ChestCircumference { get; set; }
        public decimal? WithersWidth { get; set; }
        public decimal? NeckLength { get; set; }
        public decimal? CannonCircumference { get; set; }
        public decimal? HeadLength { get; set; }

        public BackType? BackType { get; set; }
        public WithersType? WithersType { get; set; }
        public ShoulderType? ShoulderType { get; set; }
    }
}
