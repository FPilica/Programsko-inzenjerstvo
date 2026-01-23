using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.DailyCheckIn;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Models;
using System.Security.Claims;

namespace Mindfulness.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DailyTasksController : ControllerBase
{
    private readonly MindfulnessDbContext _context;
    private readonly IMapper _mapper;

    public DailyTasksController(MindfulnessDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateCheckin([FromBody] DailyCheckInCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);
        
        var user = await _context.Users.FindAsync(userGuid);
        
        if (user is null)
        {
            return BadRequest("User does not exist");
        }
        
        var dailyCheckin = _mapper.Map<DailyCheckIn>(dto);
        dailyCheckin.Id = Guid.NewGuid();
        dailyCheckin.UserId = userGuid;

        _context.DailyCheckIns.Add(dailyCheckin);

        var first = DateTimeOffset.UtcNow;
        var second = user.LastFocus.ToUniversalTime();
        var difference = (int)Math.Abs((first - second).TotalDays);

        switch (difference)
        {
            case 0:
                user.Streak = user.Streak;
                break;
            case 1:
                user.Streak += 1;
                break;
            default:
                user.Streak = 1;
                break;
        }
        
        user.LastCheckin = DateTimeOffset.Now;
        user.LastFocus = DateTimeOffset.Now;
        
        _context.Users.Update(user);
        
        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<DailyCheckInDetailsDto>(dailyCheckin));
    }

    [HttpGet]
    public async Task<ActionResult<List<DailyCheckInDetailsDto>>> GetDailyCheckIns()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);
        
        var user = await _context.Users.FindAsync(userGuid);
        
        if (user is null)
        {
            return BadRequest("User does not exist");
        }
        
        var dailyCheckIns = _context.DailyCheckIns.Where(x => x.UserId == user.Id).ToList();
        
        return Ok(_mapper.Map<List<DailyCheckInDetailsDto>>(dailyCheckIns));
    }
    
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DailyCheckInDetailsDto>> GetCheckinById(Guid id)
    {
        var checkIn = await _context.DailyCheckIns.FindAsync(id);

        if (checkIn is null)
        {
            return NotFound("Not found checkin with this id");
        }

        return Ok(_mapper.Map<DailyCheckInDetailsDto>(checkIn));
    }
}

