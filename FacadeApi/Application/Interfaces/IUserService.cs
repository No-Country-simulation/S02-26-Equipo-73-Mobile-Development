using Application.DTOs.Identity;

namespace Application.Interfaces
{
    /// <summary>
    /// Servicio para gestión de usuarios y autorización
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// Obtiene un usuario por su ID
        /// </summary>
        Task<UserDto?> GetUserByIdAsync(int id);

        /// <summary>
        /// Obtiene un usuario por su ID de Supabase
        /// </summary>
        Task<UserDto?> GetUserBySupabaseIdAsync(string supabaseId);

        /// <summary>
        /// Obtiene un usuario por su email
        /// </summary>
        Task<UserDto?> GetUserByEmailAsync(string email);

        /// <summary>
        /// Crea un nuevo usuario
        /// </summary>
        Task<UserDto> CreateUserAsync(CreateUserDto createDto);

        /// <summary>
        /// Obtiene o crea un usuario basado en información de Supabase
        /// Usado durante el token exchange
        /// </summary>
        Task<UserDto> GetOrCreateUserFromSupabaseAsync(string supabaseId, string email, string? name);

        /// <summary>
        /// Actualiza un usuario existente
        /// </summary>
        Task<UserDto> UpdateUserAsync(int id, UpdateUserDto updateDto);

        /// <summary>
        /// Elimina un usuario (soft delete)
        /// </summary>
        Task<bool> DeleteUserAsync(int id);

        /// <summary>
        /// Asigna roles a un usuario
        /// </summary>
        Task AssignRolesToUserAsync(int userId, List<int> roleIds);

        /// <summary>
        /// Obtiene los roles de un usuario
        /// </summary>
        Task<List<RoleDto>> GetUserRolesAsync(int userId);

        /// <summary>
        /// Obtiene los nombres de roles de un usuario (para JWT claims)
        /// </summary>
        Task<List<string>> GetUserRoleNamesAsync(int userId);
    }
}
