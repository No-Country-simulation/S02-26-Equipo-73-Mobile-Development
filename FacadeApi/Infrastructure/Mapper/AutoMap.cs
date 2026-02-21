using AutoMapper;
using Application.DTOs.Identity;
using Application.DTOs.Products;
using Domain.Entities.Identity;
using Domain.Entities.Products;

namespace Infrastructure.Mapper
{
    public class AutoMap : Profile
    {
        public AutoMap() 
        {
            // Product mappings
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.Name))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Media, opt => opt.MapFrom(src => src.MediaProducts))
                .ForMember(dest => dest.Variants, opt => opt.MapFrom(src => src.Variants));

            CreateMap<ProductVariant, ProductVariantDto>()
                .ForMember(dest => dest.SizeLabel, opt => opt.MapFrom(src => src.BrandSize.Label));

            CreateMap<CreateProductDto, Product>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Brand, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Variants, opt => opt.Ignore())
                .ForMember(dest => dest.MediaProducts, opt => opt.Ignore());

            CreateMap<UpdateProductDto, Product>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Brand, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Variants, opt => opt.Ignore())
                .ForMember(dest => dest.MediaProducts, opt => opt.Ignore());

            // MediaProduct mappings
            CreateMap<MediaProduct, MediaProductDto>()
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Url));

            CreateMap<MediaProductInputDto, MediaProduct>()
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Value))
                .ForMember(dest => dest.Product, opt => opt.Ignore())
                .ForMember(dest => dest.ProductId, opt => opt.Ignore());

            // ApplicationUser mappings
            CreateMap<ApplicationUser, UserDto>()
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => 
                    src.UserRoles.Select(ur => ur.Role).ToList()));

            CreateMap<CreateUserDto, ApplicationUser>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ProfileImageUrl, opt => opt.MapFrom(src => src.ProfileImage))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

            // Role mappings
            CreateMap<Role, RoleDto>();
        }
    }
}
