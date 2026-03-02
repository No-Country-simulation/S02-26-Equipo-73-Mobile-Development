using Application.Common;
using Application.DTOs.Horses;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FacadeApi.Controllers
{
    [ApiController]
    [Route("api/horses")]
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = "ApiJwt")]
    public class HorseController : ControllerBase
    {
        private readonly IHorseService _horseService;

        public HorseController(IHorseService horseService)
        {
            _horseService = horseService;
        }

        /// <summary>
        /// Devuelve los datos de referencia para crear un caballo: razas, disciplinas y niveles
        /// </summary>
        /// <response code="200">Datos de referencia obtenidos exitosamente</response>
        [HttpGet("reference")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<HorseReferenceDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetReference()
        {
            var data = await _horseService.GetReferenceDataAsync();
            return Ok(ApiResponse<HorseReferenceDto>.Ok(data, "Reference data retrieved successfully"));
        }

        /// <summary>
        /// Obtiene todos los caballos del usuario autenticado
        /// </summary>
        /// <response code="200">Caballos obtenidos exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<HorseDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAll()
        {
            var ownerId = GetCurrentUserId();
            var horses = await _horseService.GetMyHorsesAsync(ownerId);
            return Ok(ApiResponse<IEnumerable<HorseDto>>.Ok(horses, "Horses retrieved successfully"));
        }

        /// <summary>
        /// Obtiene un caballo específico del usuario autenticado
        /// </summary>
        /// <param name="id">ID del caballo</param>
        /// <response code="200">Caballo obtenido exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Caballo no encontrado</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<HorseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var ownerId = GetCurrentUserId();
            var horse = await _horseService.GetMyHorseByIdAsync(id, ownerId);
            return Ok(ApiResponse<HorseDto>.Ok(horse, "Horse retrieved successfully"));
        }

        /// <summary>
        /// Crea un nuevo caballo para el usuario autenticado
        /// </summary>
        /// <param name="dto">Datos del caballo</param>
        /// <response code="201">Caballo creado exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<HorseDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Create([FromBody] CreateHorseDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<object>.BadRequest("Invalid data", errors));
            }

            var ownerId = GetCurrentUserId();
            var created = await _horseService.CreateAsync(ownerId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, ApiResponse<HorseDto>.Ok(created, "Horse created successfully"));
        }

        /// <summary>
        /// Actualiza un caballo del usuario autenticado
        /// </summary>
        /// <param name="id">ID del caballo</param>
        /// <param name="dto">Campos a actualizar</param>
        /// <response code="200">Caballo actualizado exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Caballo no encontrado</response>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<HorseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateHorseDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<object>.BadRequest("Invalid data", errors));
            }

            var ownerId = GetCurrentUserId();
            var updated = await _horseService.UpdateAsync(id, ownerId, dto);
            return Ok(ApiResponse<HorseDto>.Ok(updated, "Horse updated successfully"));
        }

        /// <summary>
        /// Elimina (soft delete) un caballo del usuario autenticado
        /// </summary>
        /// <param name="id">ID del caballo</param>
        /// <response code="204">Caballo eliminado exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Caballo no encontrado</response>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var ownerId = GetCurrentUserId();
            await _horseService.DeleteAsync(id, ownerId);
            return NoContent();
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
