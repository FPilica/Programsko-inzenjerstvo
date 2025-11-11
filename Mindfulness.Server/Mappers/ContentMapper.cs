using AutoMapper;
using Mindfulness.Server.Dtos.Content;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mappers;

public class ContentMapper : Profile
{
    public ContentMapper() {
        CreateMap<ContentCreateDto, Content>();
        CreateMap<ContentUpdateDto, Content>();
        CreateMap<Content, ContentDetailsDto>();
    }    
}
