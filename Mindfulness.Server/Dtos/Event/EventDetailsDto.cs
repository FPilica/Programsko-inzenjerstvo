namespace Mindfulness.Server.Dtos.Event;

public class EventDetailsDto
{
    public Guid Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }
    
    public DateTimeOffset StartTime { get; set; }
    
    public DateTimeOffset EndTime { get; set; }

    public required Models.User User { get; set; }
}