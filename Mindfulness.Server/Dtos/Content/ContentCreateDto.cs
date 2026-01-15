using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.Content;

public class ContentCreateDto
{
    public required string Title { get; set; }
    
    public string? Description { get; set; }
    
    public Difficulty? Difficulty { get; set; }
    
    public TimeSpan? Duration { get; set; }
    
    public Guid UserId { get; set; }
    
    public Guid CategoryId { get; set; }
    
    public string? ContentType { get; set; }

    public string? ContentLink { get; set; }

    public string? ThumbnailLink { get; set; }
    
    public Guid? AudioLanguageId { get; set; }
}