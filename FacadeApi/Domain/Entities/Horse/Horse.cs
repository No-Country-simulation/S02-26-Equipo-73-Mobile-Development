using Domain.Entities.Identity;
using Domain.Enums;

namespace Domain.Entities.Horse
{
    public class Horse
    {
        public int Id { get; set; }

        public int OwnerId { get; set; }
        public virtual ApplicationUser Owner { get; set; }

        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public HorseSex Sex { get; set; }

        public int BreedId { get; set; }
        public virtual Breed Breed { get; set; }

        public int DisciplineId { get; set; }
        public virtual Discipline Discipline { get; set; }

        public int LevelId { get; set; }
        public virtual HorseLevel Level { get; set; }

        public bool IsActive { get; set; }

        public HorseMeasurement? Measurement { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
