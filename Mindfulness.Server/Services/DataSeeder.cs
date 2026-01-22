using Microsoft.AspNetCore.Identity;
using Mindfulness.Server.Enums;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Services;

public class DataSeeder
{
    private readonly MindfulnessDbContext _dbContext;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly UserManager<User> _userManager;

    public DataSeeder(MindfulnessDbContext dbContext, RoleManager<IdentityRole<Guid>> roleManager, UserManager<User> userManager)
    {
        _dbContext = dbContext;
        _roleManager = roleManager;
        _userManager = userManager;
    }
    
    public async Task SeedDataAsync() {
        await _roleManager.CreateAsync(new IdentityRole<Guid>("User"));
        await _roleManager.CreateAsync(new IdentityRole<Guid>("Coach"));
        await _roleManager.CreateAsync(new IdentityRole<Guid>("Admin"));

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "John",
            LastName = "Doe",
            Gender = Gender.Undefined,
            DateOfBirth = DateTimeOffset.Now,
            CreatedAt = DateTimeOffset.Now,
            Email = "admin@admin.com",
            UserName = "admin@admin.com"
        };
        var result = await _userManager.CreateAsync(user, "admin1!A");
        
        var coach = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Default",
            LastName = "Coach",
            Gender = Gender.Undefined,
            DateOfBirth = DateTimeOffset.Now,
            CreatedAt = DateTimeOffset.Now,
            Email = "coach@coach.com",
            UserName = "coach@coach.com"
        };
        
        var resultCoach = await _userManager.CreateAsync(coach, "coach1!C");
        
        if (!result.Succeeded || !resultCoach.Succeeded)
        {
            throw new Exception("Error creating user");
        }
        
        var createdUser = await _userManager.FindByEmailAsync(user.Email);

        if (createdUser is null)
        {
            throw new InvalidOperationException("User not found");
        }
        
        await _userManager.AddToRoleAsync(createdUser, "Admin");
        
        await _userManager.AddToRoleAsync(coach, "Coach");
        
        _dbContext.ContentCategories.Add(new ContentCategory
        {
            Id = Guid.NewGuid(),
            Name = "meditacija",
        });
        _dbContext.ContentCategories.Add(new ContentCategory
        {
            Id = Guid.NewGuid(),
            Name = "disanje",
        });
        _dbContext.ContentCategories.Add(new ContentCategory
        {
            Id = Guid.NewGuid(),
            Name = "yoga"
        });
        _dbContext.ContentCategories.Add(new ContentCategory
        {
            Id = Guid.NewGuid(),
            Name = "mindfulness"
        });

        _dbContext.AudioLanguages.Add(new AudioLanguage
        {
            Id = Guid.NewGuid(),
            Name = "hr"
        });
        _dbContext.AudioLanguages.Add(new AudioLanguage
        {
            Id = Guid.NewGuid(),
            Name = "eng"
        });

        await _dbContext.SaveChangesAsync();
    }
}