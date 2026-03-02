using Application.DTOs.Measurements;

namespace Application.Interfaces.Repositories
{
    public interface IUserMeasurementRepository
    {
        Task<IEnumerable<UserMeasurementDto>> GetByUserIdAsync(int userId);
        Task<UserMeasurementDto?> GetByIdAsync(int id);
        Task<UserMeasurementDto> CreateAsync(int userId, CreateUserMeasurementDto dto);
        Task<UserMeasurementDto?> UpdateAsync(int id, UpdateUserMeasurementDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> BelongsToUserAsync(int id, int userId);
    }
}
