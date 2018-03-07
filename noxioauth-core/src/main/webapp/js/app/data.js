"use strict";
/* global main */

/* This class contains all user data, such as unlocks and credits */
/* These are read only */

function UserData() {
  this.downloadUserData();
}

UserData.prototype.defaults = function() {

};

// Gets saved user settings from server
UserData.prototype.downloadUserData = function() {
  // @TODO: EYYYYYYYYYYYYyyy
};