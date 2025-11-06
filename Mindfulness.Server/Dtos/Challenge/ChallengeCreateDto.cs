using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.Challenge;

public class ChallengeCreateDto
{
    public required string Title { get; set; }
    
    public string? Description { get; set; }
    
    public Difficulty Difficulty { get; set; }
    
    public TimeSpan Duration { get; set; }
}