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
    public User User { get; set; }
    
    public Guid ContentId { get; set; }
    public Content Content { get; set; }
}