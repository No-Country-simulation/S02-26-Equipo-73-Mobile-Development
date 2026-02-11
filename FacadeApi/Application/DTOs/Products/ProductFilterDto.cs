using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Products
{
    public class ProductFilterDto
    {
        public int? BrandId { get; set; }
        public int? CategoryId { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "MinPrice must be greater than or equal to 0")]
        public decimal? MinPrice { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "MaxPrice must be greater than or equal to 0")]
        public decimal? MaxPrice { get; set; }
        
        public int? BrandSizeId { get; set; }
        
        public string SortBy { get; set; } // name, price, brand
        public bool SortDescending { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "PageNumber must be at least 1")]
        public int PageNumber { get; set; } = 1;
        
        [Range(1, 100, ErrorMessage = "PageSize must be between 1 and 100")]
        public int PageSize { get; set; } = 10;
    }
}
