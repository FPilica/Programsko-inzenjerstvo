using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.Challenge;

public class ChallengeDetailsDto
{
    public Guid Id { get; set; }
    
    public required string Title { get; set; }
    
    public string? Description { get; set; }
    
    public Difficulty Difficulty { get; set; }
    
    public TimeSpan Duration { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    
    public List<Models.User> Users { get; set; } = [];
}