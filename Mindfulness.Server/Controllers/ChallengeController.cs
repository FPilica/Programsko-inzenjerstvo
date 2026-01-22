using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.Challenge;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChallengeController(MindfulnessDbContext context, IMapper mapper) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ChallengeDetailsDto>> CreateChallenge([FromBody] ChallengeCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);
        
        var user = await context.Users.FindAsync(userGuid);

        if (user is null)
        {
            return BadRequest("User not found");
        }
        
        var newChallenge = mapper.Map<Challenge>(dto);
        newChallenge.Id = Guid.NewGuid();
        newChallenge.CreatedAt = DateTimeOffset.Now;
        newChallenge.UserId = userGuid;
        
        context.Challenges.Add(newChallenge);
        
        await context.SaveChangesAsync();
        
        return Ok(mapper.Map<ChallengeDetailsDto>(newChallenge));
    }

    [HttpPost("{id:guid}")]
    public async Task<IActionResult> EnrollChallenge(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);
        
        var user = await context.Users.FindAsync(userGuid);

        if (user is null)
        {
            return BadRequest("User not found");
        }
        
        var challenge = await context.Challenges.FindAsync(id);

        if (challenge is null)
        {
            return NotFound("Challenge not found");
        }

        challenge.Users.Add(user);
        
        context.Challenges.Update(challenge);
        await context.SaveChangesAsync();
        
        return Ok();
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ChallengeDetailsDto>> UpdateChallenge(Guid id, [FromBody] ChallengeUpdateDto dto)
    {
        var challenge = await context.Challenges.FindAsync(id);

        if (challenge is null)
        {
            return NotFound();
        }
        
        challenge.Title = dto.Title;
        challenge.Description = dto.Description;
        challenge.Duration = dto.Duration;
        challenge.Difficulty = dto.Difficulty;
        challenge.CreatedAt = DateTimeOffset.Now;
        
        context.Challenges.Update(challenge);
        await context.SaveChangesAsync();
        
        return Ok(mapper.Map<ChallengeDetailsDto>(challenge));
    }
    
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteChallenge(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        
        var challenge = await context.Challenges.FirstOrDefaultAsync(x => x.Id == id);

        if (challenge is null)
        {
            return NotFound();
        }

        if (challenge.UserId != Guid.Parse(userId) && !User.IsInRole("Admin"))
        {
            return Unauthorized();
        }
        
        context.Challenges.Remove(challenge);
        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<List<ChallengeDetailsDto>>> GetAllChallenges()
    {
        var challenges = await context.Challenges.ToListAsync();
        
        return Ok(mapper.Map<List<ChallengeDetailsDto>>(challenges));
    }

    
    [HttpGet("enrolled")]
    public async Task<ActionResult<ChallengeDetailsDto>> GetUserChallenges()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);

        var user = await context.Users.Include(u => u.Challenges).FirstOrDefaultAsync(u => u.Id == userGuid);

        if (user is null)
        {
            return NotFound("User not found");
        }
        
        return Ok(mapper.Map<List<ChallengeDetailsDto>>(user.Challenges));
    }
}