using Application.DTOs.Measurements;
using Application.Interfaces.Repositories;
using AutoMapper;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class MeasurementReferenceRepository : IMeasurementReferenceRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public MeasurementReferenceRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MeasurementReferenceDto> GetReferenceDataAsync()
        {
            var entityTypesTask = await _context.MeasurementEntities
               .Include(e => e.MeasurementTypes)
               .AsNoTracking()
               .Select(e => new EntityTypeReferenceDto
               {
                   Id = e.Id,
                   Name = e.Name,
                   Description = e.Description,
                   MeasurementTypes = e.MeasurementTypes
                       .Select(mt => new MeasurementTypeReferenceDto
                       {
                           Id = mt.Id,
                           Name = mt.Name
                       })
                       .ToList()
               })
               .ToListAsync();

            var unitsTask = await _context.MeasurementUnits
                .AsNoTracking()
                .Select(u => new MeasurementUnitReferenceDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Symbol = u.Symbol
                })
                .ToListAsync();


            return new MeasurementReferenceDto
            {
                EntityTypes = entityTypesTask,
                Units = unitsTask
            };
        }
    }
}
