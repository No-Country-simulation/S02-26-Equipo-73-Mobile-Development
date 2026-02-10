namespace Domain.Entities
{
    public class BrandSize
    {
        public int Id { get; set; }

        public int BrandId { get; set; }
        public virtual Brand Brand { get; set; }

        public int CategoryId { get; set; }
        public virtual ProductCategory Category { get; set; }

        public int SizeSystemId { get; set; }
        public SizeSystem SizeSystem { get; set; }

        public string Label { get; set; }
        // 42, L, Regular, etc
    }
}
