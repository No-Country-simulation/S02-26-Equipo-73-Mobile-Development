using Application.Common;
using Application.DTOs.Auth;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FacadeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IUserService _userService;

        public AuthController(IJwtTokenService jwtTokenService, IUserService userService)
        {
            _jwtTokenService = jwtTokenService;
            _userService = userService;
        }
        /// <summary>
        /// Valida el token de Supabase y retorna un JWT propio de la API
        /// </summary>
        /// <remarks>
        /// Este endpoint valida el JWT de Supabase y genera un JWT propio de la API.
        /// 
        /// **Flujo:**
        /// 1. Valida el token de Supabase (esquema SupabaseJwt)
        /// 2. Extrae información del usuario (userId, email, etc.)
        /// 3. Genera un JWT propio de la API con claims personalizados
        /// 4. Retorna el JWT de la API
        /// 
        /// **Cómo usar:**
        /// 1. Obtén el access_token de Supabase después del login
        /// 2. Envía el token de Supabase en el header: `Authorization: Bearer {supabase_token}`
        /// 3. Recibirás un JWT propio de la API
        /// 4. Usa el JWT de la API para futuras peticiones
        /// 
        /// **Ejemplo:**
        /// ```
        /// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (token de Supabase)
        /// ```
        /// 
        /// **Respuesta:**
        /// ```json
        /// {
        ///   "accessToken": "tu_jwt_de_la_api...",
        ///   "refreshToken": "refresh_token...",
        ///   "expiresIn": 86400
        /// }
        /// ```
        /// </remarks>
        /// <returns>JWT propio de la API con refresh token</returns>
        /// <response code="200">Token intercambiado exitosamente</response>
        /// <response code="401">Token de Supabase inválido</response>
        [HttpPost("exchange")]
        [Authorize(AuthenticationSchemes = "SupabaseJwt")]
        [ProducesResponseType(typeof(ApiResponse<AuthExchangeResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ExchangeToken()
        {
            // Si llegamos aquí, el token de Supabase es válido
            var supabaseUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                                 User.FindFirst("sub")?.Value;

            var email = User.FindFirst(ClaimTypes.Email)?.Value ?? 
                        User.FindFirst("email")?.Value;

            var name = User.FindFirst(ClaimTypes.Name)?.Value ?? 
                       User.FindFirst("name")?.Value;

            // Obtener o crear usuario en la base de datos
            var user = await _userService.GetOrCreateUserFromSupabaseAsync(supabaseUserId, email, name);

            // Obtener roles del usuario
            var userRoles = await _userService.GetUserRoleNamesAsync(user.Id);
            var primaryRole = userRoles.FirstOrDefault() ?? "User";

            // Crear claims adicionales personalizados
            var additionalClaims = new Dictionary<string, string>
            {
                { "role", primaryRole },
                { "roles", string.Join(",", userRoles) },
                { "name", user.FullName ?? email ?? "Unknown" },
                { "userId", user.Id.ToString() },
                { "provider", "supabase" },
                { "isActive", user.IsActive.ToString() }
            };

            // Generar JWT propio de la API
            var accessToken = _jwtTokenService.GenerateToken(supabaseUserId, email, additionalClaims);
            var refreshToken = _jwtTokenService.GenerateRefreshToken();

            var response = new AuthExchangeResponse
            {
                IsAuthenticated = true,
                UserId = supabaseUserId,
                InternalUserId = user.Id,
                Email = email,
                Name = user.FullName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                ProfileImageUrl = user.ProfileImageUrl,
                Role = primaryRole,
                Roles = userRoles,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                TokenType = "Bearer",
                ExpiresIn = 86400,
                Claims = User.Claims.Select(c => new ClaimInfoDto
                {
                    Type = c.Type,
                    Value = c.Value
                }).ToList()
            };

            return Ok(ApiResponse<AuthExchangeResponse>.Ok(
                response, 
                "Token exchanged successfully"));
        }

        /// <summary>
        /// Obtiene información del usuario autenticado actual
        /// </summary>
        /// <remarks>
        /// **Usa el JWT de la API** (no el de Supabase)
        /// 
        /// Envía el token en el header:
        /// ```
        /// Authorization: Bearer {tu_jwt_de_la_api}
        /// ```
        /// </remarks>
        /// <returns>Información del usuario autenticado</returns>
        /// <response code="200">Usuario autenticado encontrado</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("me")]
        [Authorize(AuthenticationSchemes = "ApiJwt")]
        [ProducesResponseType(typeof(ApiResponse<UserInfoResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                         User.FindFirst("sub")?.Value;

            var email = User.FindFirst(ClaimTypes.Email)?.Value ?? 
                        User.FindFirst("email")?.Value;

            var name = User.FindFirst(ClaimTypes.Name)?.Value ?? 
                       User.FindFirst("name")?.Value;

            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? 
                       User.FindFirst("role")?.Value;

            var response = new UserInfoResponse
            {
                UserId = userId,
                Email = email,
                Name = name,
                Role = role,
                IsAuthenticated = true
            };

            return Ok(ApiResponse<UserInfoResponse>.Ok(
                response, 
                "User information retrieved successfully"));
        }

        /// <summary>
        /// Verifica si el usuario está autenticado (endpoint de health check)
        /// </summary>
        /// <remarks>
        /// **Usa el JWT de la API** (no el de Supabase)
        /// </remarks>
        /// <returns>Estado de autenticación</returns>
        /// <response code="200">Usuario autenticado</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("check")]
        [Authorize(AuthenticationSchemes = "ApiJwt")]
        [ProducesResponseType(typeof(ApiResponse<AuthCheckResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public IActionResult CheckAuth()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var response = new AuthCheckResponse
            {
                IsAuthenticated = true,
                UserId = userId,
                Message = "User is authenticated"
            };

            return Ok(ApiResponse<AuthCheckResponse>.Ok(
                response, 
                "Authentication verified"));
        }
    }
}
