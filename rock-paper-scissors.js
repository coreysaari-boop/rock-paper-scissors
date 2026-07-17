
// ===============================
// Game Operation Logic
// ===============================

// Track player scores
let humanScore = 0;
let computerScore = 0;
let roundsToWin = 3;

/*
  Determine the winner of a round 
  Compare player choice against computer choice 
  Return string containing round outcome
*/
function determineWinner(userChoice, computerChoice) {
  
  if (userChoice === computerChoice) {
	return "It's a tie!";
  } else if (userChoice === "paper" && computerChoice === "rock") {
	return "Human Wins!";
  } else if (userChoice === "rock" && computerChoice === "scissors") {
	return "Human Wins!";
  } else if (userChoice === "scissors" && computerChoice === "paper") {
	return "Human Wins!";
  } else {
	return "Computer Wins!";
  }
}

/*
  Randomly generate computer choice 
  Uses Math.random to pick rock, paper, or scissors
*/
function getComputerChoice() {
  
  let randomNumber = Math.floor(Math.random() * 3);
  
  if (randomNumber === 0) {
	return "rock";
  } else if (randomNumber === 1) {
	return "paper";
  } else {
	return "scissors";
  }
}

// ===============================
// End Game Operation Logic
// ===============================

/*
  Play one round of the game 
  - Get computer's choice 
  - Determine winner 
  - Update scores 
  - Update the DOM 
  - Log the round in history 
*/
function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  console.log("Computer chose:", computerChoice);
  
  const result = determineWinner(playerChoice, computerChoice);
  console.log("Result (debug):", JSON.stringify(result));
  
  // Update Scores 
  if (result === "Human Wins!") {
	humanScore++;
  } else if (result === "Computer Wins!") {
	computerScore++;
  }
 
  console.log("Human:", humanScore, "| Computer:", computerScore);
  
  // Update DOM 
  document.getElementById("result").textContent = result;
  document.getElementById("player-score").textContent = humanScore;
  document.getElementById("computer-score").textContent = computerScore;
  
  updateProgressBars();
  
  // Check for game over 
  if (humanScore === roundsToWin) {
	showGameOver("You win!");
  }
  if (computerScore === roundsToWin) {
	showGameOver("Computer Wins!");
  }
  
  // Animate result text 
  const resultBox = document.getElementById("result");
  resultBox.classList.remove("animate");
  void resultBox.offsetWidth;
  resultBox.classList.add("animate");
  
  // Animate score changes
  const playerScoreBox = document.getElementById("player-score");
  const computerScoreBox = document.getElementById("computer-score");
  
  // Restart animation for player score 
  playerScoreBox.classList.remove("score-animate");
  void playerScoreBox.offsetWidth;
  playerScoreBox.classList.add("score-animate");
  
  // Restart animation for computer score 
  computerScoreBox.classList.remove("score-animate");
  void computerScoreBox.offsetWidth;
  computerScoreBox.classList.add("score-animate");
    
  // Add round history. ID found in HTML. 
  const history = document.getElementById("history");
  const entry = document.createElement("div");
  entry.textContent = `Player: ${playerChoice} | Computer: ${computerChoice} → ${result}`;
  history.appendChild(entry);
  
  updateMilestones();
  
  return result;
    
}

/*
  Reset game state: 
  - Scores reset to zero
  - Round outcomes are erased
  - Round history log erased
*/
function resetGame() {
  humanScore = 0;
  computerScore = 0;
  document.getElementById("player-score").textContent = humanScore;
  document.getElementById("computer-score").textContent = computerScore;
  document.getElementById("result").textContent = "";
  document.getElementById("history").innerHTML = "";
  
  updateRoundsIndicator();
  updateProgressBars();
  updateMilestones();
}

function showGameOver(winner) {
  const modal = document.getElementById("game-over-modal");
  const message = document.getElementById("game-over-message");
  
  message.textContent = winner;
  modal.classList.remove("hidden");
}

function updateRoundsIndicator() {
  document.getElementById("rounds-indicator").textContent = 
    `First to ${roundsToWin} wins`;
}

function updateProgressBars() {
  const playerPercent = (humanScore / roundsToWin) * 100;
  const computerPercent = (computerScore / roundsToWin) * 100;
  
  document.getElementById("player-progress").style.width = `${playerPercent}%`;
  document.getElementById("computer-progress").style.width = `${computerPercent}%`;
}

function updateMilestones() {
  const milestonePercent = (1 / roundsToWin) * 100;
  
  document.getElementById("player-milestone").style.left = `${milestonePercent}%`;
  document.getElementById("computer-milestone").style.left = `${milestonePercent}%`;
}

// ===============================
// Event Listeners
// ===============================

// Grab all buttons inside #choices (found in HTML - Rock, Paper, Scissors)
const choiceButtons = document.querySelectorAll('#choices button');

/*
  Adds click listeners to each choice button 
  When button is clicked:
  - Read player's choice from data-choice 
  - Play a round with that choice
*/
choiceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
	const playerChoice = btn.dataset.choice; // "rock", "paper", or "scissors"
	console.log("Player chose:", playerChoice);
	
	const result = playRound(playerChoice);
	
	// Remove any previous flash classes 
	btn.classList.remove("win-flash", "loss-flash", "tie-flash");
	
	// Adds correct flash based on round outcome 
	if (result === "Human Wins!") {
	  btn.classList.add("win-flash");
	} else if (result === "Computer Wins!") {
	  btn.classList.add("loss-flash");
	} else {
	  btn.classList.add("tie-flash");
	}
	
	setTimeout(() => {
	  btn.classList.remove("win-flash", "loss-flash", "tie-flash");
	}, 400);
		
	// Add temporary "clicked" class for animation
	btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 300);
  });
});

document.getElementById("mode-bo5").addEventListener("click", () => {
  roundsToWin = 3;
  resetGame();
  updateRoundsIndicator();
  updateMilestones();
  
  // Highlight selected mode 
  document.getElementById("mode-bo5").classList.add("selected-mode");
  document.getElementById("mode-bo7").classList.remove("selected-mode");
  
  updateProgressBars();
  
});

document.getElementById("mode-bo7").addEventListener("click", () => {
  roundsToWin = 4;
  resetGame();
  updateRoundsIndicator();
  updateMilestones();
  
  // Highlight selected mode 
  document.getElementById("mode-bo5").classList.add("selected-mode");
  document.getElementById("mode-bo7").classList.remove("selected-mode");

  updateProgressBars();
  
});

updateRoundsIndicator();

document.getElementById("mode-bo5").classList.add("selected-mode");

// Reset button listener
document.getElementById("reset").addEventListener("click", resetGame);

document.getElementById("play-again").addEventListener("click", () => {
  document.getElementById("game-over-modal").classList.add("hidden");
  resetGame();
});
