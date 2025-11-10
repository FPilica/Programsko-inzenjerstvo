using System.ComponentModel.DataAnnotations;

namespace Mindfulness.Server.Models;

public class Review
{
    public Guid Id { get; set; }
    
    public int Rating { get; set; }
    
    [MaxLength(300)]
    public string? Comment { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;
    
    public Guid UserId { get; set; }
    public required User User { get; set; }
    
    public Guid ContentId { get; set; }
    public required Content Content { get; set; }
}