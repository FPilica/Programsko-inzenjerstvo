using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Enums;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AudioLanguageController(MindfulnessDbContext context, IMapper mapper) : ControllerBase
{
    private readonly IMapper _mapper = mapper;

    [HttpGet]
    public async Task<IActionResult> GetAudioLanguage()
    {
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        
        var events = await context.Events.Where(sq => sq.UserId == userGuid).ToListAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAudioLnaguage([FromBody] Event @event)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        context.Events.Add(@event);
        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAudioLanguage(Guid id, [FromBody] Event newEvent)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
        {
            return BadRequest("User not found");
        }
        var userGuid = Guid.Parse(userId);
        var eventForChange = await context.Events.FirstOrDefaultAsync(e => e.UserId == userGuid && e.Id == id);
        if (eventForChange is null)
        {
            return NotFound();
        }
        
        eventForChange.Title = newEvent.Title ?? eventForChange.Title;
        eventForChange.Description = newEvent.Description ?? eventForChange.Description;

        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAudioLanguage(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var @event = await context.Events.FindAsync(id);

        if (@event != null && userId.CompareTo(@event.UserId) == 0)
        {
            context.Events.Remove(@event);
            await context.SaveChangesAsync();
        }
        else
        {
            return BadRequest("Event not found");
        }
        
        return NoContent();
    }
    
}