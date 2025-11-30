using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class TblDoctorProfile
{
    public int DoctorId { get; set; }

    public int? UserId { get; set; }

    public int? ClinicId { get; set; }

    public string? FullName { get; set; }

    public string? Specialty { get; set; }

    public string? LicenseNumber { get; set; }

    public bool? IsDeleted { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public virtual TblClinicProfile? Clinic { get; set; }

    public virtual ICollection<TblChildProfile> TblChildProfiles { get; set; } = new List<TblChildProfile>();

    public virtual TblUser? User { get; set; }
}
