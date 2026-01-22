using System.ComponentModel.DataAnnotations;
using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Models;

public class Challenge
{
    public Guid Id { get; set; }
    
    [MaxLength(30)]
    public required string Title { get; set; }
    
    [MaxLength(300)]
    public string? Description { get; set; }
    
    public Difficulty Difficulty { get; set; }
    
    public TimeSpan Duration { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;
    
    public List<User> Users { get; set; } = [];
}