using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class AuthenticationController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    
    private readonly SignInManager<User> _signInManager;

    public AuthenticationController(UserManager<User> userManager, SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserCreateDto userCreateDto)
    {
        var existingUser = await _userManager.FindByEmailAsync(userCreateDto.Email);

        if (existingUser is not null)
        {
            if (existingUser.IsExternalAccount)
            {
                return BadRequest($"This email is already in use via {existingUser.Provider}.");
            }

            return BadRequest("This email is already in use.");
        }
        
        // TODO Map UserCreateDto to User
        var user = new User();

        var result = await _userManager.CreateAsync(user, userCreateDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        
        return Ok("User registration successful.");
    }

    [HttpGet("external-login-callback")]
    public async Task<IActionResult> ExternalLoginCallback()
    {
        var info = await _signInManager.GetExternalLoginInfoAsync();

        if (info is null)
        {
            return BadRequest("Error loading external login info.");
        }
        
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        if (email is null)
        {
            return BadRequest("Google account has no email claim.");
        }

        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser is not null && !existingUser.IsExternalAccount)
        {
            return BadRequest("This email is already in use via normal registration.");
        }

        if (existingUser.Provider != info.LoginProvider)
        {
            return BadRequest($"This email is already in use via {existingUser.Provider}.");
        }
        
        // TODO Map UserCreateDto to User
        var user = existingUser ?? new User();

        if (existingUser is null)
        {
            _ = await _userManager.CreateAsync(user);
        }

        await _userManager.AddLoginAsync(user, info);
        await _signInManager.SignInAsync(user, isPersistent: false);

        return Ok($"{info.LoginProvider} login successful.");
    }
}