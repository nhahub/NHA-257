using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class TblUser
{
    public int UserId { get; set; }

    public int? UserTypeId { get; set; }

    public string Email { get; set; } = null!;

    public string UserPassword { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    public virtual TblChildProfile? TblChildProfile { get; set; }

    public virtual TblClinicProfile? TblClinicProfile { get; set; }

    public virtual TblDoctorProfile? TblDoctorProfile { get; set; }

    public virtual ICollection<TblGameSession> TblGameSessions { get; set; } = new List<TblGameSession>();

    public virtual TblMemoryScoreSummary? TblMemoryScoreSummary { get; set; }

    public virtual LkpUserType? UserType { get; set; }
}
