using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Models;
using System.Security.Claims;

namespace Mindfulness.Server.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly MindfulnessDbContext _context;
    private readonly IMapper _mapper;
    public UserProfileController(MindfulnessDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    [HttpPost("setprofile")]
    public async Task<IActionResult> UpdateUserProfile([FromBody] UserUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);

        if (user == null)
            return NotFound("User not found");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.DateOfBirth = dto.DateOfBirth;
        user.Gender = dto.Gender;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated" });
    }
    [HttpGet("getprofile")]
    public async Task<ActionResult<UserDetailsDto>> GetByUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userGuid);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<UserDetailsDto>(user));
    }
}
