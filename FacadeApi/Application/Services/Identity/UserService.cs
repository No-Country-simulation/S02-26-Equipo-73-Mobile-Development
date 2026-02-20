using Application.Common.Errors;
using Application.DTOs.Identity;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Helpers;

namespace Application.Services.Identity
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IStorageService _storageService;

        public UserService(IUserRepository userRepository, IStorageService storageService)
        {
            _userRepository = userRepository;
            _storageService = storageService;
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<UserDto?> GetUserBySupabaseIdAsync(string supabaseId)
        {
            return await _userRepository.GetBySupabaseIdAsync(supabaseId);
        }

        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createDto)
        {
            // Validar que el email no exista
            if (await _userRepository.ExistsByEmailAsync(createDto.Email))
            {
                throw ApiErrorException.BadRequest(
                    ErrorCodes.USER_ALREADY_EXISTS,
                    "User with this email already exists");
            }

            // Validar que el Supabase ID no exista
            if (await _userRepository.ExistsBySupabaseIdAsync(createDto.SupabaseId))
            {
                throw ApiErrorException.BadRequest(
                    ErrorCodes.USER_ALREADY_EXISTS,
                    "User with this Supabase ID already exists");
            }

            // Procesar imagen de perfil si es base64
            if (!string.IsNullOrEmpty(createDto.ProfileImage) && 
                createDto.ProfileImage.IsBase64Image())
            {
                createDto.ProfileImage = await _storageService.ProcessImageUrlAsync(
                    createDto.ProfileImage, 
                    "profiles");
            }

            return await _userRepository.CreateAsync(createDto);
        }

        public async Task<UserDto> GetOrCreateUserFromSupabaseAsync(string supabaseId, string email, string? name)
        {
            // Intentar obtener usuario existente por Supabase ID
            var existingUser = await _userRepository.GetBySupabaseIdAsync(supabaseId);
            
            if (existingUser != null)
                return existingUser;

            // Si no existe, intentar por email (por si se registró antes)
            existingUser = await _userRepository.GetByEmailAsync(email);
            
            if (existingUser != null)
                return existingUser;

            // Crear nuevo usuario
            var names = name?.Split(' ') ?? Array.Empty<string>();
            var firstName = names.Length > 0 ? names[0] : null;
            var lastName = names.Length > 1 ? string.Join(" ", names.Skip(1)) : null;

            var createDto = new CreateUserDto
            {
                SupabaseId = supabaseId,
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                RoleIds = new List<int> { 2 } // Rol "User" por defecto
            };

            return await _userRepository.CreateAsync(createDto);
        }

        public async Task<UserDto> UpdateUserAsync(int id, UpdateUserDto updateDto)
        {
            var existingUser = await _userRepository.GetByIdAsync(id);

            if (existingUser == null)
            {
                throw ApiErrorException.NotFound(
                    ErrorCodes.USER_NOT_FOUND,
                    "User not found");
            }

            // Procesar imagen de perfil si es base64
            if (!string.IsNullOrEmpty(updateDto.ProfileImage) && (updateDto.ProfileImage.IsBase64Image()))
            {
                updateDto.ProfileImage = await _storageService.ProcessImageUrlAsync(
                    updateDto.ProfileImage, 
                    "profiles");
            }

            var updatedUser = await _userRepository.UpdateAsync(id, updateDto);

            if (updatedUser == null)
            {
                throw ApiErrorException.NotFound(
                    ErrorCodes.USER_NOT_FOUND,
                    "User not found");
            }

            return updatedUser;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var exists = await _userRepository.GetByIdAsync(id);

            if (exists == null)
            {
                throw ApiErrorException.NotFound(
                    ErrorCodes.USER_NOT_FOUND,
                    "User not found");
            }

            return await _userRepository.DeleteAsync(id);
        }

        public async Task AssignRolesToUserAsync(int userId, List<int> roleIds)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                throw ApiErrorException.NotFound(
                    ErrorCodes.USER_NOT_FOUND,
                    "User not found");
            }

            await _userRepository.AssignRolesAsync(userId, roleIds);
        }

        public async Task<List<RoleDto>> GetUserRolesAsync(int userId)
        {
            return await _userRepository.GetUserRolesAsync(userId);
        }

        public async Task<List<string>> GetUserRoleNamesAsync(int userId)
        {
            var roles = await GetUserRolesAsync(userId);
            return roles.Select(r => r.Name).ToList();
        }
    }
}
