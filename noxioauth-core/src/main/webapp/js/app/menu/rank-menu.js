"use strict";
/* global main */

function RankMenu() {
  this.element = document.getElementById("rank");
  
  this.bar = document.getElementById("rank-bar");
  this.life = document.getElementById("rank-life");
  this.rank = document.getElementById("rank-rank");
  
  this.displayLifeCredits = 0;
  this.displayRank = undefined;
};

RankMenu.prototype.show = function() {
  this.element.style.display = "block";
  if(!this.displayRank) { this.displayRank = main.stats.globalCount; }
  
  this.update();
};

RankMenu.prototype.update = function() {
  this.displayLifeCredits += (main.stats.lifeCredits - this.displayLifeCredits) * 0.03;
  this.displayRank += (main.stats.rank - this.displayRank) * 0.03;
  
  if(this.displayRank - 0.00001 > main.stats.rank || this.displayLifeCredits + 0.1 < main.stats.lifeCredits) {
    var parent = this;
    setTimeout(function() { parent.update(); }, 16);
  }
  else {
    this.displayLifeCredits = main.stats.lifeCredits;
    this.displayRank = main.stats.rank;
  }
  this.bar.style.width = ((1.0-((this.displayRank-1)/(main.stats.globalCount-1)))*100.0) + "%";
  this.life.innerHTML = Math.ceil(this.displayLifeCredits);
  this.rank.innerHTML = "Rank #" + Math.floor(this.displayRank);
};

RankMenu.prototype.hide = function() {
  this.element.style.display = "none";
};