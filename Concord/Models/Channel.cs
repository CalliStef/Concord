namespace Concord.Models;

public class Channel
{
    public Channel(int id, string name, DateTime created){
        Id = id;
        Name = name;
        Created = created;
        Messages = new List<Message>();
    }
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime Created { get; set; }
    public List<Message> Messages { get; set; }
    public int Totalusers { get; set; }
    public ICollection<User> Users { get; set; } = new List<User>();
}
