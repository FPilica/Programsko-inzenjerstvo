using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Mindfulness.Server.Controllers;
using Mindfulness.Server.Dtos.User;
using Mindfulness.Server.Models;
using Moq;

namespace Mindfulness.Tests;

[TestFixture]
public class Tests
{
    private Mock<IConfiguration> _configurationMock;
    private Mock<IMapper> _mapperMock;
    private Mock<SignInManager<User>> _signInManagerMock;
    private Mock<UserManager<User>> _userManagerMock;
    private AuthController _controller;
    
    [SetUp]
    public void SetUp()
    {
        _configurationMock = new Mock<IConfiguration>();
        _mapperMock = new Mock<IMapper>();
        
        var userStoreMock = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            userStoreMock.Object, null, null, null, null, null, null, null, null);

        var contextAccessorMock = new Mock<IHttpContextAccessor>();
        var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<User>>();
        
        _signInManagerMock = new Mock<SignInManager<User>>(
            _userManagerMock.Object,
            contextAccessorMock.Object,
            claimsFactoryMock.Object,
            null, null, null, null);

        SetupJwtConfiguration();

        _controller = new AuthController(
            _configurationMock.Object,
            _mapperMock.Object,
            _signInManagerMock.Object,
            _userManagerMock.Object);
    }
    
    #region Register Tests
    [Test]
    public async Task Register_WithNewUser_ReturnsOk()
    {
        var registerDto = new UserRegisterDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe"
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(registerDto.Email))
            .ReturnsAsync((User)null);
        
        _mapperMock.Setup(x => x.Map<User>(registerDto)).Returns(user);
        
        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), registerDto.Password))
            .ReturnsAsync(IdentityResult.Success);
        
        _userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);
        
        var result = await _controller.Register(registerDto);
        
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
        var okResult = result as OkObjectResult;
        Assert.That(okResult.Value, Is.EqualTo("User registration successful."));
    }

    [Test]
    public async Task Register_WithExistingEmail_ReturnsBadRequest()
    {
        var registerDto = new UserRegisterDto
        {
            Email = "existing@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe"
        };

        var existingUser = new User { FirstName = "John", LastName = "Doe", Email = registerDto.Email };

        _userManagerMock.Setup(x => x.FindByEmailAsync(registerDto.Email))
            .ReturnsAsync(existingUser);
        
        var result = await _controller.Register(registerDto);
        
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        var badRequestResult = result as BadRequestObjectResult;
        Assert.That(badRequestResult.Value, Is.EqualTo("This email is already in use."));
    }

    [Test]
    public async Task Register_WhenUserCreationFails_ReturnsBadRequest()
    {
        var registerDto = new UserRegisterDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe"
        };

        var user = new User
        {
            FirstName = "John",
            LastName = "Doe",
            Email = registerDto.Email
        };
        var errors = new[] { new IdentityError { Description = "Password too weak" } };

        _userManagerMock.Setup(x => x.FindByEmailAsync(registerDto.Email))
            .ReturnsAsync((User)null);
        
        _mapperMock.Setup(x => x.Map<User>(registerDto)).Returns(user);
        
        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), registerDto.Password))
            .ReturnsAsync(IdentityResult.Failed(errors));
        
        var result = await _controller.Register(registerDto);
        
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
    }

    [Test]
    public async Task Register_WhenAddToRoleFails_ReturnsBadRequest()
    {
        var registerDto = new UserRegisterDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe"
        };

        var user = new User
        {
            FirstName = "John",
            LastName = "Doe"
        };
        var errors = new[] { new IdentityError { Description = "Role assignment failed" } };

        _userManagerMock.Setup(x => x.FindByEmailAsync(registerDto.Email))
            .ReturnsAsync((User)null);
        
        _mapperMock.Setup(x => x.Map<User>(registerDto)).Returns(user);
        
        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), registerDto.Password))
            .ReturnsAsync(IdentityResult.Success);
        
        _userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Failed(errors));
        
        var result = await _controller.Register(registerDto);
        
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
    }

    #endregion
    
    #region Login Tests

    [Test]
    public async Task Login_WithValidCredentials_ReturnsOkWithToken()
    {
        var loginDto = new UserLoginDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "John",
            LastName = "Doe",
            Email = loginDto.Email,
            UserName = loginDto.Email
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
            .ReturnsAsync(user);
        
        _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, loginDto.Password, false))
            .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);
        
        var result = await _controller.Login(loginDto);
        
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
        var okResult = result as OkObjectResult;
        Assert.That(okResult.Value, Is.Not.Null);
        
        var tokenProperty = okResult.Value.GetType().GetProperty("token");
        Assert.That(tokenProperty, Is.Not.Null);
        var token = tokenProperty.GetValue(okResult.Value) as string;
        Assert.That(token, Is.Not.Null.And.Not.Empty);
    }

    [Test]
    public async Task Login_WithInvalidEmail_ReturnsUnauthorized()
    {
        var loginDto = new UserLoginDto
        {
            Email = "nonexistent@example.com",
            Password = "Password123!"
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
            .ReturnsAsync((User)null);

        var result = await _controller.Login(loginDto);

        Assert.That(result, Is.InstanceOf<UnauthorizedObjectResult>());
        var unauthorizedResult = result as UnauthorizedObjectResult;
        Assert.That(unauthorizedResult.Value, Is.EqualTo("Invalid email."));
    }

    [Test]
    public async Task Login_WithInvalidPassword_ReturnsUnauthorized()
    {
        var loginDto = new UserLoginDto
        {
            Email = "test@example.com",
            Password = "WrongPassword!"
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "John",
            LastName = "Doe",
            Email = loginDto.Email
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
            .ReturnsAsync(user);
        
        _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, loginDto.Password, false))
            .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

        var result = await _controller.Login(loginDto);

        Assert.That(result, Is.InstanceOf<UnauthorizedObjectResult>());
        var unauthorizedResult = result as UnauthorizedObjectResult;
        Assert.That(unauthorizedResult.Value, Is.EqualTo("Invalid password."));
    }

    #endregion

    #region ExternalLoginCallback Tests

    [Test]
    public async Task ExternalLoginCallback_WithRemoteError_ReturnsBadRequest()
    {
        var remoteError = "Access denied";
        
        var result = await _controller.ExternalLoginCallback(null, remoteError);
        
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        var badRequestResult = result as BadRequestObjectResult;
        Assert.That(badRequestResult.Value, Does.Contain(remoteError));
    }

    [Test]
    public async Task ExternalLoginCallback_WithNoExternalLoginInfo_ReturnsBadRequest()
    {
        _signInManagerMock.Setup(x => x.GetExternalLoginInfoAsync())
            .ReturnsAsync((ExternalLoginInfo)null);
        
        var result = await _controller.ExternalLoginCallback();
        
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        var badRequestResult = result as BadRequestObjectResult;
        Assert.That(badRequestResult.Value, Is.EqualTo("Error loading external login info."));
    }

    [Test]
    public async Task ExternalLoginCallback_WithNoEmailClaim_ReturnsBadRequest()
    {
        var claims = new List<Claim>();
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        
        var loginInfo = new ExternalLoginInfo(principal, "Google", "12345", "Google");
        
        _signInManagerMock.Setup(x => x.GetExternalLoginInfoAsync())
            .ReturnsAsync(loginInfo);
        
        var result = await _controller.ExternalLoginCallback();
        
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        var badRequestResult = result as BadRequestObjectResult;
        Assert.That(badRequestResult.Value, Is.EqualTo("Google account has no email claim."));
    }

    [Test]
    public async Task ExternalLoginCallback_WithExistingUser_ReturnsRedirectWithToken()
    {
        var email = "test@example.com";
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email)
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        
        var loginInfo = new ExternalLoginInfo(principal, "Google", "12345", "Google");
        
        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "John",
            LastName = "Doe",
            Email = email,
            UserName = email
        };

        _signInManagerMock.Setup(x => x.GetExternalLoginInfoAsync())
            .ReturnsAsync(loginInfo);
        
        _userManagerMock.Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync(existingUser);
        
        _userManagerMock.Setup(x => x.FindByLoginAsync(loginInfo.LoginProvider, loginInfo.ProviderKey))
            .ReturnsAsync((User)null);
        
        _userManagerMock.Setup(x => x.AddLoginAsync(existingUser, loginInfo))
            .ReturnsAsync(IdentityResult.Success);
        
        var result = await _controller.ExternalLoginCallback();
        
        Assert.That(result, Is.InstanceOf<RedirectResult>());
        var redirectResult = result as RedirectResult;
        Assert.That(redirectResult.Url, Does.Contain("token="));
    }

    [Test]
    public async Task ExternalLoginCallback_WithNewUser_CreatesUserAndReturnsRedirect()
    {
        var email = "newuser@example.com";
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, email),
            new(ClaimTypes.Name, "John Doe"),
            new(ClaimTypes.Surname, "Doe")
        };
        var identity = new ClaimsIdentity(claims);
        var principal = new ClaimsPrincipal(identity);
        
        var loginInfo = new ExternalLoginInfo(principal, "Google", "12345", "Google");

        _signInManagerMock.Setup(x => x.GetExternalLoginInfoAsync())
            .ReturnsAsync(loginInfo);
        
        _userManagerMock.Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync((User)null);
        
        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);
        
        _userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);
        
        _userManagerMock.Setup(x => x.AddLoginAsync(It.IsAny<User>(), loginInfo))
            .ReturnsAsync(IdentityResult.Success);
        
        var result = await _controller.ExternalLoginCallback();
        
        Assert.That(result, Is.InstanceOf<RedirectResult>());
        var redirectResult = result as RedirectResult;
        Assert.That(redirectResult.Url, Does.Contain("token="));
        
        _userManagerMock.Verify(x => x.CreateAsync(It.IsAny<User>()), Times.Once);
        _userManagerMock.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), "User"), Times.Once);
    }

    #endregion
    
    [TearDown]
    public void TearDown()
    {
        Environment.SetEnvironmentVariable("JWT_KEY", null);
    }
    
    private void SetupJwtConfiguration()
    {
        var jwtSectionMock = new Mock<IConfigurationSection>();
        jwtSectionMock.Setup(x => x["Issuer"]).Returns("TestIssuer");
        jwtSectionMock.Setup(x => x["Audience"]).Returns("TestAudience");
        
        _configurationMock.Setup(x => x.GetSection("Jwt")).Returns(jwtSectionMock.Object);
        
        Environment.SetEnvironmentVariable("JWT_KEY", "ThisIsATestSecretKeyForJwtTokenGeneration12345");
    }
}