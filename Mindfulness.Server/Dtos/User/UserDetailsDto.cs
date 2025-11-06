using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Mindfulness.Server.Enums;

namespace Mindfulness.Server.Dtos.User;

public class UserDetailsDto
{
    //prikaz detalja o korisniku
    public Guid Id { get; set; }
    
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }
    
    public Gender Gender { get; set; }
    
    public DateTimeOffset DateOfBirth { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }
    
    public List<Models.DailyCheckIn>? DailyCheckIns { get; set; }
    
    public List<Models.Event>? Events { get; set; }
    
    public List<Models.Review>? Reviews { get; set; }
    
    public List<Models.Content>? Contents { get; set; }
    
    public List<Models.Challenge>? Challenges { get; set; }
    
    public List<Models.UserSetting>? UserSettings { get; set; }
}