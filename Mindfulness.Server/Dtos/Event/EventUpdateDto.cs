namespace Mindfulness.Server.Dtos.Event;

public class EventUpdateDto
{
    public string? Title { get; set; }

    public string? Description { get; set; }
    
    public DateTimeOffset? StartTime { get; set; }
    
    public DateTimeOffset? EndTime { get; set; }
    
    public Guid? ContentId { get; set; }
}