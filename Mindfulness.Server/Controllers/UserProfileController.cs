using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.User;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly MindfulnessDbContext _context;
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;

    public UserProfileController(MindfulnessDbContext context, IMapper mapper, UserManager<User> userManager)
    {
        _context = context;
        _mapper = mapper;
        _userManager = userManager;
    }
    
    [HttpPost("setprofile")]
    public async Task<ActionResult<UserDetailsDto>> UpdateUserProfile([FromBody] UserUpdateDto dto)
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
            return NotFound("User not found");
        }

        if (!string.IsNullOrWhiteSpace(dto.Role))
        {
            await _userManager.RemoveFromRolesAsync(user, await _userManager.GetRolesAsync(user));
            await _userManager.AddToRoleAsync(user, dto.Role);
        }

        user.FirstName = dto.FirstName ?? user.FirstName;
        user.LastName = dto.LastName ?? user.LastName;
        user.DateOfBirth = dto.DateOfBirth ?? user.DateOfBirth;
        user.Gender = dto.Gender ?? user.Gender;

        await _context.SaveChangesAsync();
        
        var userDetails = _mapper.Map<UserDetailsDto>(user);
        userDetails.Role = dto.Role ?? "";

        return Ok(userDetails);
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

        var user = await _context.Users.FindAsync(userGuid);

        if (user is null)
        {
            return NotFound("User not found");
        }
        
        var userDetails = _mapper.Map<UserDetailsDto>(user);
        userDetails.Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? "";

        return Ok(userDetails);
    }

    [HttpGet("getallusers")]
    public async Task<ActionResult<UserDetailsDto>> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        
        return Ok(_mapper.Map<List<UserDetailsDto>>(users));
    }
    
    [HttpGet("deleteprofile{id:guid}")]
    public async Task<ActionResult<UserDetailsDto>> DeleteUser(Guid id)
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
            return NotFound("User not found");
        }

        if (!User.IsInRole("Admin") || user.Id != id)
        {
            return Unauthorized();
        }
        
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
