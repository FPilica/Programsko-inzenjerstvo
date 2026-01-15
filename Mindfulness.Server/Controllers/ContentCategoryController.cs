using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Dtos.ContentCategory;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

// [Authorize]
[ApiController]
[Route("api/[controller]")]
public class ContentCategoryController : ControllerBase
{
   private readonly MindfulnessDbContext _context;
   private readonly IMapper _mapper;

   public ContentCategoryController(MindfulnessDbContext context, IMapper mapper)
   {
      _context = context;
      _mapper = mapper;
   }

   [HttpGet]
   public async Task<ActionResult<List<ContentCategoryDetailsDto>>> GetContentCategories()
   {
      var contentCategories = await _context.ContentCategories.ToListAsync();
      
      return Ok(_mapper.Map<List<ContentCategoryDetailsDto>>(contentCategories));
   }
   
   [HttpGet("{categoryName}")]
   public async Task<ActionResult<ContentCategoryDetailsDto>> GetContentCategoryByName(string categoryName)
   {
      var contentCategory = await _context.ContentCategories.FirstOrDefaultAsync(cc => cc.Name == categoryName);

      if (contentCategory is null)
      {
         return NotFound();
      }
      
      return _mapper.Map<ContentCategoryDetailsDto>(contentCategory);
   }

   [HttpPost]
   public async Task<ActionResult<ContentCategoryDetailsDto>> CreateContentCategory([FromBody] ContentCategoryCreateDto dto)
   {
      if (await _context.ContentCategories.AnyAsync(cc => cc.Name == dto.Name))
      {
         return BadRequest("Content Category with the same name already exists");
      }

      var contentCategory = _mapper.Map<ContentCategory>(dto);
      contentCategory.Id = Guid.NewGuid();
      
      _context.ContentCategories.Add(contentCategory);
      await _context.SaveChangesAsync();
      
      return Ok(_mapper.Map<ContentCategoryDetailsDto>(contentCategory));
   }

   [HttpPut("{contentCategoryId:guid}")]
   public async Task<ActionResult<ContentCategoryDetailsDto>> UpdateContentCategory(Guid contentCategoryId, [FromBody] ContentCategoryUpdateDto dto)
   {
      var contentCategory = await _context.ContentCategories.FindAsync(contentCategoryId);

      if (contentCategory is null)
      {
         return NotFound();
      }
      
      if (await _context.ContentCategories.AnyAsync(cc => cc.Name == dto.Name))
      {
         return BadRequest("Content Category with the same name already exists");
      }

      contentCategory.Name = dto.Name;

      _context.ContentCategories.Update(contentCategory);
      await _context.SaveChangesAsync();
      
      return Ok(_mapper.Map<ContentCategoryDetailsDto>(contentCategory));
   }
}