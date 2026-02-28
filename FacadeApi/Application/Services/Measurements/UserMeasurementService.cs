using Application.Common.Errors;
using Application.DTOs.Measurements;
using Application.Interfaces;
using Application.Interfaces.Repositories;

namespace Application.Services.Measurements
{
    public class UserMeasurementService : IUserMeasurementService
    {
        private readonly IUserMeasurementRepository _repository;

        public UserMeasurementService(IUserMeasurementRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<UserMeasurementDto>> GetMyMeasurementsAsync(int userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<UserMeasurementDto> GetMyMeasurementByIdAsync(int id, int userId)
        {
            var measurement = await _repository.GetByIdAsync(id);

            if (measurement is null)
                throw ApiErrorException.NotFound(ErrorCodes.MEASUREMENT_NOT_FOUND, "Measurement not found");

            if (!await _repository.BelongsToUserAsync(id, userId))
                throw ApiErrorException.Conflict(ErrorCodes.MEASUREMENT_FORBIDDEN, "Access denied to this measurement");

            return measurement;
        }

        public async Task<UserMeasurementDto> CreateAsync(int userId, CreateUserMeasurementDto dto)
        {
            return await _repository.CreateAsync(userId, dto);
        }

        public async Task<UserMeasurementDto> UpdateAsync(int id, int userId, UpdateUserMeasurementDto dto)
        {
            if (!await _repository.ExistsAsync(id))
                throw ApiErrorException.NotFound(ErrorCodes.MEASUREMENT_NOT_FOUND, "Measurement not found");

            if (!await _repository.BelongsToUserAsync(id, userId))
                throw ApiErrorException.Conflict(ErrorCodes.MEASUREMENT_FORBIDDEN, "Access denied to this measurement");

            return await _repository.UpdateAsync(id, dto)
                ?? throw ApiErrorException.NotFound(ErrorCodes.MEASUREMENT_NOT_FOUND, "Measurement not found");
        }

        public async Task DeleteAsync(int id, int userId)
        {
            if (!await _repository.ExistsAsync(id))
                throw ApiErrorException.NotFound(ErrorCodes.MEASUREMENT_NOT_FOUND, "Measurement not found");

            if (!await _repository.BelongsToUserAsync(id, userId))
                throw ApiErrorException.Conflict(ErrorCodes.MEASUREMENT_FORBIDDEN, "Access denied to this measurement");

            await _repository.DeleteAsync(id);
        }
    }
}
