namespace Mindfulness.Server.Dtos.Review;

public class ReviewDetailsDto
{
    public Guid Id { get; set; }
    
    public int Rating { get; set; }

    public string? Comment { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;

    public required Models.User User { get; set; }

    public required Models.Content Content { get; set; }
}