using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Horses
{
    public class UpdateHorseDto
    {
        [MaxLength(100, ErrorMessage = "Name must not exceed 100 characters")]
        public string? Name { get; set; }

        public DateTime? BirthDate { get; set; }
        public HorseSex? Sex { get; set; }
        public int? BreedId { get; set; }
        public int? DisciplineId { get; set; }
        public int? LevelId { get; set; }
        public bool? IsActive { get; set; }

        public UpdateHorseMeasurementDto? Measurement { get; set; }
    }

    public class UpdateHorseMeasurementDto
    {
        [Range(0.01, 999.99)] public decimal? WithersHeight { get; set; }
        [Range(0.01, 999.99)] public decimal? BackLength { get; set; }
        [Range(0.01, 999.99)] public decimal? ChestCircumference { get; set; }
        [Range(0.01, 999.99)] public decimal? WithersWidth { get; set; }
        [Range(0.01, 999.99)] public decimal? NeckLength { get; set; }
        [Range(0.01, 999.99)] public decimal? CannonCircumference { get; set; }
        [Range(0.01, 999.99)] public decimal? HeadLength { get; set; }
        public BackType? BackType { get; set; }
        public WithersType? WithersType { get; set; }
        public ShoulderType? ShoulderType { get; set; }
    }
}
