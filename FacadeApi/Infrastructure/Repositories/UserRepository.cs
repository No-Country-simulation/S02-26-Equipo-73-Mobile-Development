using Application.DTOs.Identity;
using Application.Interfaces.Repositories;
using AutoMapper;
using Domain.Entities.Identity;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UserRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _context.ApplicationUsers
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> GetBySupabaseIdAsync(string supabaseId)
        {
            var user = await _context.ApplicationUsers
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.SupabaseId == supabaseId && !u.IsDeleted);

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> GetByEmailAsync(string email)
        {
            var user = await _context.ApplicationUsers
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateAsync(CreateUserDto createDto)
        {
            var user = _mapper.Map<ApplicationUser>(createDto);
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            _context.ApplicationUsers.Add(user);
            await _context.SaveChangesAsync();

            // Asignar roles si se proporcionaron, sino asignar rol "User" por defecto
            if (createDto.RoleIds?.Any() == true)
            {
                await AssignRolesAsync(user.Id, createDto.RoleIds);
            }
            else
            {
                // Asignar rol "User" por defecto (ID = 2)
                await AssignRolesAsync(user.Id, new List<int> { 2 });
            }

            return await GetByIdAsync(user.Id);
        }

        public async Task<UserDto?> UpdateAsync(int id, UpdateUserDto updateDto)
        {
            var user = await _context.ApplicationUsers
                .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return null;

            // Actualizar propiedades
            if (updateDto.FirstName != null)
                user.FirstName = updateDto.FirstName;

            if (updateDto.LastName != null)
                user.LastName = updateDto.LastName;

            if (updateDto.Phone != null)
                user.Phone = updateDto.Phone;

            if (updateDto.ProfileImage != null)
                user.ProfileImageUrl = updateDto.ProfileImage;

            if (updateDto.IsActive.HasValue)
                user.IsActive = updateDto.IsActive.Value;

            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Actualizar roles si se proporcionaron
            if (updateDto.RoleIds != null)
            {
                await AssignRolesAsync(id, updateDto.RoleIds);
            }

            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.ApplicationUsers
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return false;

            // Soft delete
            user.IsDeleted = true;
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.ApplicationUsers
                .AnyAsync(u => u.Email == email && !u.IsDeleted);
        }

        public async Task<bool> ExistsBySupabaseIdAsync(string supabaseId)
        {
            return await _context.ApplicationUsers
                .AnyAsync(u => u.SupabaseId == supabaseId && !u.IsDeleted);
        }

        public async Task AssignRolesAsync(int userId, List<int> roleIds)
        {
            // Eliminar roles existentes
            var existingRoles = await _context.ApplicationUserRoles
                .Where(ur => ur.UserId == userId)
                .ToListAsync();

            _context.ApplicationUserRoles.RemoveRange(existingRoles);

            // Agregar nuevos roles
            var userRoles = roleIds.Select(roleId => new ApplicationUserRole
            {
                UserId = userId,
                RoleId = roleId,
                AssignedAt = DateTime.UtcNow
            }).ToList();

            _context.ApplicationUserRoles.AddRange(userRoles);
            await _context.SaveChangesAsync();
        }

        public async Task<List<RoleDto>> GetUserRolesAsync(int userId)
        {
            var roles = await _context.ApplicationUserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role)
                .ToListAsync();

            return _mapper.Map<List<RoleDto>>(roles);
        }
    }
}
