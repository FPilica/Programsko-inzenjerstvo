using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.Content;

public class ContentDetailsDto
{
    public Guid Id { get; set; }
    
    public required string Title { get; set; }
    
    public string? Description { get; set; }
    
    public Difficulty? Difficulty { get; set; }
    
    public TimeSpan? Duration { get; set; }
    
    public DateTimeOffset UploadedAt { get; set; }
    
    public required Models.User User { get; set; }
    
    public required Models.ContentCategory Category { get; set; }
    
    public string? ContentType { get; set; }
    
    public string? ContentLink { get; set; }

    public string? ThumbnailLink { get; set; }
    
    public Guid AudioLanguage { get; set; }

    public List<Guid> Reviews { get; set; } = [];
}