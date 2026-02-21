using System.Security.Claims;

namespace Application.Interfaces
{
    /// <summary>
    /// Servicio para generación y validación de JWT
    /// </summary>
    public interface IJwtTokenService
    {
        /// <summary>
        /// Genera un JWT con los claims proporcionados
        /// </summary>
        /// <param name="userId">ID del usuario</param>
        /// <param name="email">Email del usuario</param>
        /// <param name="additionalClaims">Claims adicionales opcionales</param>
        /// <returns>Token JWT generado</returns>
        string GenerateToken(string userId, string email, Dictionary<string, string>? additionalClaims = null);

        /// <summary>
        /// Genera un refresh token
        /// </summary>
        /// <returns>Refresh token generado</returns>
        string GenerateRefreshToken();

        /// <summary>
        /// Valida un token JWT
        /// </summary>
        /// <param name="token">Token a validar</param>
        /// <returns>ClaimsPrincipal si el token es válido, null si es inválido</returns>
        ClaimsPrincipal? ValidateToken(string token);

        /// <summary>
        /// Obtiene el userId de un token
        /// </summary>
        /// <param name="token">Token JWT</param>
        /// <returns>UserId extraído del token</returns>
        string? GetUserIdFromToken(string token);
    }
}
