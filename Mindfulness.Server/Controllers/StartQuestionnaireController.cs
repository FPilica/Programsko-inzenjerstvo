using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.StartQuestionnaire;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

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
    public async Task<ActionResult<StartQuestionnaireDetailsDto>> CreateStartQuestionnaire([FromBody] StartQuestionnaireCreateDto dto)
    {
        var startQuestionnaire = _mapper.Map<StartQuestionnaire>(dto);
        startQuestionnaire.Id = Guid.NewGuid();
        
        _context.StartQuestionnaires.Add(startQuestionnaire);
        await _context.SaveChangesAsync();

        var newSq = await _context.StartQuestionnaires.FirstOrDefaultAsync(sq => sq.Id == startQuestionnaire.Id);

        if (newSq is null)
        {
            return Problem(statusCode: StatusCodes.Status500InternalServerError);
        }
        
        var details = _mapper.Map<StartQuestionnaireDetailsDto>(newSq);
        return Ok(details);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StartQuestionnaireDetailsDto>> GetByUserId([FromRoute] Guid userId)
    {
        var questionnaire = await _context.StartQuestionnaires.FirstOrDefaultAsync(sq => sq.UserId == userId);

        if (questionnaire is null)
        {
            return NotFound();
        }
        
        return Ok(_mapper.Map<StartQuestionnaireDetailsDto>(questionnaire));
    }
    
}