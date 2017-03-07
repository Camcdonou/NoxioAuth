"use strict";
/* global main */
/* global Display */

/* Converts string to an array of indices pointing to charcters in a font bitmap */
Display.prototype.stringToIndices = function(string) {
  var ary = [];
  for(var i=0;i<string.length;i++) {
    switch(string[i]) {
      case " " : { ary.push(0); break; }
      case "!" : { ary.push(1); break; }
      case "\"" : { ary.push(2); break; }
      case "#" : { ary.push(3); break; }
      case "$" : { ary.push(4); break; }
      case "%" : { ary.push(5); break; }
      case "&" : { ary.push(6); break; }
      case "'" : { ary.push(7); break; }
      case "(" : { ary.push(8); break; }
      case ")" : { ary.push(9); break; }
      case "*" : { ary.push(10); break; }
      case "+" : { ary.push(11); break; }
      case "," : { ary.push(12); break; }
      case "-" : { ary.push(13); break; }
      case "." : { ary.push(14); break; }
      case "/" : { ary.push(15); break; }
      case "0" : { ary.push(16); break; }
      case "1" : { ary.push(17); break; }
      case "2" : { ary.push(18); break; }
      case "3" : { ary.push(19); break; }
      case "4" : { ary.push(20); break; }
      case "5" : { ary.push(21); break; }
      case "6" : { ary.push(22); break; }
      case "7" : { ary.push(23); break; }
      case "8" : { ary.push(24); break; }
      case "9" : { ary.push(25); break; }
      case ":" : { ary.push(26); break; }
      case ";" : { ary.push(27); break; }
      case "<" : { ary.push(28); break; }
      case "=" : { ary.push(29); break; }
      case ">" : { ary.push(30); break; }
      case "?" : { ary.push(31); break; }
      case "@" : { ary.push(32); break; }
      case "A" : { ary.push(33); break; }
      case "B" : { ary.push(34); break; }
      case "C" : { ary.push(35); break; }
      case "D" : { ary.push(36); break; }
      case "E" : { ary.push(37); break; }
      case "F" : { ary.push(38); break; }
      case "G" : { ary.push(39); break; }
      case "H" : { ary.push(40); break; }
      case "I" : { ary.push(41); break; }
      case "J" : { ary.push(42); break; }
      case "K" : { ary.push(43); break; }
      case "L" : { ary.push(44); break; }
      case "M" : { ary.push(45); break; }
      case "N" : { ary.push(46); break; }
      case "O" : { ary.push(47); break; }
      case "P" : { ary.push(48); break; }
      case "Q" : { ary.push(49); break; }
      case "R" : { ary.push(50); break; }
      case "S" : { ary.push(51); break; }
      case "T" : { ary.push(52); break; }
      case "U" : { ary.push(53); break; }
      case "V" : { ary.push(54); break; }
      case "W" : { ary.push(55); break; }
      case "X" : { ary.push(56); break; }
      case "Y" : { ary.push(57); break; }
      case "Z" : { ary.push(58); break; }
      case "[" : { ary.push(59); break; }
      case "₩" : { ary.push(60); break; }
      case "]" : { ary.push(61); break; }
      case "^" : { ary.push(62); break; }
      case "_" : { ary.push(63); break; }
      case "`" : { ary.push(64); break; }
      case "a" : { ary.push(65); break; }
      case "b" : { ary.push(66); break; }
      case "c" : { ary.push(67); break; }
      case "d" : { ary.push(68); break; }
      case "e" : { ary.push(69); break; }
      case "f" : { ary.push(70); break; }
      case "g" : { ary.push(71); break; }
      case "h" : { ary.push(72); break; }
      case "i" : { ary.push(73); break; }
      case "j" : { ary.push(74); break; }
      case "k" : { ary.push(75); break; }
      case "l" : { ary.push(76); break; }
      case "m" : { ary.push(77); break; }
      case "n" : { ary.push(78); break; }
      case "o" : { ary.push(79); break; }
      case "p" : { ary.push(80); break; }
      case "q" : { ary.push(81); break; }
      case "r" : { ary.push(82); break; }
      case "s" : { ary.push(83); break; }
      case "t" : { ary.push(84); break; }
      case "u" : { ary.push(85); break; }
      case "v" : { ary.push(86); break; }
      case "w" : { ary.push(87); break; }
      case "x" : { ary.push(88); break; }
      case "y" : { ary.push(89); break; }
      case "z" : { ary.push(90); break; }
      case "{" : { ary.push(91); break; }
      case "|" : { ary.push(92); break; }
      case "}" : { ary.push(93); break; }
      case "~" : { ary.push(94); break; }
      default : { ary.push(95); break; }
    }
  }
  return ary;
};