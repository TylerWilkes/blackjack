//variables
var dHand; //0
var pHand; //1
var deck;
var dealerCard2;
var loaded;
var money = 1000;
var bet = 50;

//functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function addDealerCard2() {
  dealerCard2 = document.createElement('img');
  var image = './playingCards/' + dHand[1][1] + '_of_' + dHand[1][2];
  image += dHand[1][1].length > 3 ? '2.png' : '.png';
  dealerCard2.setAttribute('src', image);
  dealerCard2.setAttribute('class', 'card');
  dealerCard2.addEventListener('load', async function(){loaded = true;});
  document.getElementById('dHand').appendChild(dealerCard2);
  await delay(260);
}

async function genCard(rank, suit, pd) {
  var card = document.createElement('img');
  var image = './playingCards/' + rank + '_of_' + suit;
  image += rank.length > 3 ? '2.png' : '.png';
  card.setAttribute('src', image);
  card.setAttribute('class', 'card');
  card.addEventListener('load', async function(){loaded = true;});
  if (pd == 0) {
    document.getElementById('dHand').appendChild(card);
    dHand.push([card, rank, suit]);
  }
  else if (pd == 1) {
    document.getElementById('pHand').appendChild(card);
    pHand.push([card, rank, suit]);
  }
  console.log(getTotal(0).toString() + " " + getTotal(1).toString());
  await delay(260);
}

function genDeck() {
  for (var suit = 0; suit < 4; suit++) {
    for (var rank = 2; rank <= 14; rank++) {
      var tempRank = rank.toString();
      if (rank == "11") {
        tempRank = "jack";
      }
      else if (rank == "12") {
        tempRank = "queen";
      }
      else if (rank == "13") {
        tempRank = "king";
      }
      else if (rank == "14") {
        tempRank = "ace";
      }

      var tempSuit;
      if (suit == 0) {
        tempSuit = "spades";
      }
      else if (suit == 1) {
        tempSuit = "hearts";
      }
      else if (suit == 2) {
        tempSuit = "clubs";
      }
      else if (suit == 3) {
        tempSuit = "diamonds";
      }

      deck.push([tempRank, tempSuit]);
    }
  }
}

function shuffle(array) {
  var currentIndex = array.length;
  while (currentIndex != 0) {
    var randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

async function hit() {
  var temp = deck.pop();
  await genCard(temp[0], temp[1], 1);
  if (getTotal(1) > 21) {
    await addDealerCard2();
    alert("You busted and lost (" + getTotal(0).toString() + " vs " + getTotal(1).toString() + ")");
    if (money < 1) {
      alert("You went bankrupt, money reset")
      money = 1000;
      bet = 50;
      document.getElementById("money").innerHTML = "Money: $" + money.toString();
      document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
    }
    start();
  }
}

async function stand() {
  await addDealerCard2();
  if (getTotal(0) <= 16) {
    var temp = deck.pop();
    await genCard(temp[0], temp[1], 0);
  }
  if (getTotal(0) > 21) {
    alert("The dealer busted, you won! (" + getTotal(1).toString() + " vs " + getTotal(0).toString() + ")! You won $" + (bet * 2).toString());
    money += bet * 2;
    document.getElementById("money").innerHTML = "Money: $" + money.toString();
  }
  else if (getTotal(0) < getTotal(1)) {
    alert("You won (" + getTotal(1).toString() + " vs " + getTotal(0).toString() + ")! You won $" + (bet * 2).toString());
    money += bet * 2;
    document.getElementById("money").innerHTML = "Money: $" + money.toString();
  }
  else if (getTotal(0) == getTotal(1)) {
    alert("You tied (" + getTotal(0).toString() + " vs " + getTotal(1).toString() + ")! You won $" + bet.toString());
    money += bet;
    document.getElementById("money").innerHTML = "Money: $" + money.toString();
  }
  else {
    alert("You lost (" + getTotal(0).toString() + " vs " + getTotal(1).toString() + ")");
    if (money < 1) {
      alert("You went bankrupt, money reset")
      money = 1000;
      bet = 50;
      document.getElementById("money").innerHTML = "Money: $" + money.toString();
      document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
    }
  }
  start();
}

function getTotal(pd) {
  var total = 0;
  var aces = 0;
  var hand;
  if (pd == 0) {
    hand = dHand;
  }
  else {
    hand = pHand;
  }
  for (var i = 0; i < hand.length; i++) {
    switch (hand[i][1]) {
      case "ace":
        aces++;
      break;
      case "2":
        total += 2;
      break;
      case "3":
        total += 3;
      break;
      case "4":
        total += 4;
      break;
      case "5":
        total += 5;
      break;
      case "6":
        total += 6;
      break;
      case "7":
        total += 7;
      break;
      case "8":
        total += 8;
      break;
      case "9":
        total += 9;
      break;
      default:
        total += 10;
    }
  }
  for (var i = 0; i < aces; i++) {
    if (i < aces - 1) {
      total++;
    }
    else if (total + 11 <= 21) {
      total += 11;
    }
    else {
      total++;
    }
  }
  return total;
}

function upBet() {
  if (!(bet + 1 > money)) {
    bet++;
    document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
  }
}

function downBet() {
  if (!(bet - 1 < 1)) {
    bet--;
    document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
  }
}

function upBet5() {
  if (!(bet + 5 > money)) {
    bet += 5;
    document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
  }
}

function downBet5() {
  if (!(bet - 5 < 1)) {
    bet -= 5;
    document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
  }
}

function double() {
  if (!(bet * 2 > money)) {
    bet = bet * 2;
    document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
  }
}

function half() {
  if (!(Math.floor(bet / 2) < 1)) {
    bet = Math.floor(bet / 2);
    document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
  }
}

function maxBet() {
  bet = money;
  document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
}

async function changeBets() {
  document.getElementById('hit').removeEventListener('click', hit);
  document.getElementById('stand').removeEventListener('click', stand);
  document.getElementById("dTitle").innerHTML = "Change Bets: 5s";
  await delay(1000);
  document.getElementById("dTitle").innerHTML = "Change Bets: 4s";
  await delay(1000);
  document.getElementById("dTitle").innerHTML = "Change Bets: 3s";
  await delay(1000);
  document.getElementById("dTitle").innerHTML = "Change Bets: 2s";
  await delay(1000);
  document.getElementById("dTitle").innerHTML = "Change Bets: 1s";
  await delay(1000);
  document.getElementById("dTitle").innerHTML = "";
  return true;
}

//start function
async function start() {
  cards = document.getElementsByClassName('card');
  if (cards.length != 0) {
    await changeBets();
  }
  else {
    document.getElementById('play').removeEventListener('click', start);
  }
  while (cards.length > 0) {
    cards = document.getElementsByClassName('card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].remove();
    }
  }

  money -= bet;
  document.getElementById("money").innerHTML = "Money: $" + money.toString();

  document.getElementById('hit').addEventListener('click', hit);
  document.getElementById('stand').addEventListener('click', stand);

  dHand = []; //0
  pHand = []; //1
  deck = [];
  loaded = false;
  genDeck();
  shuffle(deck);
  
  var temp = deck.pop();
  await genCard(temp[0], temp[1], 1); //player card 1
  temp = deck.pop();
  await genCard(temp[0], temp[1], 1); //player card 2
  temp = deck.pop();
  await genCard(temp[0], temp[1], 0); //dealer card 1
  temp = deck.pop(); //dealer card 2, don't display
  dHand.push([null, temp[0], temp[1]]);
  console.log(getTotal(0).toString() + " " + getTotal(1).toString());

  if (getTotal(0) == 21 && getTotal(1) == 21) {
    await addDealerCard2();
    alert("You and the dealer hit a blackjack, you tied (" + getTotal(0).toString() + " vs " + getTotal(1).toString() + ")! You won $" + bet.toString());
    money += bet;
    document.getElementById("money").innerHTML = "Money: $" + money.toString();
    start();
  }
  else if (getTotal(1) == 21) {
    await addDealerCard2();
    alert("You hit a blackjack, you won (" + getTotal(1).toString() + " vs " + getTotal(0).toString() + ")! You won $" + (bet * 2).toString());
    money += bet * 2;
    document.getElementById("money").innerHTML = "Money: $" + money.toString();
    start();
  }
  else if (getTotal(0) == 21) {
    await addDealerCard2();
    alert("The dealer hit a blackjack, you lost (" + getTotal(0).toString() + " vs " + getTotal(1).toString() + ")");
    if (money < 1) {
      alert("You went bankrupt, money reset")
      money = 1000;
      bet = 50;
      document.getElementById("money").innerHTML = "Money: $" + money.toString();
      document.getElementById("bet").innerHTML = "Bet: $" + bet.toString();
    }
    start();
  }
}

//start up
document.getElementById('upBet').addEventListener('click', upBet);
document.getElementById('downBet').addEventListener('click', downBet);
document.getElementById('upBet5').addEventListener('click', upBet5);
document.getElementById('downBet5').addEventListener('click', downBet5);
document.getElementById('double').addEventListener('click', double);
document.getElementById('half').addEventListener('click', half);
document.getElementById('maxBet').addEventListener('click', maxBet);
document.getElementById('play').addEventListener('click', start);
