namespace Mindfulness.Server.Dtos.Motivation;

public class MotivationDetailsDto
{
    public Guid Id { get; set; }

    public required string Message { get; set; }
}