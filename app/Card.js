/*
Card "class". Try to make as general as possible
*/

// add myNameSpace to not pollute global object
window.ns = window.ns || {};


ns.Card = function(rank, suit) {
	// rank is a numeric value 1-13
	// suit is a numeric value 0-3
	this.rank = rank;
	this.suit = suit;

	// numeric maps
	/*
	var rankMap = {
		"A":1,
		"K":13,
		"Q":12,
		"J":11
	}
	
	var suitMap = {
		"Spades"	: 0,
		"Clubs"		: 1,
		"Diamonds"	: 2,
		"Hearts"	: 3
	}
	*/

}

ns.Card.prototype.getSuit = function() {
	return this.suit;
}
ns.Card.prototype.getRank = function() {
	return this.rank;
}

ns.Card.prototype.getSuitAsString = function() {
	return ["Spades", "Clubs", "Diamonds", "Hearts"][this.suit];
}

ns.Card.prototype.getRankAsString = function() {
	var rankMap = {
		"1"	:"Ace",
		"11": "Jack", 
		"12":"Queen", 
		"13":"King"
	}
	return rankMap[this.rank] || this.rank;
}
ns.Card.prototype.toString = function() {
	return this.getRankAsString() + " of " + this.getSuitAsString();
}