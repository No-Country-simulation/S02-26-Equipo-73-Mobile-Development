using Application.DTOs.Horses;

namespace Application.Interfaces
{
    public interface IHorseService
    {
        Task<IEnumerable<HorseDto>> GetMyHorsesAsync(int ownerId);
        Task<HorseDto> GetMyHorseByIdAsync(int id, int ownerId);
        Task<HorseDto> CreateAsync(int ownerId, CreateHorseDto dto);
        Task<HorseDto> UpdateAsync(int id, int ownerId, UpdateHorseDto dto);
        Task DeleteAsync(int id, int ownerId);
        Task<HorseReferenceDto> GetReferenceDataAsync();
    }
}
