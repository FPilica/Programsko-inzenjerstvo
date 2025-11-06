using System.ComponentModel.DataAnnotations;

namespace Mindfulness.Server.Models;

public class Event
{
    public Guid Id { get; set; }
    
    [MaxLength(30)]
    public string Title { get; set; }
    
    [MaxLength(300)]
    public string? Description { get; set; }
    
    public DateTimeOffset StartTime { get; set; }
    
    public DateTimeOffset EndTime { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
}