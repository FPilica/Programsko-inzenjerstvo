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
    public async Task<IActionResult> CreateCheckin([FromBody] DailyCheckInCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);
        if (user is null)
        {
            return NotFound("User does not exist");
        }
        var dailyCheckin = _mapper.Map<DailyCheckIn>(dto);
        dailyCheckin.UserId = userGuid;

        _context.DailyCheckIns.Add(dailyCheckin);
        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<DailyCheckInCreateDto>(dailyCheckin);
    }

    [HttpPost("endFocus")]
    public async Task<IActionResult> FinishFocus(UserUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);
        if (user is null)     
        {
            return NotFound("User does not exist");
        }

        user = _mapper.Map<User>(dto);

        DateTimeOffset first = DateTimeOffset.Now;
        DateTimeOffset second = user.LastFocus;
        TimeSpan difference = first - second;
        if (difference.TotalDays < 1){ // 
            user.Streak += 1;
            user.LastFocus = DateTimeOffset.Now;
            return Ok("User's streak is continued");
        }
        else
        {
            user.Streak = 1;
            user.LastFocus = DateTimeOffset.Now;
            return Ok("User's streak is reset to 1");
        }
    }
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DailyCheckInDetailsDto>> GetCheckinById(Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("No checkin with this id.");
        }


        var checkIn = await _context.DailyCheckIns.FirstOrDefaultAsync(p => p.Id == id);

        if (checkIn == null)
        {
            return NotFound("Not found checkin with this id");
        }

        return Ok(_mapper.Map<DailyCheckInDetailsDto>(checkIn));
    }
}

