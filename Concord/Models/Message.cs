namespace Concord.Models;

public class Message
{
    public Message(int id, string text, DateTime created)
    {
        Id = id;
        Text = text;
        Created = created;
    }

    public int Id { get; set; }
    public string Text { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public DateTime Created { get; set; }
    public int ChannelId { get; set; }
    public Channel? Channel { get; set; }
}
