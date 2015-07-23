/*
	An object created with Hand() represents a hand of cards.
	There is no max number of cards by default: to set a max,
	this must be declared in constructor (i.e. 5 cards for
	poker hands)

*/

// add NameSpace to not pollute global object
window.ns = window.ns || {};

ns.Hand = function(max) {
	// creates hand with max capacity defined or 52 (whole deck)
	this.max = max || 52;
	this.hand = [];	// cards in hand
};

ns.Hand.prototype.clearHand = function() {
	// clears hand
	this.hand = [];
};

ns.Hand.prototype.addCard = function(card) {
	// adds a card to the hand
	if (card != null && this.hand.length < this.max) {
		this.hand.push(card);
	}
};

ns.Hand.prototype.removeCard = function(card) {
	// removes card if found
	// currently taking card object as argument... which means
	// this won't work unless the exact reference to the card
	// is passed. Not needed for blackjack
	var index = this.hand.indexOf(card);
	if (index > -1) {
		this.hand.splice(index, 1);
	}
};

ns.Hand.prototype.getCardCount = function() {
	// returns hand length/size
	return this.hand.length;
};

ns.Hand.prototype.getCard = function(position) {
	// gets card in hand at position number
	// if card not found, return null
	if (position>0 && position < this.hand.length) {
		return this.hand[position];
	} else {
		return null;
	}
};

ns.Hand.prototype.sortByRank = function() {
	// sorts hand by rank (aces = 1)
	this.hand = this.hand.sort(function(a, b) {
		return a.getRank() - b.getRank();
	});
};