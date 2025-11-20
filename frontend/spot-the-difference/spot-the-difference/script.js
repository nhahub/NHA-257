 let startTime = null;

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
          console.log("Game 3 result saved:", payload);
        } catch (err) {
          console.error("Failed to send game 3 result:", err);
        }
      }

      function endGameAPI(finalScore) {
        sendResult(3, finalScore); // Game 3 = Spot The Difference
      }

      //  Game Variables
      const initialTime = 60;
      const initialSize = 3;
      const maxSize = 20;

      let time;
      let size;
      let score;
      let maxScore = 0;
      let counter;

      const emojiPairs = [
        ["🐶", "🐱"],
        ["🍎", "🍏"],
        ["🌞", "🌝"],
        ["⭐", "✨"],
        ["🐠", "🐟"],
        ["🐰", "🐹"],
        ["🚗", "🚕"],
        ["🌸", "🌼"],
        ["🍓", "🍒"],
        ["🦋", "🐞"]
      ];

      //  Start Game
      function startGame() {
        startTime = new Date().toISOString(); //  for API

        score = 0;
        time = initialTime;
        size = initialSize;

        document.getElementById("current-score").textContent = score;
        document.getElementById("max-score").textContent = maxScore;

        document.getElementById("start-button").style.display = "none";
        document.getElementById("description").textContent = `Time left: ${time}s`;

        loadBoard();

        counter = setInterval(() => {
          document.getElementById("description").textContent = `Time left: ${--time}s`;
          if (time <= 0) finishGame("Time's up");
        }, 1000);
      }

      
      //  Load Game Grid
      function loadBoard() {
        const game = document.getElementById("game");
        let html = "";

        const randomSet = emojiPairs[Math.floor(Math.random() * emojiPairs.length)];
        const baseEmoji = randomSet[0];
        const specialEmoji = randomSet[1];

        const specialPos = {
          row: Math.floor(Math.random() * size),
          col: Math.floor(Math.random() * size)
        };

        for (let r = 0; r < size; r++) {
          html += '<div class="row">';
          for (let c = 0; c < size; c++) {
            const isSpecial = r === specialPos.row && c === specialPos.col;
            html += `
              <div class="character" onclick="${isSpecial ? "correct()" : "wrong()"}">
                ${isSpecial ? specialEmoji : baseEmoji}
              </div>`;
          }
          html += "</div>";
        }

        game.innerHTML = html;
      }

      
      //  Correct Click
      function correct() {
        if (size < maxSize) size++;

        score++;
        document.getElementById("current-score").textContent = score;

        loadBoard();
      }
      
      //  Wrong Click
      function wrong() {
        finishGame("Wrong spot");
      }

      //  End Game
      function finishGame(message) {
        clearInterval(counter);

        document.getElementById("game").innerHTML = "";
        document.getElementById("description").textContent = `${message}! Score: ${score}`;
        document.getElementById("start-button").textContent = "Play Again";
        document.getElementById("start-button").style.display = "block";

        if (score > maxScore) maxScore = score;

        endGameAPI(score); //  Store result in backend
      }