/*
	An object created with Deck() should represent a normal deck
	of 52 playing cards.
	Every card in deck should be unique (different rank/suit combinations)

	Deck can be shuffled and cards can be dealt from deck

	Used (dealt) cards are kept track of. Cards here can be put back
	into real deck
*/

// add myNameSpace to not pollute global object
window.myNameSpace = window.myNameSpace || {};

myNameSpace.Deck = function() {
	// populate deck
	this.cards = [];
	for (var rank = 1; rank < 14; rank++) {
		for (var suit = 0; suit < 4; suit++) {
			this.cards.push(new myNameSpace.Card(rank, suit))
		}
	}

	// keep track of used cards
	this.usedCards = [];
}


myNameSpace.Deck.prototype.shuffle = function() {
	// shuffles the deck of remaining cards
	for (var i=0; i<this.cards.length;i++) {
		var rand = Math.floor(Math.random() * this.cards.length);
		var temp = this.cards[i];
		this.cards[i] = this.cards[rand];
		this.cards[rand] = temp;
	}
};

myNameSpace.Deck.prototype.combine = function() {
	// combines remaining cards with used cards to form a 
	// new deck. Then shuffles.
	this.cards = this.cards.concat(this.usedCards);
	this.usedCards = [];
	this.shuffle();
}

myNameSpace.Deck.prototype.deal = function() {
	// returns a card from the "top" of the deck
	if (this.cards.length === 0) {
		this.combine();
	}
	var dealt =  this.cards.shift();
	this.usedCards.push(dealt);
	return dealt;
}

myNameSpace.Deck.prototype.cardsLeft = function() {
	// returns remaining number of cards in deck
	return this.cards.length;
}