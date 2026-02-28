using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Measurements
{
    public class CreateUserMeasurementDto
    {
        [Required(ErrorMessage = "MeasurementTypeId is required")]
        public int MeasurementTypeId { get; set; }

        [Required(ErrorMessage = "Value is required")]
        [Range(0.01, 9999.99, ErrorMessage = "Value must be between 0.01 and 9999.99")]
        public decimal Value { get; set; }

        [Required(ErrorMessage = "UnitId is required")]
        public int UnitId { get; set; }
    }
}
