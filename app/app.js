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

// change Ace logic for dealer (hit on soft17 rule)
dealerHand.prototype = Object.create(ns.BlackjackHand.prototype);
ns.BlackjackHand.prototype.getValueWithAce = function(handVal) {
	if (handVal !== 7 && handVal + 10 <= 21) {
		handVal += 10;
	}
	return handVal;
}

/*
Below I decided to edit ns.Hand.prototype.addCard method since
everytime a card is added to the hand, I want it to display on the page.
My thinking was that combining the actions would reduce the error of
dealing a card to a hand and not having it display.

However, the if/else statement I have below only applies to player and dealer hands
if I wanted to refactor this code to include more players, this would need to change

*/
ns.Hand.prototype.addCard = (function() {
	var cached = ns.Hand.prototype.addCard;
	return function(card) {
		// apply original function
		cached.apply(this, arguments);
		// display card on webpage
		if (this === playerHand) 		{ var player = $playerHand; }
		else if (this === dealerHand) 	{ var player = $dealerHand; }

		player.append("<div class='card'></div>");
		if (player === $playerHand) {
			var lastCard = playerHand.hand[playerHand.hand.length-1];
		} else if (player === $dealerHand) {
			var lastCard = dealerHand.hand[dealerHand.hand.length-1];
		}
		player.last("div.card")
			.append(lastCard.toString())
	}
})();

ns.Card.prototype.getCssClass = function() {
	// returns a css class name for card sprite
	return "card-" + this.getRankAsString() + "-" + this.getSuitAsString();
}


var main = function() {
	// main logic for game with win/lose results
	newGameDeal();
	// check for BlackJack
	if (playerHand.getValue() === 21 || dealerHand.getValue() === 21) {
		console.log("Blackjack!");
		return compare(playerHand, dealerHand)
	} 
}

// new game should shuffle full deck, deal cards
var newGameDeal = function() {
	// reshuffle full deck
	deck.combine();	// put used cards back (playing with full deck)
	deck.shuffle();

	// empty hands
	playerHand.clearHand();
	dealerHand.clearHand();
	$playerHand.empty();
	$dealerHand.empty();

	// deal cards
	for (var i=0;i<2;i++) {
		playerHand.addCard(deck.deal());
		dealerHand.addCard(deck.deal());
	}

	// display score
	showScore();

	// display buttons
	$("#game").find("button").show();

}

var displayValues = function() {
	// logs values to console
	console.log("Player Hand = ", playerHand.getValue());
	console.log("Dealer Hand = ", dealerHand.getValue())
}

var compare = function(playerHand, dealerHand) {
	// compares hands
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
	console.log(gameResult)
	$("#game").find("button[name !='main']").hide();

	return gameResult;
}

var hit = function(hand) {
	// deals a card to a given hand
	hand.addCard(deck.deal());
	// show score
	showScore();
	// for busts, auto compare
	if (hand.getValue() > 21) {
		return compare(playerHand, dealerHand);
	}
}

var dealer = function() {
	// dealer logic is automated
	// runs after player stands
	while (dealerHand.getValue() < 17) {
		hit(dealerHand);
	}
	showScore();
	return compare(playerHand, dealerHand)
}

var showScore = function() {
	// displays score on webpage
	var playerScore = playerHand.getValue();
	var dealerScore = dealerHand.getValue();
	if (playerScore > 21) {
		playerScore = "BUST";
	} 
	if (dealerScore > 21) {
		dealerScore = "BUST";
	}

	$("#player").find("div.score").html(playerScore);
	$("#dealer").find("div.score").html(dealerScore);
}

// Load main when document is ready
$(document).ready(main())

	