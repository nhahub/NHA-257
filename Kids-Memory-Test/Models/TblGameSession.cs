using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class TblGameSession
{
    public int SessionId { get; set; }

    public int? UserId { get; set; }

    public int? GameId { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? Score { get; set; }

    public int? Trials { get; set; }

    public int? Misses { get; set; }

    public DateOnly? SessionDate { get; set; }

    public decimal? Weight { get; set; }

    public int? SummarySessionId { get; set; }

    public virtual LkpGame? Game { get; set; }

    public virtual TblMemoryScoreSummary? SummarySession { get; set; }

    public virtual TblUser? User { get; set; }
}
