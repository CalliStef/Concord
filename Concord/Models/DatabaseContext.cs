using Microsoft.EntityFrameworkCore;

namespace Concord.Models;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Channel>().Property(e => e.Created).HasDefaultValueSql("now()");

        modelBuilder.Entity<Message>().Property(e => e.Created).HasDefaultValueSql("now()");

        modelBuilder.Entity<User>().Property(e => e.Created).HasDefaultValueSql("now()");
        modelBuilder.Entity<User>().Property(e => e.Updated).HasDefaultValueSql("now()");
        modelBuilder.Entity<User>().Property(e => e.Photo).IsRequired().HasDefaultValue("https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg");
      
        // Seed the user
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            Username = "Alice",
            Photo = "https://www.humanesociety.org/sites/default/files/2022-07/kitten-playing-575035.jpg",
      
        },
        new User
        {
            Id = 2,
            Username = "Bob",
            Photo = "https://kb.rspca.org.au/wp-content/uploads/2021/07/collie-beach-bokeh.jpg",
        });

        
    }

    public DbSet<Channel> Channels => Set<Channel>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<User> Users => Set<User>();

}
