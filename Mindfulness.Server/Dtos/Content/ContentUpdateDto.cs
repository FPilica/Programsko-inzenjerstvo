using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.Content;

public class ContentUpdateDto
{
    public required string Title { get; set; }
    
    public string? Description { get; set; }
    
    public Difficulty? Difficulty { get; set; }
    
    public TimeSpan? Duration { get; set; }
    
    public Guid CategoryId { get; set; }

    public Guid? AudioLanguageId { get; set; }
}