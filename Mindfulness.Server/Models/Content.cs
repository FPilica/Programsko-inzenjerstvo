using System.ComponentModel.DataAnnotations;
using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Models;

public class Content
{
    public Guid Id { get; set; }
    
    [MaxLength(30)]
    public required string Title { get; set; }
    
    [MaxLength(30000)]
    public string? Description { get; set; }
    
    public Difficulty? Difficulty { get; set; }
    
    public TimeSpan? Duration { get; set; }
    
    public DateTimeOffset UploadedAt { get; set; } = DateTimeOffset.Now;
    
    public Guid UserId { get; set; }
    public required User User { get; set; }
    
    public Guid CategoryId { get; set; }
    
    //je li video, podcast bla bla
    public required ContentCategory Category { get; set; }
    
    //je li za stres, meditaciju bla bla
    [MaxLength(50)]
    public required string? ContentType { get; set; }
    
    [MaxLength(300)]
    public string? ContentLink { get; set; }
    
    [MaxLength(300)]
    public string? ThumbnailLink { get; set; }
    
    public Guid? AudioLanguageId { get; set; }
    public AudioLanguage? AudioLanguage { get; set; }
    
    public List<Review> Reviews { get; set; } = [];
}