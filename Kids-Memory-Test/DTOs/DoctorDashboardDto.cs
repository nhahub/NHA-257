namespace Kids_Memory_Test.DTOs
{
    public class DoctorDashboardDto
    {
        public int ChildId { get; set; }
        public string ChildName { get; set; }
        public string ParentName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int GameId { get; set; }
        public int GameScore { get; set; }
        public DateTime? SessionDate { get; set; }
        public decimal? DailyTotalScore { get; set; }
        public int SummaryId { get; set; }
        public decimal TotalWeightedScore { get; set; }
        public decimal WorkingScore { get; set; }
        public decimal EpisodicScore { get; set; }
        public decimal VisualScore { get; set; }
        public decimal AuditoryScore { get; set; }
        

    }
}
