using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class TblMemoryScoreSummary
{
    public int SummaryId { get; set; }

    public int? UserId { get; set; }

    public decimal? WorkingScore { get; set; }

    public decimal? EpisodicScore { get; set; }

    public decimal? AuditoryScore { get; set; }

    public decimal? VisualScore { get; set; }

    public decimal? TotalScore { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateOnly SessionDate { get; set; }

    public int? GamesPlayed { get; set; }

    public bool? IsActive { get; set; }

    public DateTime SessionStartTime { get; set; }

    public DateTime? SessionEndTime { get; set; }

    public string? CategoriesCompleted { get; set; }

    public virtual ICollection<TblGameSession> TblGameSessions { get; set; } = new List<TblGameSession>();

    public virtual TblUser? User { get; set; }
}
