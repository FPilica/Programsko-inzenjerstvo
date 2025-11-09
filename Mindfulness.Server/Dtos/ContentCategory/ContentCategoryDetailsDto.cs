namespace Mindfulness.Server.Dtos.ContentCategory;

public class ContentCategoryDetailsDto
{
    public Guid Id { get; set; }

    public required string Name { get; set; }
    
    public List<Models.Content> Contents { get; set; } = [];
}