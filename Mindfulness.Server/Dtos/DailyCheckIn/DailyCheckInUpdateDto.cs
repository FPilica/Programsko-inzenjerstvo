namespace Mindfulness.Server.Dtos.DailyCheckIn;

public class DailyCheckInUpdateDto
{
    public int? Mood { get; set; }
    
    public int? PhysicalActivity { get; set; }
    
    public int? Caffeine { get; set; }
    
    public int? SleepScore { get; set; }
    
    public int? Alcohol { get; set; }
}