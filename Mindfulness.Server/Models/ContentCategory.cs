using System.ComponentModel.DataAnnotations;

namespace Mindfulness.Server.Models;

public class ContentCategory
{
    public Guid Id { get; set; }
    
    [MaxLength(30)]
    public required string Name { get; set; }
    
    public List<Content> Contents { get; set; } = [];
}