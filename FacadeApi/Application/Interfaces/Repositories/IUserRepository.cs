using Application.DTOs.Identity;

namespace Application.Interfaces.Repositories
{
    /// <summary>
    /// Repositorio para gestión de usuarios
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Obtiene un usuario por su ID interno
        /// </summary>
        Task<UserDto?> GetByIdAsync(int id);

        /// <summary>
        /// Obtiene un usuario por su ID de Supabase
        /// </summary>
        Task<UserDto?> GetBySupabaseIdAsync(string supabaseId);

        /// <summary>
        /// Obtiene un usuario por su email
        /// </summary>
        Task<UserDto?> GetByEmailAsync(string email);

        /// <summary>
        /// Crea un nuevo usuario
        /// </summary>
        Task<UserDto> CreateAsync(CreateUserDto createDto);

        /// <summary>
        /// Actualiza un usuario existente
        /// </summary>
        Task<UserDto?> UpdateAsync(int id, UpdateUserDto updateDto);

        /// <summary>
        /// Elimina un usuario (soft delete)
        /// </summary>
        Task<bool> DeleteAsync(int id);

        /// <summary>
        /// Verifica si un usuario existe por email
        /// </summary>
        Task<bool> ExistsByEmailAsync(string email);

        /// <summary>
        /// Verifica si un usuario existe por Supabase ID
        /// </summary>
        Task<bool> ExistsBySupabaseIdAsync(string supabaseId);

        /// <summary>
        /// Asigna roles a un usuario
        /// </summary>
        Task AssignRolesAsync(int userId, List<int> roleIds);

        /// <summary>
        /// Obtiene los roles de un usuario
        /// </summary>
        Task<List<RoleDto>> GetUserRolesAsync(int userId);
    }
}
