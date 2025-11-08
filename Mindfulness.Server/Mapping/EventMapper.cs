using AutoMapper;
using Mindfulness.Server.Dtos.Event;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mapping
{
    public class EventMapper : Profile
    {

        public EventMapper() {
            CreateMap<EventCreateDto, Event>();
            CreateMap<EventUpdateDto, Event>();
            CreateMap<Event, EventDetailsDto>();
        }
    }
}
