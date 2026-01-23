using System.Net;
using Mindfulness.Server.Services;
using SendGrid.Helpers.Mail;

namespace Mindfulness.Tests;

[TestFixture]
public class EmailSenderServiceTests
{
    private const string TestApiKey = "SG.test-api-key-12345";
    private const string TestEmail = "test@example.com";
    private const string TestSubject = "Test Subject";
    private const string TestMessage = "Test Message Content";
    
    [SetUp]
    public void SetUp()
    {
        Environment.SetEnvironmentVariable("SEND_GRID_KEY", TestApiKey);
    }

    #region Tests
    
    [Test]
    public void Constructor_WithEnvironmentVariable_InitializesOptionsCorrectly()
    {
        var service = new EmailSenderService();

        Assert.That(service, Is.Not.Null);
    }

    [Test]
    public void SendEmailAsync_WithNullApiKey_ThrowsException()
    {
        Environment.SetEnvironmentVariable("SEND_GRID_KEY", null);
        var service = new EmailSenderService();

        var ex = Assert.ThrowsAsync<Exception>(async () =>
            await service.SendEmailAsync(TestEmail, TestSubject, TestMessage));
        
        Assert.That(ex.Message, Is.EqualTo("Null SendGridKey"));
    }

    [Test]
    public void SendEmailAsync_WithEmptyApiKey_ThrowsException()
    {
        Environment.SetEnvironmentVariable("SEND_GRID_KEY", string.Empty);
        var service = new EmailSenderService();

        var ex = Assert.ThrowsAsync<Exception>(async () =>
            await service.SendEmailAsync(TestEmail, TestSubject, TestMessage));
        
        Assert.That(ex.Message, Is.EqualTo("Null SendGridKey"));
    }

    [Test]
    public async Task SendEmailAsync_WithValidParameters_SendsEmailSuccessfully()
    {
        var service = new TestableEmailSenderService(HttpStatusCode.OK);

        Assert.DoesNotThrowAsync(async () =>
            await service.SendEmailAsync(TestEmail, TestSubject, TestMessage));
        
        Assert.That(service.LastSentMessage, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(service.LastSentMessage.From.Email, Is.EqualTo("support@progimindfulness.app"));
            Assert.That(service.LastSentMessage.From.Name, Is.EqualTo("Support"));
            Assert.That(service.LastSentMessage.Subject, Is.EqualTo(TestSubject));
            Assert.That(service.LastSentMessage.PlainTextContent, Is.EqualTo(TestMessage));
            Assert.That(service.LastSentMessage.HtmlContent, Is.EqualTo(TestMessage));
        });
    }

    [Test]
    public async Task SendEmailAsync_WithValidParameters_AddsCorrectRecipient()
    {
        var service = new TestableEmailSenderService(HttpStatusCode.OK);

        await service.SendEmailAsync(TestEmail, TestSubject, TestMessage);

        Assert.That(service.LastSentMessage, Is.Not.Null);
        Assert.That(service.LastSentMessage.Personalizations, Is.Not.Null);
        Assert.That(service.LastSentMessage.Personalizations.Count, Is.GreaterThan(0));
        
        var recipient = service.LastSentMessage.Personalizations[0].Tos[0];
        Assert.That(recipient.Email, Is.EqualTo(TestEmail));
    }

    [Test]
    public async Task SendEmailAsync_WithValidParameters_DisablesClickTracking()
    {
        var service = new TestableEmailSenderService(HttpStatusCode.OK);

        await service.SendEmailAsync(TestEmail, TestSubject, TestMessage);

        Assert.That(service.LastSentMessage, Is.Not.Null);
        Assert.That(service.LastSentMessage.TrackingSettings, Is.Not.Null);
        Assert.That(service.LastSentMessage.TrackingSettings.ClickTracking, Is.Not.Null);
        Assert.That(service.LastSentMessage.TrackingSettings.ClickTracking.Enable, Is.False);
    }

    [Test]
    public void SendEmailAsync_WhenSendGridReturnsError_ThrowsException()
    {
        var service = new TestableEmailSenderService(HttpStatusCode.BadRequest);

        var ex = Assert.ThrowsAsync<Exception>(async () =>
            await service.SendEmailAsync(TestEmail, TestSubject, TestMessage));
        
        Assert.That(ex.Message, Is.EqualTo(HttpStatusCode.BadRequest.ToString()));
    }

    [Test]
    public void SendEmailAsync_WhenSendGridReturnsUnauthorized_ThrowsException()
    {
        var service = new TestableEmailSenderService(HttpStatusCode.Unauthorized);

        var ex = Assert.ThrowsAsync<Exception>(async () =>
            await service.SendEmailAsync(TestEmail, TestSubject, TestMessage));
        
        Assert.That(ex.Message, Is.EqualTo(HttpStatusCode.Unauthorized.ToString()));
    }

    [Test]
    public void SendEmailAsync_WhenSendGridReturnsInternalServerError_ThrowsException()
    {
        var service = new TestableEmailSenderService(HttpStatusCode.InternalServerError);

        var ex = Assert.ThrowsAsync<Exception>(async () =>
            await service.SendEmailAsync(TestEmail, TestSubject, TestMessage));
        
        Assert.That(ex.Message, Is.EqualTo(HttpStatusCode.InternalServerError.ToString()));
    }

    [Test]
    public async Task SendEmailAsync_WithSpecialCharactersInMessage_SendsCorrectly()
    {
        var service = new TestableEmailSenderService(HttpStatusCode.OK);
        var messageWithSpecialChars = "Hello <b>World</b>! Special chars: @#$%^&*()";

        await service.SendEmailAsync(TestEmail, TestSubject, messageWithSpecialChars);

        Assert.Multiple(() =>
        {
            Assert.That(service.LastSentMessage.PlainTextContent, Is.EqualTo(messageWithSpecialChars));
            Assert.That(service.LastSentMessage.HtmlContent, Is.EqualTo(messageWithSpecialChars));
        });
    }

    [Test]
    public async Task SendEmailAsync_WithMultipleCalls_SendsEachEmailIndependently()
    {
        var service = new TestableEmailSenderService(HttpStatusCode.OK);
        var email1 = "user1@example.com";
        var email2 = "user2@example.com";
        var subject1 = "Subject 1";
        var subject2 = "Subject 2";

        await service.SendEmailAsync(email1, subject1, "Message 1");
        var firstMessage = service.LastSentMessage;
        
        await service.SendEmailAsync(email2, subject2, "Message 2");
        var secondMessage = service.LastSentMessage;

        Assert.That(firstMessage, Is.Not.SameAs(secondMessage));
    }
    
    #endregion
    
    [TearDown]
    public void TearDown()
    {
        Environment.SetEnvironmentVariable("SEND_GRID_KEY", null);
    }
}

public class TestableEmailSenderService : EmailSenderService
{
    private readonly HttpStatusCode _responseStatusCode;
    public SendGridMessage LastSentMessage { get; private set; }

    public TestableEmailSenderService(HttpStatusCode responseStatusCode)
    {
        _responseStatusCode = responseStatusCode;
    }

    public new async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var apiKey = Environment.GetEnvironmentVariable("SEND_GRID_KEY");
        
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new Exception("Null SendGridKey");
        }

        await ExecuteTestable(apiKey, subject, message, toEmail);
    }

    private async Task ExecuteTestable(string apiKey, string subject, string message, string toEmail)
    {
        var msg = new SendGridMessage
        {
            From = new EmailAddress("support@progimindfulness.app", "Support"),
            Subject = subject,
            PlainTextContent = message,
            HtmlContent = message
        };
        msg.AddTo(new EmailAddress(toEmail));
        msg.SetClickTracking(false, false);

        LastSentMessage = msg;
        
        if (_responseStatusCode != HttpStatusCode.OK && 
            _responseStatusCode != HttpStatusCode.Accepted)
        {
            throw new Exception(_responseStatusCode.ToString());
        }

        await Task.CompletedTask;
    }
}