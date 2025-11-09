using AutoMapper;
using Mindfulness.Server.Dtos.ContentCategory;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mapping;

public class ContentCategoryMapper : Profile
{
    public ContentCategoryMapper() {
        CreateMap<ContentCategoryCreateDto, ContentCategory>();
        CreateMap<ContentCategoryUpdateDto, ContentCategory>();
        CreateMap<ContentCategory, ContentCategoryDetailsDto>();
    }
}
