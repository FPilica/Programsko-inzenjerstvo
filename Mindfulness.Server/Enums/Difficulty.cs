using System.Text.Json.Serialization;

namespace Mindfulness.Server.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<Difficulty>))]
public enum Difficulty
{
    VeryEasy,
    Easy,
    Medium,
    Hard,
    VeryHard,
}