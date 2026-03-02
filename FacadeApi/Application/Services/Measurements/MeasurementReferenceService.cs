using Application.DTOs.Measurements;
using Application.Interfaces;
using Application.Interfaces.Repositories;


namespace Infrastructure.Services
{
    public class MeasurementReferenceService : IMeasurementReferenceService
    {   
        private readonly IMeasurementReferenceRepository _measurementReferenceRepository; 
        public MeasurementReferenceService(IMeasurementReferenceRepository measurementReferenceRepository)
        {
            _measurementReferenceRepository = measurementReferenceRepository;
        }
        public async Task<MeasurementReferenceDto> GetReferenceDataAsync()
        {
            return await _measurementReferenceRepository.GetReferenceDataAsync();
        }
    }
}
