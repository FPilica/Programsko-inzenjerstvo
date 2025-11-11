using AutoMapper;
using Mindfulness.Server.Dtos.AudioLanguage;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mappers;

public class AudioLanguageMapper : Profile
{
    public AudioLanguageMapper() {
        CreateMap<AudioLanguageCreateDto, AudioLanguage>();
        CreateMap<AudioLanguageUpdateDto, AudioLanguage>();
        CreateMap<AudioLanguage, AudioLanguageDetailsDto>();
    }
}
