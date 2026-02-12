namespace Domain.Entities.Products
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        public int BrandId { get; set; }
        public virtual Brand Brand { get; set; }
        public int CategoryId { get; set; }
        public virtual ProductCategory Category { get; set; }
        public virtual ICollection<ProductVariant> Variants { get; set; }
        public virtual ICollection<MediaProduct> MediaProducts { get; set; }
    }
}
