using Application.DTOs.Horses;
using Application.Interfaces.Repositories;
using Domain.Entities.Horse;
using Domain.Enums;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class HorseRepository : IHorseRepository
    {
        private readonly AppDbContext _context;

        public HorseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HorseDto>> GetByOwnerIdAsync(int ownerId)
        {
            var horses = await _context.Horses
                .Where(h => h.OwnerId == ownerId && h.IsActive)
                .Include(h => h.Breed)
                .Include(h => h.Discipline)
                .Include(h => h.Level)
                .ToListAsync();

            return horses.Select(MapToDto);
        }

        public async Task<HorseDto?> GetByIdAsync(int id)
        {
            var horse = await _context.Horses
                .Include(h => h.Breed)
                .Include(h => h.Discipline)
                .Include(h => h.Level)
                .FirstOrDefaultAsync(h => h.Id == id);

            return horse is null ? null : MapToDto(horse);
        }

        public async Task<HorseDto> CreateAsync(int ownerId, CreateHorseDto dto)
        {
            var entity = new Horse
            {
                OwnerId = ownerId,
                Name = dto.Name,
                BirthDate = dto.BirthDate,
                Sex = dto.Sex,
                BreedId = dto.BreedId,
                DisciplineId = dto.DisciplineId,
                LevelId = dto.LevelId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            if (dto.Measurement != null)
            {
                entity.Measurement = new HorseMeasurement
                {
                    WithersHeight = dto.Measurement.WithersHeight,
                    BackLength = dto.Measurement.BackLength,
                    ChestCircumference = dto.Measurement.ChestCircumference,
                    WithersWidth = dto.Measurement.WithersWidth,
                    NeckLength = dto.Measurement.NeckLength,
                    CannonCircumference = dto.Measurement.CannonCircumference,
                    HeadLength = dto.Measurement.HeadLength,
                    BackType = dto.Measurement.BackType,
                    WithersType = dto.Measurement.WithersType,
                    ShoulderType = dto.Measurement.ShoulderType
                };
            }

            _context.Horses.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<HorseDto?> UpdateAsync(int id, UpdateHorseDto dto)
        {
            var entity = await _context.Horses
                .Include(h => h.Breed)
                .Include(h => h.Discipline)
                .Include(h => h.Level)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (entity is null) return null;

            if (dto.Name != null) entity.Name = dto.Name;
            if (dto.BirthDate.HasValue) entity.BirthDate = dto.BirthDate.Value;
            if (dto.Sex.HasValue) entity.Sex = dto.Sex.Value;
            if (dto.BreedId.HasValue) entity.BreedId = dto.BreedId.Value;
            if (dto.DisciplineId.HasValue) entity.DisciplineId = dto.DisciplineId.Value;
            if (dto.LevelId.HasValue) entity.LevelId = dto.LevelId.Value;
            if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;

            if (dto.Measurement != null)
            {
                entity.Measurement ??= new HorseMeasurement();

                if (dto.Measurement.WithersHeight.HasValue) entity.Measurement.WithersHeight = dto.Measurement.WithersHeight;
                if (dto.Measurement.BackLength.HasValue) entity.Measurement.BackLength = dto.Measurement.BackLength;
                if (dto.Measurement.ChestCircumference.HasValue) entity.Measurement.ChestCircumference = dto.Measurement.ChestCircumference;
                if (dto.Measurement.WithersWidth.HasValue) entity.Measurement.WithersWidth = dto.Measurement.WithersWidth;
                if (dto.Measurement.NeckLength.HasValue) entity.Measurement.NeckLength = dto.Measurement.NeckLength;
                if (dto.Measurement.CannonCircumference.HasValue) entity.Measurement.CannonCircumference = dto.Measurement.CannonCircumference;
                if (dto.Measurement.HeadLength.HasValue) entity.Measurement.HeadLength = dto.Measurement.HeadLength;
                if (dto.Measurement.BackType.HasValue) entity.Measurement.BackType = dto.Measurement.BackType;
                if (dto.Measurement.WithersType.HasValue) entity.Measurement.WithersType = dto.Measurement.WithersType;
                if (dto.Measurement.ShoulderType.HasValue) entity.Measurement.ShoulderType = dto.Measurement.ShoulderType;
            }

            entity.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Horses.FindAsync(id);

            if (entity is null) return false;

            entity.IsActive = false;
            entity.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Horses.AnyAsync(h => h.Id == id);
        }

        public async Task<bool> BelongsToOwnerAsync(int id, int ownerId)
        {
            return await _context.Horses.AnyAsync(h => h.Id == id && h.OwnerId == ownerId);
        }

        private static HorseDto MapToDto(Horse horse) => new HorseDto
        {
            Id = horse.Id,
            OwnerId = horse.OwnerId,
            Name = horse.Name,
            BirthDate = horse.BirthDate,
            Sex = horse.Sex.ToString(),
            BreedId = horse.BreedId,
            BreedName = horse.Breed?.Name ?? string.Empty,
            DisciplineId = horse.DisciplineId,
            DisciplineName = horse.Discipline?.Name ?? string.Empty,
            LevelId = horse.LevelId,
            LevelName = horse.Level?.Name ?? string.Empty,
            IsActive = horse.IsActive,
            Measurement = horse.Measurement == null ? null : MapMeasurementToDto(horse.Measurement),
            CreatedAt = horse.CreatedAt,
            UpdatedAt = horse.UpdatedAt
        };

        private static HorseMeasurementDto MapMeasurementToDto(HorseMeasurement m) => new HorseMeasurementDto
        {
            WithersHeight = m.WithersHeight,
            BackLength = m.BackLength,
            ChestCircumference = m.ChestCircumference,
            WithersWidth = m.WithersWidth,
            NeckLength = m.NeckLength,
            CannonCircumference = m.CannonCircumference,
            HeadLength = m.HeadLength,
            BackType = m.BackType?.ToString(),
            WithersType = m.WithersType?.ToString(),
            ShoulderType = m.ShoulderType?.ToString()
        };
    }
}
