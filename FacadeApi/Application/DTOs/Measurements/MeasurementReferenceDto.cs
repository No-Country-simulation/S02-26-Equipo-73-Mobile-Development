namespace Application.DTOs.Measurements
{
    public class MeasurementReferenceDto
    {
        /// <summary>
        /// Tipos de medida agrupados por entidad (Rider, Horse, Product)
        /// </summary>
        public List<EntityTypeReferenceDto> EntityTypes { get; set; } = new();

        /// <summary>
        /// Unidades de medida disponibles
        /// </summary>
        public List<MeasurementUnitReferenceDto> Units { get; set; } = new();
    }

    public class EntityTypeReferenceDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        /// <summary>
        /// Tipos de medida disponibles para esta entidad
        /// </summary>
        public List<MeasurementTypeReferenceDto> MeasurementTypes { get; set; } = new();
    }

    public class MeasurementTypeReferenceDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class MeasurementUnitReferenceDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
    }
}
