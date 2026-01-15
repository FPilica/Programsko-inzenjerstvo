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
        var newChallenge = mapper.Map<Challenge>(dto);
        newChallenge.Title = dto.Title;
        newChallenge.Id = Guid.NewGuid();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId is null)
        {
            return BadRequest("User not found");
        }

        var userGuid = Guid.Parse(userId);

        var temp = await context.Users.FindAsync(userGuid);

        if (temp is null)
        {
            return BadRequest("User not found");
        }
        
        newChallenge.Users.Add(temp);
        
        context.Challenges.Add(newChallenge);
        
        await context.SaveChangesAsync();
        
        return Ok(mapper.Map<ChallengeDetailsDto>(newChallenge));
    }

    [HttpPut("{Id:guid}")]
    public async Task<ActionResult<ChallengeDetailsDto>> UpdateChallenge(Guid Id, [FromBody] ChallengeUpdateDto dto)
    {
        
        var challenge = await context.Challenges.FindAsync(Id);

        if (challenge is null)
        {
            return NotFound();
        }
        
        challenge.Title = dto.Title ??  challenge.Title;
        challenge.Description = dto.Description ??   challenge.Description;
        challenge.Duration = dto.Duration;
        challenge.Difficulty = dto.Difficulty;
        
        context.Challenges.Update(challenge);
        await context.SaveChangesAsync();
        
        return Ok(mapper.Map<ChallengeDetailsDto>(challenge));
    }

    [HttpDelete("{Id:guid}")]
    public async Task<IActionResult> DeleteChallenge(Guid Id)
    {
        var challenge = await context.Challenges.FindAsync(Id);
        if (challenge is null)
        {
            return NotFound();
        }
        
        context.Challenges.Remove(challenge);
        await context.SaveChangesAsync();
        

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<List<ChallengeDetailsDto>>> GetChallenges()
    {
        var challenges = await context.Challenges.ToListAsync();
        
        return Ok(mapper.Map<List<ChallengeDetailsDto>>(challenges));
    }

    
    [HttpGet("forUser")]
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
            return NotFound("User not found");
        
        var usersChallenges = await context.Challenges.Where(c => c.Users.Any(u => u.Id == userGuid)).ToListAsync();
        
        return Ok(mapper.Map<List<ChallengeDetailsDto>>(usersChallenges));
    }
}