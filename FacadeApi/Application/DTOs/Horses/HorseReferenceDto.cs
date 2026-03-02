namespace Application.DTOs.Horses
{
    public class HorseReferenceDto
    {
        public List<BreedDto> Breeds { get; set; } = new();
        public List<DisciplineDto> Disciplines { get; set; } = new();
        public List<HorseLevelDto> Levels { get; set; } = new();
    }
}
