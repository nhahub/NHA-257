using System;
using System.Collections.Generic;

namespace Kids_Memory_Test.Models;

public partial class LkpUserType
{
    public int UserTypeId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<TblUser> TblUsers { get; set; } = new List<TblUser>();
}
