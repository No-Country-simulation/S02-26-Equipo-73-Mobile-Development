using Application.DTOs.Measurements;

namespace Application.Interfaces
{
    public interface IMeasurementReferenceService
    {
        /// <summary>
        /// Devuelve todos los datos de referencia necesarios para el formulario de medidas:
        /// tipos de medida agrupados por entidad y unidades disponibles.
        /// </summary>
        Task<MeasurementReferenceDto> GetReferenceDataAsync();
    }
}
