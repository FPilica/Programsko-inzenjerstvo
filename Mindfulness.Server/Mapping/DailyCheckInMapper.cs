using AutoMapper;
using Mindfulness.Server.Dtos.DailyCheckIn;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mapping;

public class DailyCheckInMapper : Profile
{
    public DailyCheckInMapper() {
        CreateMap<DailyCheckInCreateDto, DailyCheckIn>();
        CreateMap<DailyCheckInUpdateDto, DailyCheckIn>();
        CreateMap<DailyCheckIn, DailyCheckInDetailsDto>();
    }
}
