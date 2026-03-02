using Application.DTOs.Horses;

namespace Application.Interfaces.Repositories
{
    public interface IHorseReferenceRepository
    {
        Task<IEnumerable<BreedDto>> GetBreedsAsync();
        Task<IEnumerable<DisciplineDto>> GetDisciplinesAsync();
        Task<IEnumerable<HorseLevelDto>> GetLevelsAsync();
    }
}
