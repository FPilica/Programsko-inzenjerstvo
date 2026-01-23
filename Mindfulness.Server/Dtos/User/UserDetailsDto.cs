using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.User;

public class UserDetailsDto
{
    //prikaz detalja o korisniku
    public Guid Id { get; set; }
    
    public required string Role {get; set;}
    
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }
    
    public Gender Gender { get; set; }
    
    public DateTimeOffset DateOfBirth { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }
    
    public DateTimeOffset LastCheckin { get; set; }

    public DateTimeOffset LastFocus { get; set; }

    public int Streak { get; set; }
}