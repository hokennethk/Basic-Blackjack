/*
	An object created with BlackjackHand will represent a hand in
	blackjack.

	Methods will be initially inherited from Hand.

	Add method to calculate value of blackjack hand
*/

// add NameSpace to not pollute global object
window.ns = window.ns || {};

ns.BlackjackHand = function () {
	ns.Hand.call(this);
};

// inherit methods in ns.Hand.prototype
ns.BlackjackHand.prototype = Object.create(ns.Hand.prototype);

ns.BlackjackHand.prototype.getValue = function() {
	// gets Blackjack value for hand with A = 1 || 11

	var cardsInHand = this.hand;
	var ace = false;	// if hand contains ace
	var handVal = 0; 	// total hand value
	for (i=0;i<cardsInHand.length;i++) {
		var card = cardsInHand[i];
		var cardVal = card.getRank();
		if (cardVal > 10) { cardVal = 10; }
		if (cardVal === 1) { ace = true; }
		handVal += cardVal;
	}

	// Now handVal is value of hand with aces === 1
	return ace ? this.getValueWithAce(handVal) : handVal;
};

ns.BlackjackHand.prototype.getValueWithAce = function(handVal) {
	// (separated to easily overwrite later for soft17 logic)
	// If handVal + 10 is <= 21, then add 10 to handVal
	// to make one ace worth 11. Else, return handVal.
	// Only accounting for one ace to equal 11 since 2
	// Aces cannot both equal 11 (would bust)
	if (handVal + 10 <= 21) {
		handVal += 10;
	}
	return handVal;
};