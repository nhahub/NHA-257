let highScore = 0;
let currentScore = 0;
let isSequencePlayed = false;
let startTime = null;  // used for API schema timing

//  SEND GAME RESULT TO  API
async function sendResult(gameId, score, trials = 0, misses = 0) {
    const now = new Date();

    const payload = {
        userId: 1,
        gameId: gameId,
        startTime: startTime,
        endTime: now.toISOString(),
        score: score,
        trials: trials,
        misses: misses,
        sessionDate: now.toISOString().split("T")[0]
    };

    try {
        await fetch("https://localhost:7134/GameSession", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log("Result stored:", payload);
    } catch (error) {
        console.error("Error sending result:", error);
    }
}

function endGame(finalScore, trials = 0, misses = 0) {
    sendResult(9, finalScore, trials, misses);  // gameId = 1 → Simon Game
}

const simonGame = {
    sequence: [],
    playerSequence: [],
    sounds: {
        red: new Audio("./sounds/red.mp3"),
        green: new Audio("./sounds/green.mp3"),
        yellow: new Audio("./sounds/yellow.mp3"),
        blue: new Audio("./sounds/blue.mp3")
    },

    setSequence() {
        const randomNumber = Math.floor(Math.random() * 4);
        const colors = ["green", "red", "yellow", "blue"];
        this.sequence.push(colors[randomNumber]);
    },

    round() {
        this.setSequence();
        this.playSequence();
    },

    playSequence() {
        isSequencePlayed = false;
        this.playerSequence = [];
        this.disableButtons();

        this.sequence.forEach((seqColor, i) => {
            setTimeout(() => {
                $("#" + seqColor).addClass("pressed");
                if (this.sounds[seqColor]) this.sounds[seqColor].play();

                setTimeout(() => {
                    $("#" + seqColor).removeClass("pressed");
                }, 500);

            }, i * 1000);
        });

        setTimeout(() => {
            isSequencePlayed = true;
            this.enableButtons();
        }, this.sequence.length * 1000 + 500);
    },

    enableButtons() {
        $(".btn").on("click", this.handleButtonClick.bind(this));
    },

    disableButtons() {
        $(".btn").off("click");
    },

    handleButtonClick(event) {
        const color = $(event.target).attr("id");
        $(event.target).addClass("pressed");

        if (this.sounds[color]) this.sounds[color].play();
        setTimeout(() => {
            $(event.target).removeClass("pressed");
        }, 100);

        this.playerSequence.push(color);
        this.checkSequence();
    },

    checkSequence() {
        const index = this.playerSequence.length - 1;

        if (this.playerSequence[index] !== this.sequence[index]) {
            this.gameOver();
        } else if (this.playerSequence.length === this.sequence.length) {
            currentScore++;
            $("#current-score").text(currentScore);

            if (currentScore > highScore) {
                highScore = currentScore;
                $("#high-score").text(highScore);
            }

            setTimeout(() => {
                this.round();
            }, 1000);
        }
    },

    gameOver() {
        $("body").addClass("game-over");
        setTimeout(() => $("body").removeClass("game-over"), 200);

        // Send result to backend
        endGame(currentScore);

        currentScore = 0;
        $("#current-score").text(currentScore);
        $("#game-over-screen").removeClass("hidden");
    },

    start() {
        this.sequence = [];
        this.playerSequence = [];
        currentScore = 0;

        // Record the start time for API
        startTime = new Date().toISOString();

        $("#current-score").text(currentScore);
        $("#game-over-screen").addClass("hidden");

        this.round();
    }
};

$("#start-btn").on("click", () => simonGame.start());
$("#restart-btn").on("click", () => simonGame.start());
