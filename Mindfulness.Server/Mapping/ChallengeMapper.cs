using AutoMapper;
using Mindfulness.Server.Dtos.Challenge;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mapping;

public class ChallengeMapper : Profile
{
    public ChallengeMapper() {
        CreateMap<ChallengeCreateDto, Challenge>();
        CreateMap<ChallengeUpdateDto, Challenge>();
        CreateMap<Challenge, ChallengeDetailsDto>();
    }
}
