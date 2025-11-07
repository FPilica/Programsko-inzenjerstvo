using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Models;

public class User : IdentityUser<Guid>
{
    [MaxLength(30)]
    public string FirstName { get; set; }
    
    [MaxLength(30)]
    public string LastName { get; set; }
    
    public Gender Gender { get; set; }
    
    public DateTimeOffset DateOfBirth { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;
    
    public bool IsExternalAccount { get; set; }
    
    public string? Provider { get; set; }
    
    public string? ProviderKey { get; set; }
    
    public StartQuestionnaire StartQuestionnaire { get; set; }

    public List<DailyCheckIn> DailyCheckIns { get; set; } = [];
    
    public List<Event> Events { get; set; } = [];
    
    public List<Review> Reviews { get; set; } = [];
    
    public List<Content> Contents { get; set; } = [];
    
    public List<Challenge> Challenges { get; set; } = [];
    
    public List<UserSetting> UserSettings { get; set; } = [];
}