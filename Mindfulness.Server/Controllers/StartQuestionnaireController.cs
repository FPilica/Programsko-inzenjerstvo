using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.StartQuestionnaire;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class StartQuestionnaireController : ControllerBase
{
    private readonly MindfulnessDbContext _context;
    private readonly IMapper _mapper;
    
    public StartQuestionnaireController(MindfulnessDbContext context,IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateStartQuestionnaire([FromBody] StartQuestionnaireCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);

        if (await _context.StartQuestionnaires.AnyAsync(sq => sq.UserId == userGuid))
        {
            return BadRequest("User already completed Start Questionnaire");
        }
        
        var startQuestionnaire = _mapper.Map<StartQuestionnaire>(dto);
        startQuestionnaire.Id = Guid.NewGuid();
        startQuestionnaire.UserId = userGuid;
        
        _context.StartQuestionnaires.Add(startQuestionnaire);
        
        await _context.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpGet]
    public async Task<ActionResult<StartQuestionnaireDetailsDto>> GetByUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        
        var questionnaire = await _context.StartQuestionnaires
            .FirstOrDefaultAsync(sq => sq.UserId == userGuid);

        if (questionnaire is null)
        {
            return NotFound();
        }
        
        return Ok(_mapper.Map<StartQuestionnaireDetailsDto>(questionnaire));
    }
    
}