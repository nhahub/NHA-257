using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class LkpGame
{
    public int GameId { get; set; }

    public int? CategoryId { get; set; }

    public string? GameName { get; set; }

    public string? Description { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual LkpGameCategory? Category { get; set; }

    public virtual ICollection<TblGameSession> TblGameSessions { get; set; } = new List<TblGameSession>();
}
