// ==UserScript==
// @name        Free Tactics Filter
// @namespace   MMs
// @match       https://trophymanager.com/tactics/
// @grant       none
// @version     1.0
// @author      Maycon Miranda
// @description 28/08/2020 19:36:11
// ==/UserScript==

var getPro = '/buy-pro/';
$('a[href]='+getPro).removeAttr('tooltip');
$('a[href]='+getPro).removeAttr('href');