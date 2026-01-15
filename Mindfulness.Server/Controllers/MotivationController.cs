using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.Motivation;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MotivationController : ControllerBase
{
    private readonly MindfulnessDbContext _context;
    private readonly IMapper _mapper;

    public MotivationController(MindfulnessDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<MotivationDetailsDto>> GetRandomMotivation()
    {
        var motivations = await _context.Motivations.ToListAsync();

        if (motivations.Count == 0)
        {
            return NoContent();
        }

        var rand = new Random();

        var randomMotivation = motivations[rand.Next(motivations.Count)];
        
        return Ok(_mapper.Map<MotivationDetailsDto>(randomMotivation));
    }

    [HttpPost]
    public async Task<ActionResult<MotivationDetailsDto>> CreateMotivation([FromBody] MotivationCreateDto dto)
    {
        var motivation = _mapper.Map<Motivation>(dto);
        motivation.Id = Guid.NewGuid();
        
        _context.Motivations.Add(motivation);
        await _context.SaveChangesAsync();
        
        return Ok(_mapper.Map<MotivationDetailsDto>(motivation));
    }

    [HttpPut("{motivationId:guid}")]
    public async Task<ActionResult<MotivationDetailsDto>> UpdateMotivation(Guid motivationId,
        [FromBody] MotivationUpdateDto dto)
    {
        var motivation = await _context.Motivations.FindAsync(motivationId);

        if (motivation is null)
        {
            return NotFound();
        }

        motivation.Message = dto.Message;

        _context.Motivations.Update(motivation);
        await _context.SaveChangesAsync();
        
        return Ok(_mapper.Map<MotivationDetailsDto>(motivation));
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteMotivation(Guid motivationId)
    {
        var motivation = await _context.Motivations.FindAsync(motivationId);

        if (motivation is null)
        {
            return NotFound();
        }

        _context.Motivations.Remove(motivation);
        await _context.SaveChangesAsync();
        
        return Ok();
    }
}