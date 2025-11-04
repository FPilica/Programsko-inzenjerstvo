namespace Mindfulness.Server.Dtos.UserSetting;

public class UserSettingDetailsDto
{
    public required Models.Setting Setting { get; set; }
    
    public required Models.User User { get; set; }
    
    public required string Value { get; set; }
}