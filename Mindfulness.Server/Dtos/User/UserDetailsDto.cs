using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.User;

public class UserDetailsDto
{
    public Guid Id { get; set; }
    
    public required string Role {get; set;}
    
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }
    
    public required string Email { get; set; }
    
    public Gender Gender { get; set; }
    
    public DateTimeOffset DateOfBirth { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }
}