using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Mindfulness.Server.Services;

public class EmailSender : IEmailSender
{
    public EmailSender(IOptions<AuthMessageSenderOptions> options)
    {
        Options = options.Value;
    }
    
    public AuthMessageSenderOptions Options { get; }
    
    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        if (string.IsNullOrEmpty(Options.Key))
        {
            throw new Exception("Null SendGridKey");
        }
        
        await Execute(Options.Key, subject, message, toEmail);
    }

    public async Task Execute(string apiKey, string subject, string message, string toEmail)
    {
        var client = new SendGridClient(apiKey);

        var msg = new SendGridMessage
        {
            From = new EmailAddress("support@mindfulness.com", "Support"),
            Subject = subject,
            PlainTextContent = message,
            HtmlContent = message
        };
        msg.AddTo(new EmailAddress(toEmail));
        
        msg.SetClickTracking(false, false);
        
        _ = await client.SendEmailAsync(msg);
    }
}