namespace Mindfulness.Server.Dtos.Review;

public class ReviewDetailsDto
{
    public Guid Id { get; set; }
    
    public int Rating { get; set; }

    public string? Comment { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }

    public required Guid UserId { get; set; }

    public required Guid ContentId { get; set; }
}