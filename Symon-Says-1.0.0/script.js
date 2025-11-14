     /******** Global Variables & Game State ********/
      const colorButtons = {
        green: document.getElementById("green"),
        red: document.getElementById("red"),
        yellow: document.getElementById("yellow"),
        blue: document.getElementById("blue"),
      };

      const audioElements = {
        green: document.getElementById("audio-green"),
        red: document.getElementById("audio-red"),
        yellow: document.getElementById("audio-yellow"),
        blue: document.getElementById("audio-blue"),
        wrong: document.getElementById("audio-wrong"),
      };

      const startBtn = document.getElementById("startBtn");
      const levelDisplay = document.getElementById("levelDisplay");
      const messageDiv = document.getElementById("message");

      let gameSequence = [];
      let playerSequence = [];
      let level = 0;
      let acceptingInput = false;

      /******** Helper Functions ********/
      // Play the audio for a given color
      function playColorSound(color) {
        const audio = audioElements[color];
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch((err) => console.log(err));
        }
      }

      // Flash a quadrant with dynamic speed based on level
      function flashColor(color) {
        return new Promise((resolve) => {
          const button = colorButtons[color];
          // Dynamic flash duration: decrease as level increases (min 300ms)
          const flashDuration = Math.max(300, 600 - level * 20);
          const pauseDuration = Math.max(100, 200 - level * 10);
          button.classList.add("flash");
          playColorSound(color);
          setTimeout(() => {
            button.classList.remove("flash");
            setTimeout(() => {
              resolve();
            }, pauseDuration);
          }, flashDuration);
        });
      }

      // Update the level display
      function updateLevelDisplay() {
        levelDisplay.textContent = `Level: ${level}`;
      }

      // Show message to the player
      function showMessage(msg) {
        messageDiv.textContent = msg;
      }

      // Sleep helper
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      /******** Game Functions ********/
      // Generate a random color cue
      function getRandomColor() {
        const colors = Object.keys(colorButtons);
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
      }

      // Play the full sequence; speed increases as level increases
      async function playSequence() {
        acceptingInput = false;
        showMessage("Watch the sequence...");
        for (let color of gameSequence) {
          await flashColor(color);
          await sleep(200);
        }
        acceptingInput = true;
        showMessage("Your turn!");
      }

      // Handle user input
      function handleUserClick(color) {
        if (!acceptingInput) return;
        playerSequence.push(color);
        // Provide immediate feedback by flashing the color
        flashColor(color);

        // Check the user's input against the sequence
        const currentIndex = playerSequence.length - 1;
        if (playerSequence[currentIndex] !== gameSequence[currentIndex]) {
          // Wrong input: play wrong sound and end game
          const wrongAudio = audioElements.wrong;
          if (wrongAudio) {
            wrongAudio.currentTime = 0;
            wrongAudio.play().catch((err) => console.log(err));
          }
          gameOver();
          return;
        }

        // If sequence for this level is complete, progress to the next level
        if (playerSequence.length === gameSequence.length) {
          acceptingInput = false;
          showMessage("Good job! Next level...");
          setTimeout(() => nextLevel(), 1000);
        }
      }

      // Start a new level by adding a cue and playing sequence
      async function nextLevel() {
        playerSequence = [];
        level++;
        updateLevelDisplay();
        const newColor = getRandomColor();
        gameSequence.push(newColor);
        await sleep(800);
        await playSequence();
      }

      // End game sequence
      function gameOver() {
        acceptingInput = false;
        showMessage(
          `Game Over! You reached level ${level}. Press "Start Game" to restart.`
        );
        // Reset game state after a brief pause if desired here.
        gameSequence = [];
        playerSequence = [];
        level = 0;
        updateLevelDisplay();
      }

      /******** Event Listeners ********/
      startBtn.addEventListener("click", async () => {
        showMessage("");
        gameSequence = [];
        playerSequence = [];
        level = 0;
        updateLevelDisplay();
        // Start immediately after a short pause
        await sleep(500);
        nextLevel();
      });

      // Attach click handlers to each quadrant
      Object.keys(colorButtons).forEach((color) => {
        colorButtons[color].addEventListener("click", () =>
          handleUserClick(color)
        );
      });
