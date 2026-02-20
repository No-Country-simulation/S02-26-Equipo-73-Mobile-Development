using Domain.Entities.Identity;

namespace Domain.Entities
{
    public class Brand
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Auditoría
        public int? CreatedBy { get; set; }
        public virtual ApplicationUser? CreatedByUser { get; set; }

        public int? UpdatedBy { get; set; }
        public virtual ApplicationUser? UpdatedByUser { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
