namespace Mindfulness.Server.Dtos.AudioLanguage;

public class AudioLanguageDetailsDto
{
    public Guid Id { get; set; }
    
    public required string Name { get; set; }
    
    public List<Models.Content> Contents { get; set; } = [];
}