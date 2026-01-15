using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Mindfulness.Server.Dtos.AudioLanguage;
using Mindfulness.Server.Dtos.Review;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

//[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AudioLanguageController(MindfulnessDbContext context, IMapper mapper) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<AudioLanguageDetailsDto>> CreateAudioLanguage([FromBody] AudioLanguageCreateDto dto)
    {
        
        var contentExists = await context.Contents.AnyAsync(x => x.Id == dto.Id);

        if (contentExists)
        {
            return BadRequest("Language already exists");
        }
        
        var newAudioLanguage = mapper.Map<AudioLanguage>(dto);
        newAudioLanguage.Name = dto.Name;
        newAudioLanguage.Id = Guid.NewGuid();
        
        context.AudioLanguages.Add(newAudioLanguage);
        
        await context.SaveChangesAsync();
        
        return Ok(mapper.Map<AudioLanguageDetailsDto>(newAudioLanguage));
    }

    [HttpPut("{Id:guid}")]
    public async Task<ActionResult<AudioLanguageDetailsDto>> UpdateAudioLanguage(Guid Id, [FromBody] AudioLanguageUpdateDto dto)
    {
        
        var audioLanguage = await context.AudioLanguages.FirstOrDefaultAsync(x => x.Id == Id);

        if (audioLanguage is null)
        {
            return NotFound();
        }
        else
        {
            var newNameExists = await context.AudioLanguages.AnyAsync(x => x.Name.Equals(dto.Name) && x.Id != audioLanguage.Id);

            if (newNameExists)
            {
                return BadRequest("Language already exists");
            }
            
            audioLanguage.Name = dto.Name;
            
        }
        
        await context.SaveChangesAsync();
        
        return Ok(mapper.Map<AudioLanguageDetailsDto>(audioLanguage));
    }

    [HttpDelete("{Id:guid}")]
    public async Task<IActionResult> DeleteAudioLanguage(Guid Id)
    {
        var audioLanguage = await context.AudioLanguages.FirstOrDefaultAsync(x => x.Id == Id);
        if (audioLanguage is null)
        {
            return NotFound();
        }
        
        context.AudioLanguages.Remove(audioLanguage);
        await context.SaveChangesAsync();
        

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<List<AudioLanguageDetailsDto>>> GetLanguages()
    {
        var languages = await context.AudioLanguages.ToListAsync();
        
        return Ok(mapper.Map<List<AudioLanguageDetailsDto>>(languages));
    }
}