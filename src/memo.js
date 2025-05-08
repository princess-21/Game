document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    let flippedCards = [];
    let canClick = true;
    let matchedCards = 0; // Count matched cards
    const totalCards = cards.length;
    let timer = 120; // 2 minutes in seconds
    const timerDisplay = document.getElementById("timer"); // Get timer display element
    let timerStarted = false;
    let timerInterval; // Declare timerInterval in a scope accessible by all functions

    // Function to flip the card (CSS-based flip using is-flipped class)
    function flipCard(card) {
        card.classList.toggle("is-flipped");
    }

    // Function to check for a match between two cards
    function checkMatch() {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];

        if (card1.getAttribute('data-card') === card2.getAttribute('data-card')) {
            // Cards match, keep them flipped
            flippedCards = []; // Reset flipped cards array
            canClick = true;   // Allow new flips
            matchedCards += 2; // Increment matched cards count
            checkGameWon();    // Check if the game is won
        } else {
            // No match, flip them back after 1 second
            setTimeout(() => {
                flipCard(card1);  // Flip card 1 back
                flipCard(card2);  // Flip card 2 back
                flippedCards = []; // Reset flipped cards array
                canClick = true;   // Allow new flips
            }, 1000);
        }
    }

    // Add event listener to each card
    cards.forEach(card => {
        card.addEventListener("click", function () {
            if (!canClick || flippedCards.includes(card) || card.classList.contains("is-flipped")) return;

            if (!timerStarted) {
                startTimer();  // Start timer on first click
                timerStarted = true;
            }

            flipCard(card);  // Flip the clicked card
            flippedCards.push(card);  // Add it to the flipped cards array

            if (flippedCards.length === 2) {
                canClick = false;  // Prevent new clicks while checking match
                checkMatch();      // Check if the two flipped cards match
            }
        });
    });

    // Timer countdown function
    function startTimer() {
        timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                timerDisplay.textContent = formatTime(timer); // Update timer display
            }
            if (timer <= 0) {
                clearInterval(timerInterval);  
                if (matchedCards < totalCards) {
                    showPopup('Defeat', 'popup');  // Display defeat popup if game is lost
                }
            }
        }, 1000);
    }

    // Function to check if the player won the game
    function checkGameWon() {
        if (matchedCards === totalCards) {
            clearInterval(timerInterval); // Stop the timer if game is won
            showPopup('Victory', 'vicup');  // Display victory popup
        }
    }

    // Helper function to format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Format as MM:SS
    }

    // Function to show the popup (either victory or defeat)
    function showPopup(message, popupId) {
        const popup = document.getElementById(popupId);
        const popupMessage = popup.querySelector('h3');
        popupMessage.textContent = message;
        popup.style.display = 'flex';  // Show the correct popup (either victory or defeat)
    }

    // Function to hide popup
    function hidePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';  // Hide the popup
    }

    // Attach event listener to close popup (if you have a close button, or add a similar logic)
    document.getElementById('close-popup')?.addEventListener('click', hidePopup);
});
