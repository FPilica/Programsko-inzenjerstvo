using AutoMapper;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Mapping;

public class UserMapper : Profile
{
    public UserMapper() {
        CreateMap<UserRegisterDto, User>();
        CreateMap<UserUpdateDto, User>();
        CreateMap<User, UserDetailsDto>();
    }
}