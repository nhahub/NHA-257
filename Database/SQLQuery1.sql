create database KidsMemoreyTestDB

CREATE TABLE lkpUserType (
    UserTypeId INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(50) NOT NULL,
    Description NVARCHAR(200),
    IsDeleted BIT DEFAULT 0
);

CREATE TABLE tblUser(
    UserId INT PRIMARY KEY IDENTITY,
    UserTypeId INT FOREIGN KEY REFERENCES lkpUserType(UserTypeId),
    Email NVARCHAR(100) UNIQUE NOT NULL,
    UserPassword NVARCHAR(200) NOT NULL,
    IsDeleted BIT DEFAULT 0
);
CREATE TABLE tblClinicProfile (
    ClinicId INT PRIMARY KEY IDENTITY,
    UserId INT UNIQUE FOREIGN KEY REFERENCES tblUser(UserId) ON DELETE NO ACTION,
    ClinicName NVARCHAR(100),
    Address NVARCHAR(200),
    Phone NVARCHAR(20),
    IsDeleted BIT DEFAULT 0
);

CREATE TABLE tblDoctorProfile (
    DoctorId INT PRIMARY KEY IDENTITY,
    UserId INT UNIQUE FOREIGN KEY REFERENCES tblUser(UserId) ON DELETE NO ACTION,
    ClinicId INT FOREIGN KEY REFERENCES tblClinicProfile(ClinicId),
    FullName NVARCHAR(100),
    Specialty NVARCHAR(100),
    LicenseNumber NVARCHAR(50),
    Address NVARCHAR(100),
    Phone NVARCHAR(20),
    IsDeleted BIT DEFAULT 0
);

CREATE TABLE tblChildProfile (
    ChildId INT PRIMARY KEY IDENTITY,
    UserId INT UNIQUE FOREIGN KEY REFERENCES tblUser(UserId) ON DELETE NO ACTION,
    ChildName NVARCHAR(100),
    ParentName NVARCHAR(100),
    ParentNumber NVARCHAR(20),
    Address NVARCHAR(200),
    DateOfBirth DATE,
    DoctorId INT FOREIGN KEY REFERENCES tblDoctorProfile(DoctorId),
    ClinicId INT FOREIGN KEY REFERENCES tblClinicProfile(ClinicId),
    IsDeleted BIT DEFAULT 0
);

CREATE TABLE lkpGameCategory (
    CategoryId INT PRIMARY KEY IDENTITY,
    CategoryName NVARCHAR(50) NOT NULL
);

CREATE TABLE lkpGame (
    GameId INT PRIMARY KEY ,
    CategoryId INT FOREIGN KEY REFERENCES lkpGameCategory(CategoryId),
    GameName NVARCHAR(100),
    Weight DECIMAL(10,4) DEFAULT 1.0,
    Description NVARCHAR(200),
    IsDeleted BIT DEFAULT 0
);


CREATE TABLE tblMemoryScoreSummary (
    SummaryId INT PRIMARY KEY IDENTITY,
    UserId INT FOREIGN KEY REFERENCES tblUser(UserId) ON DELETE CASCADE,
    CreatedAt datetime DEFAULT GETDATE(),
	IsActive BIT DEFAULT 1,
	SessionStartTime DATETIME NOT NULL DEFAULT GETDATE(),
    SessionEndTime DATETIME NULL,
    SessionDate DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
	GamesPlayed INT DEFAULT NULL,
	CategoriesCompleted NVARCHAR(100) DEFAULT '',
    WorkingScore DECIMAL(10,4) DEFAULT NULL,
    EpisodicScore DECIMAL(10,4) DEFAULT NULL,
    VisualScore DECIMAL(10,4) DEFAULT NULL,
    AuditoryScore DECIMAL(10,4) DEFAULT NULL,
    TotalScore DECIMAL(10,4) DEFAULT 0,
);
CREATE INDEX IX_UserSession
ON tblMemoryScoreSummary(UserId, SessionStartTime);

CREATE TABLE tblGameSession (
    SessionId INT PRIMARY KEY IDENTITY,
    UserId INT FOREIGN KEY REFERENCES tblUser(UserId) ON DELETE CASCADE,
    GameId INT FOREIGN KEY REFERENCES lkpGame(GameId),
    StartTime DATETIME DEFAULT GETDATE(),
    EndTime DATETIME DEFAULT NULL,
    Score INT,
    Trials INT,
	Misses INT,
	Weight DECIMAL(5,2) DEFAULT 0 ,
    SessionDate DATE DEFAULT GETDATE(),
    SummarySessionId INT NULL FOREIGN KEY REFERENCES tblMemoryScoreSummary(SummaryId) ON DELETE No Action
);
-- Create index for better performance
CREATE INDEX IX_GameSession_SummarySession 
ON tblGameSession(SummarySessionId);


CREATE UNIQUE INDEX UQ_User_ActiveSession 
ON tblMemoryScoreSummary(UserId)
WHERE IsActive = 1;

Insert into lkpGameCategory
values('Working Memory'),
      ('Episodic Memory'),
      ('Visual Memory'),
      ('Auditory Memory');

INSERT INTO lkpGame(GameId, CategoryId, Weight,GameName, Description,isDeleted)
VALUES
(1, 1,0.95, 'Simon Says','Players follow spoken commands that increase in complexity (e.g., “Simon says touch your nose”). It trains auditory attention, sequencing, and working memory.',0),
(2, 1,0.85, 'Number Sequence', 'Players are shown a sequence of numbers that disappears after a short time. They must recall and repeat it in the correct order, enhancing numerical and sequential memory.', 0),
(3, 1,0.75, 'Memory Cards', 'A classic matching game where players flip cards to find pairs of identical images. It strengthens working memory, attention to detail, and visual recall', 0),
(4, 2,0.80, 'Story Chain', 'Participants listen to or read a story and must recall or continue it by linking events logically. It enhances narrative recall and sequencing ability.', 0),
(5, 2,0.85, 'History Story Telling','Players are given historical or fictional events and must retell or reorder them correctly. It improves contextual and temporal memory.', 0),
(6, 2,0.85, 'Memory Timeline','Users organize events or images in the correct chronological order, boosting their ability to recall the timing and order of experiences.', 0),
(7, 3,0.95, 'Tray Game', 'Players observe a set of cards, which are then turned over. They must remember and match identical images, improving visual pattern recognition and recall.', 0),
(8, 3,0.91, 'Tricky Cards','A variation of the memory card game with more complex or similar-looking images designed to increase visual discrimination and concentration.', 0),
(9, 3,0.70, 'Visual Tracking','Players follow moving objects on the screen and identify their final positions. This game enhances focus, spatial awareness, and motion tracking skills.', 0),
(10, 4,0.95, 'Listen and Recall','Participants listen to a series of words, numbers, or sentences, then recall them in order. It helps strengthen auditory retention and short-term memory.', 0),
(11, 4,0.20, 'Instrument Recognition', 'Players hear different musical instrument sounds and must identify each correctly. This game develops auditory discrimination and sound-to-source association skills.', 0),
(12, 4,0.20, 'Animal Recognition', 'Listen to rare and surprising noises from the wild and guess who is making the sound.', 0);


Insert into lkpUserType( Name, Description)
values ('Clinic','"1" is the Unchangeble Id for clinics,hospitals, or any organization.'),
       ('Doctor','"2" is the Unchangeble Id for any Doctor.'),
       ('Child','"3" is the Unchangeble Id for any child.')




--1.Create Stored Procedure to Start New Session
CREATE OR ALTER PROCEDURE sp_StartGamingSession
    @UserId INT,
    @SessionStartTime DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewSessionId INT;
    
    -- Validate user is a child
    IF NOT EXISTS (
        SELECT 1 FROM tblUser 
        WHERE UserId = @UserId AND UserTypeId = 3 AND IsDeleted = 0
    )
    BEGIN
        RAISERROR('Only active children can start gaming sessions.', 16, 1);
        RETURN;
    END;
    
    -- Check if there's already an active session
    IF EXISTS (
        SELECT 1 FROM tblMemoryScoreSummary 
        WHERE UserId = @UserId AND IsActive = 1
    )
    BEGIN
        RAISERROR('User already has an active session. Please end it first.', 16, 1);
        RETURN;
    END;
    
    -- Create new session
    INSERT INTO tblMemoryScoreSummary (
        UserId, 
        SessionStartTime, 
        SessionDate,
        IsActive
    )
    VALUES (
        @UserId,
        ISNULL(@SessionStartTime, GETDATE()),
        CAST(ISNULL(@SessionStartTime, GETDATE()) AS DATE),
        1 -- Active session
    );
    
    SET @NewSessionId = SCOPE_IDENTITY();
    
    -- Return the new session ID
    SELECT @NewSessionId AS SessionId;
END;
GO


 -- 2.Stored Procedure: Adding Game to Session
CREATE OR ALTER PROCEDURE sp_AddGameToSession
    @UserId INT,
    @GameId INT,
    @Score DECIMAL(10,4),
    @Trials INT = 0,
    @Misses INT = 0,
    @StartTime DATETIME = NULL,
    @EndTime DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ActiveSessionId INT;
    DECLARE @SessionDate DATE;
	DECLARE @GameWeight DECIMAL(10,4);

    -- Validate user is a child
    IF NOT EXISTS (
        SELECT 1 FROM tblUser 
        WHERE UserId = @UserId AND UserTypeId = 3 AND IsDeleted = 0
    )
    BEGIN
        RAISERROR('Only children can submit game sessions.', 16, 1);
        RETURN;
    END;

    -- Get active session
    SELECT @ActiveSessionId = SummaryId, @SessionDate = SessionDate
    FROM tblMemoryScoreSummary
    WHERE UserId = @UserId AND IsActive = 1;

    -- If no active session, error
    IF @ActiveSessionId IS NULL
    BEGIN
        RAISERROR('No active gaming session found. Please start a session first.', 16, 1);
        RETURN;
    END;

    -- GET WEIGHT FROM DB (The Fix)
    SELECT @GameWeight = Weight FROM lkpGame WHERE GameId = @GameId;

    -- Insert (With Weight)
    INSERT INTO tblGameSession (
        UserId, GameId, StartTime, EndTime, Score, Trials, Misses, SessionDate, SummarySessionId, Weight
    )
    VALUES (
        @UserId, @GameId, ISNULL(@StartTime, GETDATE()), @EndTime, @Score, @Trials, @Misses, @SessionDate, @ActiveSessionId, ISNULL(@GameWeight, 1)
    );

    -- Return
    SELECT SessionId, @ActiveSessionId AS SummarySessionId, Score 
    FROM tblGameSession WHERE SessionId = SCOPE_IDENTITY();
END;
GO
    

--3.stored Procedure: End Gaming Session
CREATE OR ALTER PROCEDURE sp_EndGamingSession
    @UserId INT,
    @SessionEndTime DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ActiveSessionId INT;

    -- Find active session
    SELECT @ActiveSessionId = SummaryId
    FROM tblMemoryScoreSummary
    WHERE UserId = @UserId AND IsActive = 1;

    IF @ActiveSessionId IS NULL
    BEGIN
        RAISERROR('No active session found for this user.', 16, 1);
        RETURN;
    END;

	UPDATE tblMemoryScoreSummary
    SET 
        SessionEndTime = ISNULL(@SessionEndTime, GETDATE()),
        IsActive = 0,
        GamesPlayed = (SELECT COUNT(*) FROM tblGameSession WHERE SummarySessionId = @ActiveSessionId)
    WHERE SummaryId = @ActiveSessionId;

    SELECT * FROM tblMemoryScoreSummary WHERE SummaryId = @ActiveSessionId;
END;
GO


--4.Stored Procedure: Add new user
CREATE PROCEDURE sp_RegisterUser
    @UserTypeId INT,
    @Email NVARCHAR(100),
    @Password NVARCHAR(200),
    @Name NVARCHAR(100),
    @ExtraInfo NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UserId INT;

    INSERT INTO tblUser (UserTypeId, Email, UserPassword)
    VALUES (@UserTypeId, @Email, @Password);

    SET @UserId = SCOPE_IDENTITY();

    IF @UserTypeId = 1  -- Clinic
        INSERT INTO tblClinicProfile (UserId, ClinicName, Address, Phone)
        VALUES (@UserId, @Name, @ExtraInfo, NULL);
	  

    ELSE IF @UserTypeId = 2  -- Doctor
        INSERT INTO tblDoctorProfile (UserId, FullName, Specialty)
        VALUES (@UserId, @Name, @ExtraInfo);
	

    ELSE IF @UserTypeId = 3  -- Child
        INSERT INTO tblChildProfile (UserId, ParentName)
        VALUES (@UserId, @ExtraInfo);
END;



--  5.Stored Procedure: Doctor’s Dashboard
CREATE OR ALTER PROCEDURE sp_GetDoctorDashboard
    @DoctorId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        C.ChildId,
		C.ChildName,
        C.ParentName,
		C.DateOfBirth,
        GS.GameId,
        GS.Score AS GameScore,
        GS.SessionDate,
		MS.SummaryId,
        MS.TotalScore AS DailyTotalScore,

		-- Return the Category Scores for the Radar Chart
        MS.TotalScore AS TotalWeightedScore, 
        ISNULL(MS.WorkingScore, 0) AS WorkingScore,
        ISNULL(MS.EpisodicScore, 0) AS EpisodicScore,
        ISNULL(MS.VisualScore, 0) AS VisualScore,
        ISNULL(MS.AuditoryScore, 0) AS AuditoryScore

    FROM tblChildProfile C
    INNER JOIN tblUser U ON U.UserId = C.UserId
    INNER JOIN tblGameSession GS ON GS.UserId = C.UserId
    LEFT JOIN tblMemoryScoreSummary MS 
           ON MS.SummaryId = GS.SummarySessionId

           WHERE C.DoctorId = @DoctorId
      AND C.IsDeleted = 0
    ORDER BY GS.SessionDate DESC, C.ChildId;
    END;
    GO



--6. Calculate category's score
CREATE OR ALTER TRIGGER trg_CalculateCategoryScores
ON tblGameSession
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @SummarySessionId INT;
    DECLARE @GameId INT;
    DECLARE @CategoryId INT;
    
    -- 1. Get info about the new game played
    SELECT 
        @SummarySessionId = SummarySessionId,
        @GameId = GameId
    FROM inserted;
    
    IF @SummarySessionId IS NULL RETURN;
    
    SELECT @CategoryId = CategoryId FROM lkpGame WHERE GameId = @GameId;
    
    -- 1. Category Score (Weighted Average)
    DECLARE @CategoryScore DECIMAL(10,4), @CatDivisor DECIMAL(10,4);
    
    SELECT @CatDivisor = SUM(Weight), @CategoryScore = SUM(Score * Weight)
    FROM tblGameSession gs
    INNER JOIN lkpGame g ON gs.GameId = g.GameId -- Extra safety join
    WHERE gs.SummarySessionId = @SummarySessionId AND g.CategoryId = @CategoryId;

    IF @CatDivisor > 0 SET @CategoryScore = @CategoryScore / @CatDivisor;
    ELSE SET @CategoryScore = 0;

    IF @CategoryId = 1 UPDATE tblMemoryScoreSummary SET WorkingScore = @CategoryScore WHERE SummaryId = @SummarySessionId;
    ELSE IF @CategoryId = 2 UPDATE tblMemoryScoreSummary SET EpisodicScore = @CategoryScore WHERE SummaryId = @SummarySessionId;
    ELSE IF @CategoryId = 3 UPDATE tblMemoryScoreSummary SET VisualScore = @CategoryScore WHERE SummaryId = @SummarySessionId;
    ELSE IF @CategoryId = 4 UPDATE tblMemoryScoreSummary SET AuditoryScore = @CategoryScore WHERE SummaryId = @SummarySessionId;

    -- 2. Total Score (Global Weighted Average 0-100)
    DECLARE @GlobalSum DECIMAL(10,4), @GlobalWeight DECIMAL(10,4), @FinalScore DECIMAL(10,4);

    SELECT @GlobalSum = SUM(gs.Score * gs.Weight), @GlobalWeight = SUM(gs.Weight)
    FROM tblGameSession gs
    WHERE gs.SummarySessionId = @SummarySessionId;

    IF @GlobalWeight > 0 SET @FinalScore = @GlobalSum / @GlobalWeight;
    ELSE SET @FinalScore = 0;

    -- 3. Final Update
    UPDATE tblMemoryScoreSummary
    SET TotalScore = @FinalScore,
        CategoriesCompleted = CASE 
            WHEN CategoriesCompleted NOT LIKE '%' + CAST(@CategoryId AS NVARCHAR(1)) + '%' 
            THEN CategoriesCompleted + ',' + CAST(@CategoryId AS NVARCHAR(1)) 
            ELSE CategoriesCompleted END
    WHERE SummaryId = @SummarySessionId;
END;
GO


--7.Helper Procedure to Get Active Session
CREATE OR ALTER PROCEDURE sp_GetActiveSession
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        SummaryId AS SessionId,
        SessionStartTime,
        SessionDate,
        WorkingScore,
        EpisodicScore,
        VisualScore,
        AuditoryScore,
        TotalScore,
        GamesPlayed,
        CategoriesCompleted,
        IsActive
    FROM tblMemoryScoreSummary
    WHERE UserId = @UserId AND IsActive = 1;
END;
GO



-- 8. Get Detailed User Info (for the admin)
CREATE OR ALTER PROCEDURE sp_Admin_GetUserDetails
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @UserType INT;
    SELECT @UserType = UserTypeId FROM tblUser WHERE UserId = @UserId;

    -- A. IF DOCTOR
    IF @UserType = 2 
    BEGIN
        SELECT 
            U.UserId, U.Email, U.UserTypeId, U.IsDeleted,
            P.FullName, P.Specialty, P.Phone, P.Address, -- Added Address
            
            (SELECT COUNT(*) FROM tblChildProfile WHERE DoctorId = P.DoctorId) as AssociatedCount,
            
            -- Padding
            NULL as ParentName, NULL as DateOfBirth, NULL as AssignedDoctor
        FROM tblUser U
        INNER JOIN tblDoctorProfile P ON U.UserId = P.UserId
        WHERE U.UserId = @UserId;
    END

    -- B. IF CHILD
    ELSE IF @UserType = 3 
    BEGIN
        SELECT 
            U.UserId, U.Email, U.UserTypeId, U.IsDeleted,
            P.ChildName as FullName, P.ParentNumber as Phone, P.ParentName, P.Address, P.DateOfBirth,
            
            (SELECT FullName FROM tblDoctorProfile WHERE DoctorId = P.DoctorId) as AssignedDoctor,

            -- Padding
            NULL as Specialty, NULL as AssociatedCount
        FROM tblUser U
        INNER JOIN tblChildProfile P ON U.UserId = P.UserId
        WHERE U.UserId = @UserId;
    END
END;
GO


-- 9. Manage User Status (Soft & Hard Delete)
CREATE OR ALTER PROCEDURE sp_Admin_ManageUser
    @UserId INT,
    @ActionType VARCHAR(20) -- 'DEACTIVATE', 'ACTIVATE', 'DELETE'
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. DEACTIVATE (Soft Delete)
    IF @ActionType = 'DEACTIVATE'
    BEGIN
        -- Mark User as deleted
        UPDATE tblUser SET IsDeleted = 1 WHERE UserId = @UserId;
        
        -- Also mark specific profiles to ensure data consistency
        -- (This checks if the record exists before trying to update, which is safer)
        UPDATE tblChildProfile SET IsDeleted = 1 WHERE UserId = @UserId;
        UPDATE tblDoctorProfile SET IsDeleted = 1 WHERE UserId = @UserId;
        UPDATE tblClinicProfile SET IsDeleted = 1 WHERE UserId = @UserId; -- Added for completeness
    END

    -- 2. ACTIVATE (Restore)
    ELSE IF @ActionType = 'ACTIVATE'
    BEGIN
        UPDATE tblUser SET IsDeleted = 0 WHERE UserId = @UserId;
        UPDATE tblChildProfile SET IsDeleted = 0 WHERE UserId = @UserId;
        UPDATE tblDoctorProfile SET IsDeleted = 0 WHERE UserId = @UserId;
        UPDATE tblClinicProfile SET IsDeleted = 0 WHERE UserId = @UserId;
    END

    -- 3. DELETE (Hard Delete - Permanent)
    ELSE IF @ActionType = 'DELETE'
    BEGIN
        -- Order matters: Delete child tables first, then the parent User table
        DELETE FROM tblGameSession WHERE UserId = @UserId;
        DELETE FROM tblMemoryScoreSummary WHERE UserId = @UserId;
        
        -- Delete Profiles
        DELETE FROM tblChildProfile WHERE UserId = @UserId;
        DELETE FROM tblDoctorProfile WHERE UserId = @UserId;
        DELETE FROM tblClinicProfile WHERE UserId = @UserId; 
        DELETE FROM tblUser WHERE UserId = @UserId;
    END
END;
GO