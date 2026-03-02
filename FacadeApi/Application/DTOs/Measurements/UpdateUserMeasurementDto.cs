using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Measurements
{
    public class UpdateUserMeasurementDto
    {
        [Range(0.01, 9999.99, ErrorMessage = "Value must be between 0.01 and 9999.99")]
        public decimal? Value { get; set; }

        public int? UnitId { get; set; }
    }
}
