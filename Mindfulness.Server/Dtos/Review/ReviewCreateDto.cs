namespace Mindfulness.Server.Dtos.Review;

public class ReviewCreateDto
{
    public int Rating { get; set; }

    public string? Comment { get; set; }
    
    public Guid UserId { get; set; }
    
    public Guid ContentId { get; set; }
}