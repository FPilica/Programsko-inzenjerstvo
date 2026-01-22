using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.Content;

namespace Mindfulness.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ContentController : ControllerBase
{
    private readonly MindfulnessDbContext _context;
    private readonly IMapper _mapper;

    public ContentController(MindfulnessDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<ContentDetailsDto>>> GetAllContent()
    {
        var contents = await _context.Contents.ToListAsync();
        
        return Ok(_mapper.Map<List<ContentDetailsDto>>(contents));
    }
    
    [HttpGet("{contentCategoryId:guid}")]
    public async Task<ActionResult<List<ContentDetailsDto>>> GetAllContentByCategory(Guid contentCategoryId)
    {
        var contents = await _context.Contents.Where(c => c.CategoryId == contentCategoryId).ToListAsync();
        
        return Ok(_mapper.Map<List<ContentDetailsDto>>(contents));
    }

    [HttpPost]
    public async Task<ActionResult<ContentDetailsDto>> CreateContent(ContentCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);

        if (!await _context.ContentCategories.AnyAsync(cc => cc.Id == dto.CategoryId))
        {
            return BadRequest("Invalid category id");
        }
        
        if (dto.AudioLanguageId is not null && !await _context.AudioLanguages.AnyAsync(al => al.Id == dto.AudioLanguageId))
        {
            return BadRequest("Invalid audio language id");
        }

        var content = _mapper.Map<Models.Content>(dto);
        content.Id = Guid.NewGuid();
        content.UploadedAt = DateTimeOffset.Now;
        content.UserId = userGuid;
        
        _context.Contents.Add(content);
        await _context.SaveChangesAsync();
        
        return Ok(_mapper.Map<ContentDetailsDto>(content));
    }

    [HttpPut("{contentId:guid}")]
    public async Task<ActionResult<ContentDetailsDto>> UpdateContent(Guid contentId, ContentUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        
        var content = await _context.Contents.FindAsync(contentId);

        if (content is null)
        {
            return NotFound();
        }

        if (content.UserId != userGuid && !User.IsInRole("Admin"))
        {
            return Unauthorized();
        }
        
        if (dto.CategoryId is not null && !await _context.ContentCategories.AnyAsync(cc => cc.Id == dto.CategoryId))
        {
            return BadRequest("Invalid category id");
        }
        
        if (dto.AudioLanguageId is not null && !await _context.AudioLanguages.AnyAsync(al => al.Id == dto.AudioLanguageId))
        {
            return BadRequest("Invalid audio language id");
        }
        
        content.Title = dto.Title ?? content.Title;
        content.Description = dto.Description ?? content.Description;
        content.Difficulty = dto.Difficulty ?? content.Difficulty;
        content.Duration = dto.Duration ?? content.Duration;
        content.ContentType = dto.ContentType ?? content.ContentType;
        content.ContentLink = dto.ContentLink ?? content.ContentLink;
        content.ThumbnailLink = dto.ThumbnailLink ?? content.ThumbnailLink;
        content.CategoryId = dto.CategoryId ?? content.CategoryId;
        content.AudioLanguageId = dto.AudioLanguageId ?? content.AudioLanguageId;
        
        _context.Contents.Update(content);
        await _context.SaveChangesAsync();
        
        return Ok(_mapper.Map<ContentDetailsDto>(content));
    }

    [HttpDelete("{contentId:guid}")]
    public async Task<IActionResult> DeleteContent(Guid contentId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        
        var content = await _context.Contents.FindAsync(contentId);

        if (content is null)
        {
            return NotFound();
        }

        if (content.UserId != userGuid && !User.IsInRole("Admin"))
        {
            return Unauthorized();
        }

        _context.Contents.Remove(content);
        await _context.SaveChangesAsync();
        
        return Ok();
    }
}