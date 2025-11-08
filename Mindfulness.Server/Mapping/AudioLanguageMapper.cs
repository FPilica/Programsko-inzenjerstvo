using Mindfulness.Server.Dtos.AudioLanguage;
using Mindfulness.Server.Models;
using AutoMapper;
namespace Mindfulness.Server.Mapping;

public class AudioLanguageMapper : Profile
{
    public AudioLanguageMapper() {
        CreateMap<AudioLanguageCreateDto, AudioLanguage>();
        CreateMap<AudioLanguageUpdateDto, AudioLanguage>();
        CreateMap<AudioLanguage, AudioLanguageDetailsDto>();
    }
}
