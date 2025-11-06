namespace Mindfulness.Server.Models;

public class DailyCheckIn
{
    public Guid Id { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;
    
    public int? Mood { get; set; }
    
    public int? PhysicalActivity { get; set; }
    
    public int? Caffeine { get; set; }
    
    public int? SleepScore { get; set; }
    
    public int? Alcohol { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
}