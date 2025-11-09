using System.Text.Json.Serialization;

namespace Mindfulness.Server.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<Gender>))]
public enum Gender
{
    Male,
    Female,
    Undefined
}