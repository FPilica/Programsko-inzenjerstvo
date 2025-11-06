using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Mindfulness.Server.Enums;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Dtos.User;

public class UserUpdateDto
{
    public required string FirstName { get; set; }

    public required string LastName { get; set; }
    
    public Gender Gender { get; set; }
    
    public DateTimeOffset DateOfBirth { get; set; }
    
    public required string Email { get; set; }
    
    public required string Password { get; set; }
}