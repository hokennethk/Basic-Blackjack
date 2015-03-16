/*

Basic Blackjack game
Basic because:
- Player plays one hand at a time
- no splits
- no double down
- no betting logic
- no surrender
- no insurance
- Each game is played with full deck

RULES:
- Player and Dealer each get dealt two cards
- Dealer hand has one card face down, one face up
- Card Values:
	- Number cards: respective numeric values
	- Face cards: 10
	- Ace: 1 or 11

- if hand value goes > 21, that hand busts. Player bust is auto-loss
- no one wins pushes

- Player rules:
	- hit or stand anytime value is not > 21
- Dealer rules: 
	- must hit if hand value is a soft 17 or lower (when A value = 11)
	- must stand once hand value is hard 17 or higher (A value = 1)
*/


// Initialize
var deck 		= deck 			|| new ns.Deck();
var playerHand 	= playerHand 	|| new ns.BlackjackHand();
var dealerHand	= dealerHand	|| new ns.BlackjackHand();
var gameResult;

// DOM variables
var $playerHand = $("#player").find("div.cards");
var $dealerHand = $("#dealer").find("div.cards");
var playersArr = [$playerHand, $dealerHand];

// change Ace logic for dealer (hit on soft17 rule)
dealerHand.prototype = Object.create(ns.BlackjackHand.prototype);
ns.BlackjackHand.prototype.getValueWithAce = function(handVal) {
	if (handVal !== 7 && handVal + 10 <= 21) {
		handVal += 10;
	}
	return handVal;
}

//========================================================
// Editing prototypes to add jquery to manipulate webpage
//========================================================
ns.Card.prototype.getCssClass = function() {
	// returns a css class name for card sprite
	return "card-" + this.getRankAsString() + "-" + this.getSuitAsString();
}

ns.Hand.prototype.addCard = (function() {
	// applies original addCard method, and also takes a callback to 
	// handle jQuery manipulation
	var cached = ns.Hand.prototype.addCard;
	return function(card, callback, flipped) {
		// apply original function
		cached.apply(this, arguments);
		// adding optional callback to handle webpage display
		if (callback != undefined) {
			if (this === playerHand) 		{ var player = $playerHand; }
			else if (this === dealerHand) 	{ var player = $dealerHand; };
			callback(player, card, flipped);
		}
	}
})();

var addCard = function(player, card, flipped) {
	// callback used to display card on page after it is added to a hand
	var $card = $("<div class='card'></div>").hide();
	player.append($card);
	player.find("div.card").last().addClass(card.getCssClass());

	// if flipped, add a cardback to hide card
	if (flipped) {
		player.find("div.card")
		.last()
		.append("<div class='card card-Back'></div>");
	}
	
	// animate and show cards on webpage
	playersArr.forEach(function(player) {
		(function animate() {
			player.find("div.card:hidden")
			.not("div.card-Back")	// don't want to have cardback reappear
			.first()
			.show(300, animate)
		})();
	})
	
}

var main = function() {
	// function to run for each new game

	// hide past results
	$("#game-result-box").hide()
	$("#game-result-box").removeClass();
	$("#game-result-box").find("div.result-message").remove();
	// hide buttons
	$("div.buttons").css("visibility", "hidden").show();

	// hide dealer score
	$("#dealer").find("div.score").css("visibility", "hidden");

	// deal
	newGameDeal();
}

var showButtons = function () {
	$("div.buttons").css("visibility", "visible");
}

var hideButtons = function () {
	$("div.buttons").css("visibility", "hidden");
}

var newGameDeal = function() {
	// deals two cards to each player and checks for blackjack

	// reshuffle full deck
	deck.combine();	// put used cards back (playing with full deck)
	deck.shuffle();

	// empty hands
	playerHand.clearHand();
	dealerHand.clearHand();
	$playerHand.empty();
	$dealerHand.empty();

	// deal cards
	var dealRoundCounter = 1;
	(function dealRound() {
			switch(dealRoundCounter) {
				case 1:
					playerHand.addCard(deck.deal(), addCard);
					break;
				case 2:
					dealerHand.addCard(deck.deal(), addCard);
					break;
				case 3:
					playerHand.addCard(deck.deal(), addCard);
					break;
				case 4:
					dealerHand.addCard(deck.deal(), addCard, true); // face down
					break;
				default:
					// No more cards, play round
					// display buttons
					showButtons();
					// check blackjack
					if (playerHand.getValue() === 21 ||
						dealerHand.getValue() === 21) {
						dealerReveal(function() {
							showScore(true);
							compare(playerHand, dealerHand);
						})
					}

					return;
					break;
			}
	
			// Update player score
			showScore();
	
			// timer for calls
			dealRoundCounter++;
			setTimeout(dealRound, 500);
		})();
}

var displayValues = function() {
	// logs values to console (for testing)
	console.log("Player Hand = ", playerHand.getValue());
	console.log("Dealer Hand = ", dealerHand.getValue())
}

var compare = function(playerHand, dealerHand) {
	// compares hands. Returns function to display results
	// true = Player wins
	// false = dealer wins
	// "PUSH" = tie
	var playerVal = playerHand.getValue();
	var dealerVal = dealerHand.getValue();
	var gameResult;

	// game result
	if 		(playerVal > 21) {gameResult = false}
	else if (dealerVal > 21) {gameResult = true}
	else 	{
		if (playerVal === dealerVal) {gameResult = "PUSH"}
		else { gameResult = playerVal > dealerVal; }
	}

	// display results

	return gameMessage(gameResult);
}

var hit = function(hand) {
	// deals a card to a given hand
	hand.addCard(deck.deal(), addCard);
	// update score on webpage
	showScore();
	// for busts, auto compare
	if (hand.getValue() > 21) {
		setTimeout(dealerReveal, 500);	// delay for cosmetic purposes
		compare(playerHand, dealerHand);
	}
}


var dealerReveal = function (callback) {
	// reveals dealer's hidden card. Takes an optional callback function
	// to perform AFTER revealing card, such as performing
	// addition hits to dealer's hand if player hasn't busted
	$dealerHand.find("div.card-Back").fadeOut(300, callback);
	$("#dealer").find("div.score").css("visibility", "visible")


}
var dealer = function() {
	// dealer logic is automated
	// runs after player stands

	dealerReveal(function() {
		// reveal dealer card and hit after revealing
		while (dealerHand.getValue() < 17) {
			hit(dealerHand);
		};
		showScore();
		compare(playerHand, dealerHand)
	})
}

var showScore = function(isblackjack) {
	// displays score on webpage. isblackjack argument is for
	// checking blackjack for new deals
	var playerScore = playerHand.getValue();
	var dealerScore = dealerHand.getValue();
	// Handle blackjack if argument is given
	if (isblackjack) { 
		playerScore = playerScore === 21 ? "BLACKJACK":playerScore;
		dealerScore = dealerScore === 21 ? "BLACKJACK":dealerScore;
	}
	// Busts
	if (playerScore > 21) {
		playerScore = "BUST";
	} 
	if (dealerScore > 21) {
		dealerScore = "BUST";
	}
	$("#dealer").find("div.score").html(dealerScore);
	$("#player").find("div.score").html(playerScore);
}

// Handle game messages
var gameMessage = function(gameResult) {
	// cases: win, lose, push
	var $gameResult = $("#game-result-box");
	$gameResult.hide();
	$gameResult.append("<div class='result-message'></div>");
	switch (gameResult) {
		case true:
			$gameResult.addClass("win");
			$("div.result-message").last().text("You Win!")
			break;
		case false:
			$gameResult.addClass("lose");
			$("div.result-message").last().text("You lose :(")
			break;
		default:
			$gameResult.addClass("push");
			$("div.result-message").last().text("PUSH!")
			break;
	}

	/* show message */
	// hide buttons
	$("div.buttons").hide();
	// show message
	$gameResult.show()
}


// Load main when document is ready
$(document).ready(main())

	