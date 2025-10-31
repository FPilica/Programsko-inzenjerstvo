namespace Mindfulness.Server.Models;

public class UserSetting
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid SettingId { get; set; }
    public Setting Setting { get; set; } = null!;
    
    public string Value { get; set; }
}