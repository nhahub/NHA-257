using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class TblClinicProfile
{
    public int ClinicId { get; set; }

    public int? UserId { get; set; }

    public string? ClinicName { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<TblChildProfile> TblChildProfiles { get; set; } = new List<TblChildProfile>();

    public virtual ICollection<TblDoctorProfile> TblDoctorProfiles { get; set; } = new List<TblDoctorProfile>();

    public virtual TblUser? User { get; set; }
}
