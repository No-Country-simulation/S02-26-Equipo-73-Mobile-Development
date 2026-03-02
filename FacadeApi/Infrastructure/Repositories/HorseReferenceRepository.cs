using Application.DTOs.Horses;
using Application.Interfaces.Repositories;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class HorseReferenceRepository : IHorseReferenceRepository
    {
        private readonly AppDbContext _context;

        public HorseReferenceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BreedDto>> GetBreedsAsync()
        {
            return await _context.Breeds
                .Where(b => b.IsActive)
                .Select(b => new BreedDto { Id = b.Id, Name = b.Name })
                .ToListAsync();
        }

        public async Task<IEnumerable<DisciplineDto>> GetDisciplinesAsync()
        {
            return await _context.Disciplines
                .Where(d => d.IsActive)
                .Select(d => new DisciplineDto { Id = d.Id, Name = d.Name })
                .ToListAsync();
        }

        public async Task<IEnumerable<HorseLevelDto>> GetLevelsAsync()
        {
            return await _context.HorseLevels
                .Where(l => l.IsActive)
                .Select(l => new HorseLevelDto { Id = l.Id, Name = l.Name })
                .ToListAsync();
        }
    }
}
