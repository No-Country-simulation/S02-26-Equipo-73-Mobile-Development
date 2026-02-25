using Application.Common;
using Application.DTOs.Identity;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FacadeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = "ApiJwt")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Obtiene los datos del usuario autenticado
        /// </summary>
        /// <returns>Datos del usuario autenticado</returns>
        /// <response code="200">Usuario obtenido exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Usuario no encontrado</response>
        [HttpGet("me")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMe()
        {
            var userId = GetCurrentUserId();

            var user = await _userService.GetUserByIdAsync(userId);

            if (user is null)
                return NotFound(ApiResponse<object>.NotFound("User not found"));

            return Ok(ApiResponse<UserDto>.Ok(user, "User retrieved successfully"));
        }

        /// <summary>
        /// Actualiza el perfil del usuario autenticado
        /// </summary>
        /// <param name="dto">Campos a actualizar: firstName, lastName, phone, profileImageUrl</param>
        /// <returns>Usuario actualizado</returns>
        /// <response code="200">Usuario actualizado exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Usuario no encontrado</response>
        [HttpPut("me")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<object>.BadRequest("Invalid data", errors));
            }

            var userId = GetCurrentUserId();

            var updated = await _userService.UpdateProfileAsync(userId, dto);

            return Ok(ApiResponse<UserDto>.Ok(updated, "Profile updated successfully"));
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;

            if (int.TryParse(userIdClaim, out var userId))
                return userId;

            throw new UnauthorizedAccessException("Invalid user token");
        }
    }
}
