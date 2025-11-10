using System.ComponentModel.DataAnnotations;

namespace Mindfulness.Server.Models;

public class Setting
{
    public Guid Id { get; set; }
    
    [MaxLength(30)]
    public required string Name { get; set; }
    
    [MaxLength(300)]
    public string? Description { get; set; }
    
    public List<UserSetting>? UserSettings { get; set; }
}