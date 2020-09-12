// ==UserScript==
// @name        Highlight Next oponent
// @namespace   MMs
// @match       https://trophymanager.com/league/
// @grant       none
// @version     1.0
// @author      -
// @description 01/09/2020 21:28:34
// ==/UserScript==
$(function() {
    var borderColor = '#ffffff';
    // var borderColor = '#cc3300';
    var club = $('.top_user_info.main_center .clubs_block').text().trim();
    var nextGame = $("#next_round_table .highlighted_row_done").text();
    var game = nextGame.split('-');
    var team = '';
    var home =  '';
    if(game[0].includes(club)) {
      home = '[CASA]';
      team = game[1].trim();
    } else {
      home = '[FORA]';
      team = game[0].trim();
    }
    home = ' <b>' + home + '</b>';
  
    var row = $("#overall_table tbody td:contains('"+team+"')").parent();
    var teamRow = $("#overall_table tbody td a:contains('"+team+"')");
    teamRow.html(team + home);
    row.children().each(function(index) {
                          $(this).addClass('highlight_td');
                          $(this).attr('style','border-top-color: ' + borderColor + ' !important; border-bottom-color: ' + borderColor + ' !important');
                        });
  
    row.children().first().addClass('highlight_td_left');
    row.children().first().attr('style','border-top-color: ' + borderColor + ' !important; border-bottom-color: ' + borderColor + ' !important; border-left-color: ' + borderColor + ' !important');
    row.children().last().addClass('highlight_td_right');
    row.children().last().attr('style','border-top-color: ' + borderColor + ' !important; border-bottom-color: ' + borderColor + ' !important; border-right-color: ' + borderColor + ' !important');
  });