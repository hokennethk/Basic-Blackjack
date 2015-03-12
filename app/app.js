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
// change Ace logic for dealer (soft17)
dealerHand.prototype = Object.create(ns.BlackjackHand.prototype);
ns.BlackjackHand.prototype.getValueWithAce = function(handVal) {
	if (handVal !== 7 && handVal + 10 <= 21) {
		handVal += 10;
	}
	return handVal;
}

// DOM variables
var $playerCards = $("#player").find("div.cards");
var $dealerCards = $("#dealer").find("div.cards");


// function start new game (start on page load)
// new game should deal cards
var newGame = function() {
	// handle deck
	deck.combine();	// put used cards back (playing with full deck)
	deck.shuffle();

	// handle hands
	playerHand.clearHand();
	dealerHand.clearHand();

	// deal cards
	for (var i=0;i<2;i++) {
		playerHand.addCard(deck.deal());
		dealerHand.addCard(deck.deal())
	}

	// check for BlackJack
	if (playerHand.getValue() === 21 || dealerHand.getValue() === 21) {
		console.log("Blackjack!");
		return compare(playerHand, dealerHand)
	}


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
	if 		(playerVal > 21) {return false}
	else if (dealerVal > 21) {return true}
	else 	{
		if (playerVal === dealerVal) {return "PUSH"}
		else { return playerVal > dealerVal; }
	}
}

var hit = function(hand) {
	// deals a card to a given hand
	hand.addCard(deck.deal());
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
	return compare(playerHand, dealerHand)
}

var main = function() {
	// main logic for game
	newGame(); 		// start new game


}

var addCard = function(player) {
	player.append("<div class='card'>TEST</div>");
	
}

// Load main when document is ready
$(document).ready(main())

	