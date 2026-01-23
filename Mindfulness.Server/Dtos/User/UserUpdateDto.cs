using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.User;

public class UserUpdateDto
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }
    
    public string? Role { get; set; }
    
    public Gender? Gender { get; set; }
    
    public DateTimeOffset? DateOfBirth { get; set; }
    
    public string? Email { get; set; }
}
