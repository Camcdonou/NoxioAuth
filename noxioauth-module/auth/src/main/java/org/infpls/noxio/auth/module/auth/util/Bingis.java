package org.infpls.noxio.auth.module.auth.util;

import java.util.*;

/* This class exists to contain a list of display names for guest users. */
/* Names are chosen at random */
public class Bingis {
  private final static List<String> NAMES = Arrays.asList(new String[] {
    "Mingebag",
    "Meatgazer",
    "Scrote",
    "Bingis",
    "Dodongo",
    "Oven Smuggler",
    "Dildad",
    "Bungus",
    "Grabnar",
    "Turtle Toucher",
    "Doingus",
    "Egg Vermifuge",
    "Tarbuncler",
    "Neo Masamune",
    "Total Chad",
    "Grigis",
    "Bibber",
    "Binch",
    "Gangly",
    "Sand Bucket",
    "Lucatiel",
    "HowToBasic",
    "Dark Souls III",
    "DROP TABLE USERS"
  });
  
  public final static String get() {
    return NAMES.get((int)(Math.random()*NAMES.size()));
  }
}
