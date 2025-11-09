namespace Mindfulness.Server.Dtos.UserSetting;

public class UserSettingCreateDto
{
    public Guid SettingId { get; set; }
    
    public Guid UserId { get; set; }
    
    public required string Value { get; set; }
}