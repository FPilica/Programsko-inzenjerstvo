namespace Mindfulness.Server.Dtos.Setting;

public class SettingsCreateDto
{
    public required string Name { get; set; }

    public string? Description { get; set; }
}