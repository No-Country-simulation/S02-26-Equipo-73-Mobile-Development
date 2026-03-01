using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Horses
{
    public class CreateHorseDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(100, ErrorMessage = "Name must not exceed 100 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "BirthDate is required")]
        public DateTime BirthDate { get; set; }

        [Required(ErrorMessage = "Sex is required")]
        public HorseSex Sex { get; set; }

        [Required(ErrorMessage = "BreedId is required")]
        public int BreedId { get; set; }

        [Required(ErrorMessage = "DisciplineId is required")]
        public int DisciplineId { get; set; }

        [Required(ErrorMessage = "LevelId is required")]
        public int LevelId { get; set; }

        public CreateHorseMeasurementDto? Measurement { get; set; }
    }

    public class CreateHorseMeasurementDto
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
