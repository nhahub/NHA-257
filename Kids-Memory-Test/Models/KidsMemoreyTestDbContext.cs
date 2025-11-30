using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Kids_Memory_Test.Models;

public partial class KidsMemoreyTestDbContext : DbContext
{
    public KidsMemoreyTestDbContext()
    {
    }

    public KidsMemoreyTestDbContext(DbContextOptions<KidsMemoreyTestDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<LkpGame> LkpGames { get; set; }

    public virtual DbSet<LkpGameCategory> LkpGameCategories { get; set; }

    public virtual DbSet<LkpUserType> LkpUserTypes { get; set; }

    public virtual DbSet<TblChildProfile> TblChildProfiles { get; set; }

    public virtual DbSet<TblClinicProfile> TblClinicProfiles { get; set; }

    public virtual DbSet<TblDoctorProfile> TblDoctorProfiles { get; set; }

    public virtual DbSet<TblGameSession> TblGameSessions { get; set; }

    public virtual DbSet<TblMemoryScoreSummary> TblMemoryScoreSummaries { get; set; }

    public virtual DbSet<TblUser> TblUsers { get; set; }

    public virtual DbSet<VChildPerformance> VChildPerformances { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-IG01C0F\\SQLEXPRESS;Database=KidsMemoreyTestDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LkpGame>(entity =>
        {
            entity.HasKey(e => e.GameId).HasName("PK__lkpGame___2AB897FDD86C540D");

            entity.ToTable("lkpGame");

            entity.Property(e => e.GameId).ValueGeneratedNever();
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.GameName).HasMaxLength(100);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Category).WithMany(p => p.LkpGames)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__lkpGame_N__Categ__1AD3FDA4");
        });

        modelBuilder.Entity<LkpGameCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__lkpGameC__19093A0B3778A60E");

            entity.ToTable("lkpGameCategory");

            entity.Property(e => e.CategoryName).HasMaxLength(50);
        });

        modelBuilder.Entity<LkpUserType>(entity =>
        {
            entity.HasKey(e => e.UserTypeId).HasName("PK__lkpUserT__40D2D816B39613F8");

            entity.ToTable("lkpUserType");

            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<TblChildProfile>(entity =>
        {
            entity.HasKey(e => e.ChildId).HasName("PK__tblChild__BEFA07165ADAEE8F");

            entity.ToTable("tblChildProfile");

            entity.HasIndex(e => e.UserId, "UQ__tblChild__1788CC4D581BB326").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(200);
            entity.Property(e => e.ChildName).HasMaxLength(100);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.ParentName).HasMaxLength(100);
            entity.Property(e => e.ParentNumber).HasMaxLength(20);

            entity.HasOne(d => d.Clinic).WithMany(p => p.TblChildProfiles)
                .HasForeignKey(d => d.ClinicId)
                .HasConstraintName("FK__tblChildP__Clini__5EBF139D");

            entity.HasOne(d => d.Doctor).WithMany(p => p.TblChildProfiles)
                .HasForeignKey(d => d.DoctorId)
                .HasConstraintName("FK__tblChildP__Docto__5DCAEF64");

            entity.HasOne(d => d.User).WithOne(p => p.TblChildProfile)
                .HasForeignKey<TblChildProfile>(d => d.UserId)
                .HasConstraintName("FK_tblChildProfile_UserId");
        });

        modelBuilder.Entity<TblClinicProfile>(entity =>
        {
            entity.HasKey(e => e.ClinicId).HasName("PK__tblClini__3347C2DD244090FB");

            entity.ToTable("tblClinicProfile");

            entity.HasIndex(e => e.UserId, "UQ__tblClini__1788CC4DADFA0164").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(200);
            entity.Property(e => e.ClinicName).HasMaxLength(100);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Phone).HasMaxLength(20);

            entity.HasOne(d => d.User).WithOne(p => p.TblClinicProfile)
                .HasForeignKey<TblClinicProfile>(d => d.UserId)
                .HasConstraintName("FK_tblClinicProfile_UserId");
        });

        modelBuilder.Entity<TblDoctorProfile>(entity =>
        {
            entity.HasKey(e => e.DoctorId).HasName("PK__tblDocto__2DC00EBF12C8DAB9");

            entity.ToTable("tblDoctorProfile");

            entity.HasIndex(e => e.UserId, "UQ__tblDocto__1788CC4D6F47F16A").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.LicenseNumber).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Specialty).HasMaxLength(100);

            entity.HasOne(d => d.Clinic).WithMany(p => p.TblDoctorProfiles)
                .HasForeignKey(d => d.ClinicId)
                .HasConstraintName("FK__tblDoctor__Clini__5812160E");

            entity.HasOne(d => d.User).WithOne(p => p.TblDoctorProfile)
                .HasForeignKey<TblDoctorProfile>(d => d.UserId)
                .HasConstraintName("FK_tblDoctorProfile_UserId");
        });

        modelBuilder.Entity<TblGameSession>(entity =>
        {
            entity.HasKey(e => e.SessionId).HasName("PK__tblGameS__C9F492907008F90D");

            entity.ToTable("tblGameSession", tb =>
                {
                    tb.HasTrigger("SetGameWeight");
                    tb.HasTrigger("trg_CalculateCategoryScores");
                });

            entity.HasIndex(e => e.SummarySessionId, "IX_GameSession_SummarySession");

            entity.Property(e => e.EndTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SessionDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.StartTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Weight)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Game).WithMany(p => p.TblGameSessions)
                .HasForeignKey(d => d.GameId)
                .HasConstraintName("FK__tblGameSe__GameI__693CA210");

            entity.HasOne(d => d.SummarySession).WithMany(p => p.TblGameSessions)
                .HasForeignKey(d => d.SummarySessionId)
                .HasConstraintName("FK_GameSession_MemorySummary");

            entity.HasOne(d => d.User).WithMany(p => p.TblGameSessions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_GameSession_User");
        });

        modelBuilder.Entity<TblMemoryScoreSummary>(entity =>
        {
            entity.HasKey(e => e.SummaryId).HasName("PK__tblMemor__DAB10E2FF952E1A7");

            entity.ToTable("tblMemoryScoreSummary");

            entity.HasIndex(e => new { e.UserId, e.SessionStartTime }, "IX_UserSession");

            entity.HasIndex(e => e.UserId, "UQ_User_ActiveSession")
                .IsUnique()
                .HasFilter("([IsActive]=(1))");

            entity.Property(e => e.AuditoryScore)
                .HasDefaultValueSql("(NULL)")
                .HasColumnType("decimal(10, 4)");
            entity.Property(e => e.CategoriesCompleted)
                .HasMaxLength(100)
                .HasDefaultValue("");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EpisodicScore)
                .HasDefaultValueSql("(NULL)")
                .HasColumnType("decimal(10, 4)");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SessionDate).HasDefaultValueSql("(CONVERT([date],getdate()))");
            entity.Property(e => e.SessionEndTime).HasColumnType("datetime");
            entity.Property(e => e.SessionStartTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TotalScore)
                .HasDefaultValueSql("(NULL)")
                .HasColumnType("decimal(10, 4)");
            entity.Property(e => e.VisualScore)
                .HasDefaultValueSql("(NULL)")
                .HasColumnType("decimal(10, 4)");
            entity.Property(e => e.WorkingScore)
                .HasDefaultValueSql("(NULL)")
                .HasColumnType("decimal(10, 4)");

            entity.HasOne(d => d.User).WithOne(p => p.TblMemoryScoreSummary)
                .HasForeignKey<TblMemoryScoreSummary>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MemoryScoreSummary_User");
        });

        modelBuilder.Entity<TblUser>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__tblUser__1788CC4C6A481765");

            entity.ToTable("tblUser");

            entity.HasIndex(e => e.Email, "UQ__tblUser__A9D10534D92A5292").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.UserPassword).HasMaxLength(200);

            entity.HasOne(d => d.UserType).WithMany(p => p.TblUsers)
                .HasForeignKey(d => d.UserTypeId)
                .HasConstraintName("FK__tblUser__UserTyp__7C4F7684");
        });

        modelBuilder.Entity<VChildPerformance>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("v_ChildPerformance");

            entity.Property(e => e.CategoriesCompleted).HasMaxLength(100);
            entity.Property(e => e.ChildName).HasMaxLength(100);
            entity.Property(e => e.ParentName).HasMaxLength(100);
            entity.Property(e => e.SessionEndTime).HasColumnType("datetime");
            entity.Property(e => e.SessionStartTime).HasColumnType("datetime");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
