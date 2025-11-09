namespace Mindfulness.Server.Dtos.Setting;

public class SettingsUpdateDto
{
    public required string Name { get; set; }

    public string? Description { get; set; }
}