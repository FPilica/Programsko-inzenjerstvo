namespace Mindfulness.Server.Dtos.DailyCheckIn;

public class DailyCheckInDetailsDto
{
    public Guid Id { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }
    
    public int? Mood { get; set; }
    
    public int? PhysicalActivity { get; set; }
    
    public int? Caffeine { get; set; }
    
    public int? SleepScore { get; set; }
    
    public int? Alcohol { get; set; }
    
    public string? DailyNotes { get; set; }

    public required Models.User User { get; set; }
}