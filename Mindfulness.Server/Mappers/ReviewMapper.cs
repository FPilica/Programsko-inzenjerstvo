using AutoMapper;
using Mindfulness.Server.Dtos.Review;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mappers;

public class ReviewMapper : Profile
{
    public ReviewMapper() {
        CreateMap<ReviewCreateDto, Review>();
        CreateMap<ReviewUpdateDto, Review>();
        CreateMap<Review, ReviewDetailsDto>();
    }
}
