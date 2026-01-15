using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.Review;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly MindfulnessDbContext _context;
    private readonly IMapper _mapper;
    
    public ReviewController(MindfulnessDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    [HttpPost]
    public async Task<ActionResult<ReviewDetailsDto>> CreateReview([FromBody] ReviewCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var userGuid = Guid.Parse(userId);
        
        var contentExists = await _context.Contents.AnyAsync(x => x.Id == dto.ContentId);

        if (!contentExists)
        {
            return BadRequest("Content not found");
        }
        
        var review = _mapper.Map<Review>(dto);
        review.Id = Guid.NewGuid();
        review.UserId = userGuid;
        review.CreatedAt = DateTimeOffset.Now;
        
        var addedReview = _context.Reviews.Add(review);
        
        await _context.SaveChangesAsync();
        
        return Ok(_mapper.Map<ReviewDetailsDto>(addedReview.Entity));
    }

    [HttpPut("{reviewId:guid}")]
    public async Task<ActionResult<ReviewDetailsDto>> UpdateReview(Guid reviewId, [FromBody] ReviewUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var review = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == reviewId);

        if (review is null)
        {
            return NotFound();
        }

        if (review.UserId != Guid.Parse(userId))
        {
            return Unauthorized();
        }
        
        review.Comment = dto.Comment;
        review.Rating = dto.Rating;
        review.CreatedAt = DateTimeOffset.Now;
        
        _context.Reviews.Update(review);
        await _context.SaveChangesAsync();
        
        return Ok(_mapper.Map<ReviewDetailsDto>(review));
    }

    [HttpDelete("{reviewId:guid}")]
    public async Task<IActionResult> DeleteReview(Guid reviewId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return BadRequest("User not found");
        }
        
        var review = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == reviewId);

        if (review is null)
        {
            return NotFound();
        }

        if (review.UserId != Guid.Parse(userId))
        {
            return Unauthorized();
        }
        
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("by-content-id/{contentId:guid}")]
    public async Task<ActionResult<List<ReviewDetailsDto>>> GetByContentId(Guid contentId)
    {
        var reviews = await _context.Reviews.Where(r => r.ContentId == contentId).ToListAsync();
        
        return Ok(_mapper.Map<List<ReviewDetailsDto>>(reviews));
    }
}