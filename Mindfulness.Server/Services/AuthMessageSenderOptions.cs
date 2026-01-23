namespace Mindfulness.Server.Services;

public class AuthMessageSenderOptions
{
    public const string SectionName = "SendGrid";
    
    public string? Key { get; set; }
}