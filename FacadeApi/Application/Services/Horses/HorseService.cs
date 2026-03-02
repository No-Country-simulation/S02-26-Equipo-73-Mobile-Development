using Application.Common.Errors;
using Application.DTOs.Horses;
using Application.Interfaces;
using Application.Interfaces.Repositories;

namespace Application.Services.Horses
{
    public class HorseService : IHorseService
    {
        private readonly IHorseRepository _repository;
        private readonly IHorseReferenceRepository _referenceRepository;

        public HorseService(IHorseRepository repository, IHorseReferenceRepository referenceRepository)
        {
            _repository = repository;
            _referenceRepository = referenceRepository;
        }

        public async Task<IEnumerable<HorseDto>> GetMyHorsesAsync(int ownerId)
        {
            return await _repository.GetByOwnerIdAsync(ownerId);
        }

        public async Task<HorseDto> GetMyHorseByIdAsync(int id, int ownerId)
        {
            var horse = await _repository.GetByIdAsync(id);

            if (horse is null)
                throw ApiErrorException.NotFound(ErrorCodes.HORSE_NOT_FOUND, "Horse not found");

            if (!await _repository.BelongsToOwnerAsync(id, ownerId))
                throw ApiErrorException.Conflict(ErrorCodes.HORSE_FORBIDDEN, "Access denied to this horse");

            return horse;
        }

        public async Task<HorseDto> CreateAsync(int ownerId, CreateHorseDto dto)
        {
            return await _repository.CreateAsync(ownerId, dto);
        }

        public async Task<HorseDto> UpdateAsync(int id, int ownerId, UpdateHorseDto dto)
        {
            if (!await _repository.ExistsAsync(id))
                throw ApiErrorException.NotFound(ErrorCodes.HORSE_NOT_FOUND, "Horse not found");

            if (!await _repository.BelongsToOwnerAsync(id, ownerId))
                throw ApiErrorException.Conflict(ErrorCodes.HORSE_FORBIDDEN, "Access denied to this horse");

            return await _repository.UpdateAsync(id, dto)
                ?? throw ApiErrorException.NotFound(ErrorCodes.HORSE_NOT_FOUND, "Horse not found");
        }

        public async Task DeleteAsync(int id, int ownerId)
        {
            if (!await _repository.ExistsAsync(id))
                throw ApiErrorException.NotFound(ErrorCodes.HORSE_NOT_FOUND, "Horse not found");

            if (!await _repository.BelongsToOwnerAsync(id, ownerId))
                throw ApiErrorException.Conflict(ErrorCodes.HORSE_FORBIDDEN, "Access denied to this horse");

            await _repository.DeleteAsync(id);
        }

        public async Task<HorseReferenceDto> GetReferenceDataAsync()
        {
            var breeds = await _referenceRepository.GetBreedsAsync();
            var disciplines = await _referenceRepository.GetDisciplinesAsync();
            var levels = await _referenceRepository.GetLevelsAsync();

            return new HorseReferenceDto
            {
                Breeds = breeds.ToList(),
                Disciplines = disciplines.ToList(),
                Levels = levels.ToList()
            };
        }
    }
}
