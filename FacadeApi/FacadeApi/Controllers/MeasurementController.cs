using Application.Common;
using Application.DTOs.Measurements;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FacadeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = "ApiJwt")]
    public class MeasurementController : ControllerBase
    {

        private readonly IMeasurementReferenceService _referenceService;

        public MeasurementController(IMeasurementReferenceService referenceService)
        {
            _referenceService = referenceService;
        }

        /// <summary>
        /// Devuelve todos los datos de referencia para construir el formulario de medidas:
        /// tipos agrupados por entidad (Rider, Horse, Product) y unidades disponibles
        /// </summary>
        /// <response code="200">Datos de referencia obtenidos exitosamente</response>
        /// <response code="401">No autenticado</response>
        [HttpGet("reference")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<MeasurementReferenceDto>), StatusCodes.Status200OK)]
        //[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetReference()
        {
            var data = await _referenceService.GetReferenceDataAsync();
            return Ok(ApiResponse<MeasurementReferenceDto>.Ok(data, "Reference data retrieved successfully"));
        }

    }
}
