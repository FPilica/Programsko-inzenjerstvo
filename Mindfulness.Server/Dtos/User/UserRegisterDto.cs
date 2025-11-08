using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.User;

public class UserRegisterDto
{
    //stvari koje koristimo prilikom registracije
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }
    
    public Gender Gender { get; set; }
    
    public DateTimeOffset DateOfBirth { get; set; }
    
    public required string Email { get; set; }
    
    public required string Password { get; set; }
    
    public required string Username { get; set; }
}