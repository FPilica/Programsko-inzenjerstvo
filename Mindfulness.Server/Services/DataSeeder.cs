using Microsoft.AspNetCore.Identity;
using Mindfulness.Server.Enums;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Services;

public class DataSeeder
{
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly UserManager<User> _userManager;

    public DataSeeder(RoleManager<IdentityRole<Guid>> roleManager, UserManager<User> userManager)
    {
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

        if (!result.Succeeded)
        {
            throw new Exception("Error creating user");
        }
        
        var createdUser = await _userManager.FindByEmailAsync(user.Email);

        if (createdUser is null)
        {
            throw new InvalidOperationException("User not found");
        }
        
        await _userManager.AddToRoleAsync(createdUser, "Admin");
    }
}