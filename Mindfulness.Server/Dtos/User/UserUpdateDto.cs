using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Mindfulness.Server.Enums;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Dtos.User;

public class UserUpdateDto
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }
    
    public Gender? Gender { get; set; }
    
    public DateTimeOffset? DateOfBirth { get; set; }
    
    public string? Email { get; set; }
    
    public string? Password { get; set; }
}