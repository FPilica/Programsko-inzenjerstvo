using AutoMapper;
using Mindfulness.Server.Dtos.Motivation;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mappers;

public class MotivationMapper : Profile
{
    public MotivationMapper() {

        CreateMap<MotivationCreateDto, Motivation>();
        CreateMap<MotivationUpdateDto, Motivation>();
        CreateMap<Motivation, MotivationDetailsDto>();
    }
}