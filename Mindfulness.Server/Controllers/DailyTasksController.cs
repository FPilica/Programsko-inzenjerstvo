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
    [HttpPost("inputDailyData")]
    public async Task<IActionResult> createCheckin([FromBody] DailyCheckInCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);

        if (await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid) is null)
        {
            return NotFound("User does not exist");
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);
        var dailyCheckin = _mapper.Map<DailyCheckIn>(dto);
        dailyCheckin.UserId = userGuid;
        dailyCheckin.Mood = dto.Mood;
        dailyCheckin.Alcohol = dto.Alcohol;
        dailyCheckin.Caffeine = dto.Caffeine;
        dailyCheckin.SleepScore = dto.SleepScore;
        dailyCheckin.PhysicalActivity = dto.PhysicalActivity;
        return Ok();
    }

    [HttpPost("endFocus")]
    public async Task<IActionResult> finishFocus(UserUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);

        if (await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid) is null)
        {
            return NotFound("User does not exist");
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);

        user = _mapper.Map<User>(dto);

        DateTimeOffset first = DateTime.Now.ToUniversalTime();
        DateTimeOffset second = user.LastFocus.ToUniversalTime();
        TimeSpan difference = first - second;
        if (difference.TotalDays < 1){ // 
            user.Streak += 1;
            user.LastFocus = DateTime.Now;
            return Ok("User's streak is continued");
        }
        else
        {
            user.Streak = 1;
            user.LastFocus = DateTime.Now;
            return Ok("User's streak is reset to 1");
        }
    }
}
