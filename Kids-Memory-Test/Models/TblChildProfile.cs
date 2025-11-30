using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class TblChildProfile
{
    public int ChildId { get; set; }

    public int? UserId { get; set; }

    public string? ParentName { get; set; }

    public string? ParentNumber { get; set; }

    public string? Address { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public int? DoctorId { get; set; }

    public int? ClinicId { get; set; }

    public bool? IsDeleted { get; set; }

    public string? ChildName { get; set; }

    public virtual TblClinicProfile? Clinic { get; set; }

    public virtual TblDoctorProfile? Doctor { get; set; }

    public virtual TblUser? User { get; set; }
}
