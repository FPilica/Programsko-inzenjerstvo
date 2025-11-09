using AutoMapper;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mapping;

public class UserMapper : Profile
{
    public UserMapper() {
        CreateMap<UserCreateDto, User>();
        CreateMap<UserUpdateDto, User>();
        CreateMap<User, UserDetailsDto>();
    }
}