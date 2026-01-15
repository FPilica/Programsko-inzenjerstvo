using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Mindfulness.Server.Dtos.Event;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Enums;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[ApiController]
[Route("api/[controller]")]

public class EventController(MindfulnessDbContext context, IMapper mapper) : ControllerBase
{
    private readonly IMapper _mapper = mapper;

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

        return Ok(_mapper.Map<List<EventDetailsDto>>(events));
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] EventCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        
        
        var userGuid = Guid.Parse(userId);
        
        var newEvent = _mapper.Map<Event>(dto);
        newEvent.Id = Guid.NewGuid();
        newEvent.UserId = userGuid;
        context.Events.Add(newEvent);
        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] EventUpdateDto newEvent)
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
        
        var newEventAdded = _mapper.Map<Event>(newEvent);
        eventForChange.Title = newEventAdded.Title ?? eventForChange.Title;
        eventForChange.Description = newEventAdded.Description ?? eventForChange.Description;

        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
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