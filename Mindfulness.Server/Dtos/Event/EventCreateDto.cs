namespace Mindfulness.Server.Dtos.Event;

public class EventCreateDto
{
    public required string Title { get; set; }

    public string? Description { get; set; }
    
    public DateTimeOffset StartTime { get; set; }
    
    public DateTimeOffset EndTime { get; set; }
    
    public Guid UserId { get; set; }
}