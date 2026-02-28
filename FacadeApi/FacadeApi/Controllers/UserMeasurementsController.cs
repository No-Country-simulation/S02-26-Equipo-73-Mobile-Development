using Application.Common;
using Application.DTOs.Measurements;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FacadeApi.Controllers
{
    [ApiController]
    [Route("api/user/measurements")]
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = "ApiJwt")]
    public class UserMeasurementsController : ControllerBase
    {
        private readonly IUserMeasurementService _measurementService;


        public UserMeasurementsController(
            IUserMeasurementService measurementService,
            IMeasurementReferenceService referenceService)
        {
            _measurementService = measurementService;
        }

        /// <summary>
        /// Obtiene todas las medidas del usuario autenticado
        /// </summary>
        /// <response code="200">Medidas obtenidas exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserMeasurementDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetCurrentUserId();
            var measurements = await _measurementService.GetMyMeasurementsAsync(userId);
            return Ok(ApiResponse<IEnumerable<UserMeasurementDto>>.Ok(measurements, "Measurements retrieved successfully"));
        }

        /// <summary>
        /// Obtiene una medida específica del usuario autenticado
        /// </summary>
        /// <param name="id">ID de la medida</param>
        /// <response code="200">Medida obtenida exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Medida no encontrada</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<UserMeasurementDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetCurrentUserId();
            var measurement = await _measurementService.GetMyMeasurementByIdAsync(id, userId);
            return Ok(ApiResponse<UserMeasurementDto>.Ok(measurement, "Measurement retrieved successfully"));
        }

        /// <summary>
        /// Crea una nueva medida para el usuario autenticado
        /// </summary>
        /// <param name="dto">Datos de la medida: measurementTypeId, value, unitId</param>
        /// <response code="201">Medida creada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<UserMeasurementDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Create([FromBody] CreateUserMeasurementDto dto)
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
            var created = await _measurementService.CreateAsync(userId, dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                ApiResponse<UserMeasurementDto>.Ok(created, "Measurement created successfully"));
        }

        /// <summary>
        /// Actualiza una medida del usuario autenticado
        /// </summary>
        /// <param name="id">ID de la medida</param>
        /// <param name="dto">Campos a actualizar: value, unitId</param>
        /// <response code="200">Medida actualizada exitosamente</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Medida no encontrada</response>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<UserMeasurementDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserMeasurementDto dto)
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
            var updated = await _measurementService.UpdateAsync(id, userId, dto);
            return Ok(ApiResponse<UserMeasurementDto>.Ok(updated, "Measurement updated successfully"));
        }

        /// <summary>
        /// Elimina una medida del usuario autenticado
        /// </summary>
        /// <param name="id">ID de la medida</param>
        /// <response code="204">Medida eliminada exitosamente</response>
        /// <response code="401">No autenticado</response>
        /// <response code="404">Medida no encontrada</response>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();
            await _measurementService.DeleteAsync(id, userId);
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
