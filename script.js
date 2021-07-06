const finalScore = document.getElementById("final-score");
const innerCards = document.querySelectorAll(".flip-card-inner");
const cards = document.querySelectorAll(".flip-card");
const bestGuess = document.getElementById("best-score");
const currentGuess = document.getElementById("current-score");
let preCard = null;
let guessCount = 0;
let nonMatchedCard = cards.length / 2;
let bestGuessScore = parseInt(localStorage.getItem("lowestScore")) || Infinity;
let inactive;

//If there is best guess score show top of the page
if (bestGuessScore == Infinity) {
  bestGuess.parentElement.innerText = "";
} else {
  bestGuess.innerText = bestGuessScore;
}

currentGuess.innerText = guessCount;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter) + 1;

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

//
function startGame() {
  // create Pair Images List
  let indices = [];
  for (let i = 1; i <= innerCards.length / 2; i++) {
    indices.push(i.toString());
  }
  let pairImages = shuffle(indices.concat(indices));

  for (let i = 0; i < innerCards.length; i++) {
    let path = "images/" + pairImages[i] + ".jpeg";
    innerCards[i].children[1].children[0].src = path;
  }
}

startGame();

function finishGame(score) {
  finalScore.innerText = "Your score: " + score;
  if (score < bestGuessScore) {
    finalScore.innerText += " - New Best Score!";
    localStorage.setItem("lowestScore", score);
  }
  document.getElementById("end").classList.add("game-over");
}

function handleCardClick(event) {
  if (event.target.parentElement.className !== "flip-card-front" || inactive) {
    return;
  }

  let currentCard = event.target.parentElement.parentElement;
  currentCard.classList.add("flipped");
  guessCount++;
  currentGuess.innerText = guessCount;

  if (preCard) {
    preCardSrc = preCard.children[1].children[0].src;
    currentCardSrc = currentCard.children[1].children[0].src;

    if (preCardSrc === currentCardSrc) {
      nonMatchedCard--;

      if (nonMatchedCard == 0) {
        finishGame(guessCount);
      }
      preCard = null;
    } else {
      inactive = true;
      setTimeout(function () {
        preCard.classList.remove("flipped");
        currentCard.classList.remove("flipped");
        preCard = null;
        inactive = false;
      }, 700);
    }
  } else {
    preCard = currentCard;
  }
}

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", handleCardClick);
}
