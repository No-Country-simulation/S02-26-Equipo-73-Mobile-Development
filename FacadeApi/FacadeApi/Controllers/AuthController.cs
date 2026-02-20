using Application.Common;
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
        /// <summary>
        /// Valida el token de Supabase y retorna información del usuario autenticado
        /// </summary>
        /// <remarks>
        /// Este endpoint valida el JWT de Supabase. Si el token es válido, retorna true y la información del usuario.
        /// 
        /// **Cómo usar:**
        /// 1. Obtén el access_token de Supabase después del login
        /// 2. Envía el token en el header: `Authorization: Bearer {tu_token}`
        /// 3. Si el token es válido, recibirás información del usuario
        /// 
        /// **Ejemplo de header:**
        /// ```
        /// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        /// ```
        /// </remarks>
        /// <returns>Confirmación de autenticación exitosa con datos del usuario</returns>
        /// <response code="200">Token válido - Usuario autenticado</response>
        /// <response code="401">Token inválido o no proporcionado</response>
        [HttpPost("exchange")]
        [Authorize(AuthenticationSchemes = "SupabaseJwt")]
        [ProducesResponseType(typeof(ApiResponse<AuthExchangeResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public IActionResult ExchangeToken()
        {
            // Si llegamos aquí, el token es válido (pasó la validación JWT en [Authorize])
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                         User.FindFirst("sub")?.Value;
            
            var email = User.FindFirst(ClaimTypes.Email)?.Value ?? 
                        User.FindFirst("email")?.Value;
            
            var name = User.FindFirst(ClaimTypes.Name)?.Value ?? 
                       User.FindFirst("name")?.Value;

            var response = new AuthExchangeResponse
            {
                IsAuthenticated = true,
                UserId = userId,
                Email = email,
                Name = name,
                Claims = User.Claims.Select(c => new ClaimInfo
                {
                    Type = c.Type,
                    Value = c.Value
                }).ToList()
            };

            return Ok(ApiResponse<AuthExchangeResponse>.Ok(
                response, 
                "Token validated successfully"));
        }

        /// <summary>
        /// Obtiene información del usuario autenticado actual
        /// </summary>
        /// <returns>Información del usuario autenticado</returns>
        /// <response code="200">Usuario autenticado encontrado</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("me")]
        [Authorize]
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

            var response = new UserInfoResponse
            {
                UserId = userId,
                Email = email,
                Name = name,
                IsAuthenticated = true
            };

            return Ok(ApiResponse<UserInfoResponse>.Ok(
                response, 
                "User information retrieved successfully"));
        }

        /// <summary>
        /// Verifica si el usuario está autenticado (endpoint de health check)
        /// </summary>
        /// <returns>Estado de autenticación</returns>
        /// <response code="200">Usuario autenticado</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("check")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<AuthCheckResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public IActionResult CheckAuth()
        {
            var response = new AuthCheckResponse
            {
                IsAuthenticated = true,
                Message = "User is authenticated"
            };

            return Ok(ApiResponse<AuthCheckResponse>.Ok(
                response, 
                "Authentication verified"));
        }
    }

    #region Response Models

    /// <summary>
    /// Respuesta del endpoint de exchange de token
    /// </summary>
    public class AuthExchangeResponse
    {
        /// <summary>
        /// Indica si el usuario está autenticado
        /// </summary>
        public bool IsAuthenticated { get; set; }

        /// <summary>
        /// ID del usuario de Supabase
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// Email del usuario
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Nombre del usuario
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Claims adicionales del token JWT
        /// </summary>
        public List<ClaimInfo> Claims { get; set; }
    }

    /// <summary>
    /// Información de un claim del JWT
    /// </summary>
    public class ClaimInfo
    {
        /// <summary>
        /// Tipo del claim (ej: "sub", "email", "role")
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Valor del claim
        /// </summary>
        public string Value { get; set; }
    }

    /// <summary>
    /// Respuesta con información del usuario
    /// </summary>
    public class UserInfoResponse
    {
        /// <summary>
        /// ID del usuario
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// Email del usuario
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Nombre del usuario
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Estado de autenticación
        /// </summary>
        public bool IsAuthenticated { get; set; }
    }

    /// <summary>
    /// Respuesta del check de autenticación
    /// </summary>
    public class AuthCheckResponse
    {
        /// <summary>
        /// Indica si el usuario está autenticado
        /// </summary>
        public bool IsAuthenticated { get; set; }

        /// <summary>
        /// Mensaje descriptivo
        /// </summary>
        public string Message { get; set; }
    }

    #endregion
}
