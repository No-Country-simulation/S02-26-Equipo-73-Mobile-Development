namespace Application.DTOs.Horses
{
    public class HorseDto
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public string Sex { get; set; }

        public int BreedId { get; set; }
        public string BreedName { get; set; }

        public int DisciplineId { get; set; }
        public string DisciplineName { get; set; }

        public int LevelId { get; set; }
        public string LevelName { get; set; }

        public bool IsActive { get; set; }
        public HorseMeasurementDto? Measurement { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
