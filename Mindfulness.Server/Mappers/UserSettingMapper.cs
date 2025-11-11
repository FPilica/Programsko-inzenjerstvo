using AutoMapper;
using Mindfulness.Server.Dtos.UserSetting;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mappers;

public class UserSettingMapper : Profile
{
    public UserSettingMapper() {
        CreateMap<UserSettingCreateDto, UserSetting>();
        CreateMap<UserSettingUpdateDto, UserSetting>();
        CreateMap<UserSetting, UserSettingDetailsDto>();
    }
}