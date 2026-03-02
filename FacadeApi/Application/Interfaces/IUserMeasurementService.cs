using Application.DTOs.Measurements;

namespace Application.Interfaces
{
    public interface IUserMeasurementService
    {
        Task<IEnumerable<UserMeasurementDto>> GetMyMeasurementsAsync(int userId);
        Task<UserMeasurementDto> GetMyMeasurementByIdAsync(int id, int userId);
        Task<UserMeasurementDto> CreateAsync(int userId, CreateUserMeasurementDto dto);
        Task<UserMeasurementDto> UpdateAsync(int id, int userId, UpdateUserMeasurementDto dto);
        Task DeleteAsync(int id, int userId);
    }
}
