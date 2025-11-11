using AutoMapper;
using Mindfulness.Server.Dtos.Setting;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mappers;

public class SettingMapper : Profile
{
    public SettingMapper() {
        CreateMap<SettingsCreateDto, Setting>();
        CreateMap<SettingsUpdateDto, Setting>();
        CreateMap<Setting, SettingsDetailsDto>();
    }
}