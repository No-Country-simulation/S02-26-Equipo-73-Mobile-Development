using Application.DTOs.Measurements;
using Application.Interfaces.Repositories;
using Domain.Entities.Measurement;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserMeasurementRepository : IUserMeasurementRepository
    {
        private readonly AppDbContext _context;

        public UserMeasurementRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserMeasurementDto>> GetByUserIdAsync(int userId)
        {
            return await _context.UserMeasurements
                .Where(um => um.UserId == userId)
                .Include(um => um.MeasurementType)
                    .ThenInclude(mt => mt.EntityType)
                .Include(um => um.Unit)
                .Select(um => MapToDto(um))
                .ToListAsync();
        }

        public async Task<UserMeasurementDto?> GetByIdAsync(int id)
        {
            var um = await _context.UserMeasurements
                .Include(um => um.MeasurementType)
                    .ThenInclude(mt => mt.EntityType)
                .Include(um => um.Unit)
                .FirstOrDefaultAsync(um => um.Id == id);

            return um is null ? null : MapToDto(um);
        }

        public async Task<UserMeasurementDto> CreateAsync(int userId, CreateUserMeasurementDto dto)
        {
            var entity = new UserMeasurement
            {
                UserId = userId,
                MeasurementTypeId = dto.MeasurementTypeId,
                Value = dto.Value,
                UnitId = dto.UnitId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.UserMeasurements.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<UserMeasurementDto?> UpdateAsync(int id, UpdateUserMeasurementDto dto)
        {
            var entity = await _context.UserMeasurements.FindAsync(id);

            if (entity is null) return null;

            if (dto.Value.HasValue)
                entity.Value = dto.Value.Value;

            if (dto.UnitId.HasValue)
                entity.UnitId = dto.UnitId.Value;

            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.UserMeasurements.FindAsync(id);

            if (entity is null) return false;

            _context.UserMeasurements.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id) =>
            await _context.UserMeasurements.AnyAsync(um => um.Id == id);

        public async Task<bool> BelongsToUserAsync(int id, int userId) =>
            await _context.UserMeasurements.AnyAsync(um => um.Id == id && um.UserId == userId);

        private static UserMeasurementDto MapToDto(UserMeasurement um) => new()
        {
            Id = um.Id,
            UserId = um.UserId,
            MeasurementTypeId = um.MeasurementTypeId,
            MeasurementTypeName = um.MeasurementType?.Name ?? string.Empty,
            EntityTypeName = um.MeasurementType?.EntityType?.Name ?? string.Empty,
            Value = um.Value,
            UnitId = um.UnitId,
            UnitName = um.Unit?.Name ?? string.Empty,
            UnitSymbol = um.Unit?.Symbol ?? string.Empty,
            CreatedAt = um.CreatedAt,
            UpdatedAt = um.UpdatedAt
        };
    }
}
