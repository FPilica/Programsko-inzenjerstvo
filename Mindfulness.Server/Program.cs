using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server;
using Mindfulness.Server.Mapping;

const string corsPolicyName = "FrontendCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program));

var config = new MapperConfiguration(cfg =>
{
    cfg.AddProfile<AudioLanguageMapper>();
    cfg.AddProfile<ChallengeMapper>();
    cfg.AddProfile<ContentMapper>();
    cfg.AddProfile<ContentCategoryMapper>();
    cfg.AddProfile<DailyCheckInMapper>();
    cfg.AddProfile<EventMapper>();
    cfg.AddProfile<MotivationMapper>();
    cfg.AddProfile<ReviewMapper>();
    cfg.AddProfile<SettingMapper>();
    cfg.AddProfile<StartQuestionnaireMapper>();
    cfg.AddProfile<UserMapper>();
    cfg.AddProfile<UserSettingMapper>();
});

var mapper = config.CreateMapper();


builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.WithOrigins("http://localhost:5173");
    });
});

builder.Services.AddDbContext<MindfulnessDbContext>(options =>
{
    options.UseInMemoryDatabase("MindfulnessDb");
});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(corsPolicyName);

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
