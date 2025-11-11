using AutoMapper;
using Mindfulness.Server.Dtos.StartQuestionnaire;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mappers;

public class StartQuestionnaireMapper : Profile
{
    public StartQuestionnaireMapper() {
        CreateMap<StartQuestionnaireCreateDto, StartQuestionnaire>();
        CreateMap<StartQuestionnaireUpdateDto, StartQuestionnaire>();
        CreateMap<StartQuestionnaire, StartQuestionnaireDetailsDto>();
    }
}