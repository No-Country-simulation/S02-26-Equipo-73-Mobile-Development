using Application.DTOs.Measurements;

namespace Application.Interfaces.Repositories
{
    public interface IMeasurementReferenceRepository
    {
        Task<MeasurementReferenceDto> GetReferenceDataAsync();
    }
}
