using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Concord.Models;
using Concord.Hubs;

namespace Concord.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly DatabaseContext _context;

    private readonly IHubContext<ChatHub> _hub;

    // accept the hub here
    // a constructor with the hub and the database as a  parameter

    public MessagesController(DatabaseContext context, IHubContext<ChatHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
    {
        return await _context.Messages.ToListAsync();
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Message>> GetMessage(int id)
    {
        var Message = await _context.Messages.FindAsync(id);

        if (Message == null)
        {
            return NotFound();
        }

        return Message;
    }

    [HttpPost]
    public async Task<ActionResult<Message>> PostMessage(Message Message)
    {
        _context.Messages.Add(Message);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMessage), new { id = Message.Id }, Message);
    }

// // POST: api/Messages/5/Messages
//     [HttpPost("{MessageId}/Messages")]
//     public async Task<Message> PostMessageMessage(int MessageId, Message Message)
//     {
//         Message.MessageId = MessageId;
//         _context.Messages.Add(Message);
//         await _context.SaveChangesAsync();

//         // return CreatedAtAction("GetMessage", "Message", new { id = Message.Id }, Message);
//         // Broadcast this to all SignalR clients
//         // await _hub.Clients.All.SendAsync("ReceiveMessage", Message);
//         await _hub.Clients.Group(MessageId.ToString()).SendAsync("ReceiveMessage", Message);

//         return Message;
//     }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutMessage(int id, Message Message)
    {
        if (id != Message.Id)
        {
            return BadRequest();
        }

        _context.Entry(Message).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        await _hub.Clients.Group(Message.ChannelId.ToString()).SendAsync("MessageUpdated", Message);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var Message = await _context.Messages.FindAsync(id);
        if (Message == null)
        {
            return NotFound();
        }

        _context.Messages.Remove(Message);
        await _context.SaveChangesAsync();

        await _hub.Clients.Group(Message.ChannelId.ToString()).SendAsync("MessageDeleted", Message.Id);

        return NoContent();
    }
}