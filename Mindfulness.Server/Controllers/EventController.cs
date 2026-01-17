using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.Event;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class EventController(MindfulnessDbContext context, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetEvents()
    {
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        
        var events = await context.Events.Where(sq => sq.UserId == userGuid).ToListAsync();

        return Ok(mapper.Map<List<EventDetailsDto>>(events));
    }

    [HttpPost]
    public async Task<ActionResult<EventCreateDto>> CreateEvent([FromBody] EventCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }

        if (dto.ContentId is not null)
        {
            var postojiContent = await context.Contents.AnyAsync(c => c.Id == dto.ContentId.Value);
            if (!postojiContent)
            {
                return BadRequest("Content not found");
            }
        }
        
        var userGuid = Guid.Parse(userId);
        
        var newEvent = mapper.Map<Event>(dto);
        newEvent.Id = Guid.NewGuid();
        newEvent.UserId = userGuid;
        context.Events.Add(newEvent);
        await context.SaveChangesAsync();

        return Ok(mapper.Map<EventDetailsDto>(newEvent));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<EventUpdateDto>> UpdateEvent(Guid id, [FromBody] EventUpdateDto newEvent)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        if (newEvent.ContentId is not null)
        {
            var postojiContent = await context.Contents.AnyAsync(c => c.Id == newEvent.ContentId.Value);
            if (!postojiContent)
            {
                return BadRequest("Content not found");
            }
        }
        
        var userGuid = Guid.Parse(userId);
        var eventForChange = await context.Events.FirstOrDefaultAsync(e => e.UserId == userGuid && e.Id == id);
        if (eventForChange is null)
        {
            return NotFound();
        }
        
        eventForChange.AllDay = newEvent.AllDay ?? eventForChange.AllDay;
        eventForChange.EndTime = newEvent.EndTime ?? eventForChange.EndTime;
        eventForChange.StartTime = newEvent.StartTime ?? eventForChange.StartTime;
        eventForChange.ContentId = newEvent.ContentId ?? eventForChange.ContentId;
        eventForChange.Title = newEvent.Title ?? eventForChange.Title;
        eventForChange.Description = newEvent.Description ?? eventForChange.Description;

        await context.SaveChangesAsync();

        return Ok(mapper.Map<EventDetailsDto>(eventForChange));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        
        var @event = await context.Events.FindAsync(id);

        if (@event != null && @event.UserId == userGuid)
        {
            context.Events.Remove(@event);
            await context.SaveChangesAsync();
        }
        else
        {
            return BadRequest("Event not found");
        }
        
        return Ok();
    }
}