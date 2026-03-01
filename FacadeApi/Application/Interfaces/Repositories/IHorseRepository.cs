using Application.DTOs.Horses;

namespace Application.Interfaces.Repositories
{
    public interface IHorseRepository
    {
        Task<IEnumerable<HorseDto>> GetByOwnerIdAsync(int ownerId);
        Task<HorseDto?> GetByIdAsync(int id);
        Task<HorseDto> CreateAsync(int ownerId, CreateHorseDto dto);
        Task<HorseDto?> UpdateAsync(int id, UpdateHorseDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> BelongsToOwnerAsync(int id, int ownerId);
    }
}
