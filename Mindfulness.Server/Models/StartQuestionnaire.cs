namespace Mindfulness.Server.Models;

public class StartQuestionnaire
{
    public Guid Id { get; set; }
    
    public int PFocus { get; set; }
    
    public int PSleep { get; set; }
    
    public int PBreathing { get; set; }
    
    public int PStress { get; set; }
    
    public int PAnxiety { get; set; }
    
    public int PGratefulness { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
}