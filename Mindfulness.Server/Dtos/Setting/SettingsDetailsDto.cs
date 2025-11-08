namespace Mindfulness.Server.Dtos.Setting;

public class SettingsDetailsDto
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }
}