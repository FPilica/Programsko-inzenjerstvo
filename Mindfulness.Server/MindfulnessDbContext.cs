using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Mindfulness.Server.Models;

namespace Mindfulness.Server;

public class MindfulnessDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public MindfulnessDbContext(DbContextOptions<MindfulnessDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserSetting>()
            .HasKey(us => new { us.UserId, us.SettingId });
        
        modelBuilder.Entity<UserSetting>()
            .HasOne(us => us.User)
            .WithMany(u => u.UserSettings)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<UserSetting>()
            .HasOne(us => us.Setting)
            .WithMany(s => s.UserSettings)
            .HasForeignKey(us => us.SettingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Challenge>()
            .HasMany(c => c.Users)
            .WithMany(u => u.Challenges);
        
        modelBuilder.Entity<Content>()
            .HasOne(c => c.AudioLanguage)
            .WithMany(a => a.Contents)
            .HasForeignKey(c => c.AudioLanguageId)
            .OnDelete(DeleteBehavior.SetNull);
        
        modelBuilder.Entity<Content>()
            .HasOne(c => c.Category)
            .WithMany(a => a.Contents)
            .HasForeignKey(c => c.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Content>()
            .HasOne(c => c.User)
            .WithMany(u => u.Contents)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Content)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.ContentId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<DailyCheckIn>()
            .HasOne(dc => dc.User)
            .WithMany(u => u.DailyCheckIns)
            .HasForeignKey(dc => dc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Event>()
            .HasOne(e => e.User)
            .WithMany(u => u.Events)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<User>()
            .HasOne(u => u.StartQuestionnaire)
            .WithOne(s => s.User)
            .HasForeignKey<StartQuestionnaire>(sq => sq.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
    
    public DbSet<AudioLanguage> AudioLanguages { get; set; }
    
    public DbSet<Challenge> Challenges { get; set; }
    
    public DbSet<Content> Contents { get; set; }
    
    public DbSet<ContentCategory> ContentCategories { get; set; }
    
    public DbSet<DailyCheckIn> DailyCheckIns { get; set; }
    
    public DbSet<Event> Events { get; set; }
    
    public DbSet<Motivation> Motivations { get; set; }
    
    public DbSet<Review> Reviews { get; set; }
    
    public DbSet<Setting> Settings { get; set; }
    
    public DbSet<StartQuestionnaire> StartQuestionnaires { get; set; }
    
    public DbSet<UserSetting> UserSettings { get; set; }
}