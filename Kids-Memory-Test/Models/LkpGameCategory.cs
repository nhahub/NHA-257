using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class LkpGameCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public virtual ICollection<LkpGame> LkpGames { get; set; } = new List<LkpGame>();
}
