using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class VChildPerformance
{
    public int UserId { get; set; }

    public string? ChildName { get; set; }

    public string? ParentName { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public int SessionId { get; set; }

    public DateTime SessionStartTime { get; set; }

    public DateTime? SessionEndTime { get; set; }

    public DateOnly SessionDate { get; set; }

    public double? WorkingScore { get; set; }

    public double? EpisodicScore { get; set; }

    public double? VisualScore { get; set; }

    public double? AuditoryScore { get; set; }

    public double? TotalScore { get; set; }

    public int? GamesPlayed { get; set; }

    public string? CategoriesCompleted { get; set; }

    public bool? IsActiveSession { get; set; }
}
