using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Enums;
using Mindfulness.Server.Models;

namespace Mindfulness.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    
    private readonly IMapper _mapper;
    
    private readonly SignInManager<User> _signInManager;
    
    private readonly UserManager<User> _userManager;

    public AuthController(IConfiguration configuration, IMapper mapper, SignInManager<User> signInManager, UserManager<User> userManager)
    {
        _configuration = configuration;
        _mapper = mapper;
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
    {
        var existingUser = await _userManager.FindByEmailAsync(userRegisterDto.Email);

        if (existingUser is not null)
        {
            if (existingUser.IsExternalAccount)
            {
                return BadRequest($"This email is already in use via {existingUser.Provider}.");
            }

            return BadRequest("This email is already in use.");
        }
        
        var user = _mapper.Map<User>(userRegisterDto);
        user.Id = Guid.NewGuid();
        user.UserName = user.Email;
        user.IsExternalAccount = false;

        var result = await _userManager.CreateAsync(user, userRegisterDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        
        return Ok("User registration successful.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        var user = await _userManager.FindByEmailAsync(userLoginDto.Email);

        if (user is null)
        {
            return Unauthorized("Invalid email.");
        }
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, userLoginDto.Password, false);
        
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid password.");
        }

        var token = GenerateJwtToken(user);
        
        return Ok(new { token });
    }

    [HttpGet("external-login")]
    public IActionResult ExternalLogin([FromQuery] string provider, [FromQuery] string returnUrl)
    {
        var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Auth", new { returnUrl });
        
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        
        return Challenge(properties, provider);
    }

    [HttpGet("external-login-callback")]
    public async Task<IActionResult> ExternalLoginCallback(string? returnUrl = null, string? remoteError = null)
    {
        if (remoteError is not null)
        {
            return BadRequest($"Error from external provider: {remoteError}");
        }
        
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
        if (existingUser is not null)
        {
            var loginExists = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (loginExists is null)
            {
                _ = await _userManager.AddLoginAsync(existingUser, info);
            }

            var jwtToken = GenerateJwtToken(existingUser);
            
            return Ok(new { jwtToken });
        }
        
        var user = existingUser ?? new User
        {
            FirstName = info.Principal.FindFirstValue(ClaimTypes.Name) ?? "John",
            LastName = info.Principal.FindFirstValue(ClaimTypes.Surname) ?? "Doe",
            Email = info.Principal.FindFirstValue(ClaimTypes.Email),
            UserName = info.Principal.FindFirstValue(ClaimTypes.Email),
            DateOfBirth = DateTimeOffset.Parse(info.Principal.FindFirstValue(ClaimTypes.DateOfBirth)
                                               ?? DateTimeOffset.MinValue.ToString()),
            Gender = Enum.Parse<Gender>(info.Principal.FindFirstValue(ClaimTypes.Gender) ?? "Undefined", true),
            IsExternalAccount = true,
            Provider = info.LoginProvider,
            ProviderKey = info.ProviderKey
        };
        
        var result = await _userManager.CreateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        _ = await _userManager.AddLoginAsync(user, info);

        var token = GenerateJwtToken(user);
 
        return Redirect($"{returnUrl}?token={token}" ?? $"https://localhost:60665/content?token={token}");
    }

    private string GenerateJwtToken(User user)
    {
        var jwtConfiguration = _configuration.GetSection("Jwt");
        
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtConfiguration["Key"] ?? throw new ArgumentException("Jwt:Key")));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim(JwtRegisteredClaimNames.Name, user.UserName ?? ""),
            new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName ?? ""),
            new Claim(JwtRegisteredClaimNames.Gender, user.Gender.ToString() ?? ""),
            new Claim(JwtRegisteredClaimNames.Birthdate, user.DateOfBirth.ToString("yyyy-MM-dd") ?? ""),
        };

        var token = new JwtSecurityToken(jwtConfiguration["Issuer"], jwtConfiguration["Audience"], claims,
            expires: DateTime.UtcNow.AddDays(7), signingCredentials: credentials);
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}