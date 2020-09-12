// ==UserScript==
// @name        TM League Match History
// @version     0.3 <2020-12-09>
// @author      Maycon Miranda - https://github.com/mayc0njr
// @description Adds last match results and link to the matchs in the league table.
// @namespace   https://trophymanager.com
// @include     https://trophymanager.com/league/
// @license     MIT
// ==/UserScript==

(function () {

    const columnAdjustment = 50;
    const CIRCLE = '\u2b24';
    const WIN_COLOR = '#00ff00';
    const DRAW_COLOR = '#bfbfbf';
    const LOSE_COLOR = '#ff0000';
    const LAST_MATCHES = 5;
    const LAST_HEADER = "Últimos";
    //==================================================
    const COUNTRY = 0;
    const DIVISION = 1;
    const GROUP = 2;
    const FIXTURES = '/ajax/fixtures.ajax.php';
    const WIN = 'W';
    const DRAW = 'D';
    const LOSE = 'L';

    function adjustSize(width) {
        let adjust = $('.column2_a').width() + width;
        $('.column2_a').width(adjust);
        adjust = $('.main_center').width() + width;
        $('.main_center').width(adjust);
    }

    function addTableHeader() {
        let header = $('#overall_table thead tr');
        let streak = document.createElement('TH');
        streak.textContent = LAST_HEADER;
        $(streak).addClass('align_center');
        $(streak).addClass('header');

        header.append(streak);
    }

    function generateMatchsHistory() {
        let url = $('.content_menu .calendar').attr('href').split(`/`).filter(function (el) {
            return el.length > 0
        });
        console.log(url);
        while (url.length > 3)
            url.shift();
        $.post(FIXTURES,{'type':'league','var1':url[COUNTRY],'var2':url[DIVISION],'var3':url[GROUP]},function(data){
        if(data != null)
        {
            applyResults(data);
        }
    },'json');
    }

    function adjustHighlight(row) {
        row.children().last().removeClass('highlight_td_right');
    }
    function adjustBorder(cell) {
        cell.removeClass('highlight_td_right_std');
        cell.addClass('border_right');
    }
    function filterFixtures(data) {
        let months = [];
        let matches = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                months.push(data[key]);
            }
        }
        for (let index = 0; index < months.length; index++) {
            const thisMonth = months[index];
            matches = matches.concat(thisMonth.matches.filter(function testUnPlayed(match) {
                return match.result != null;
            }));
        }
        return matches;
    }
    function getTeamResults(matches, team) {
        let results = [];
        for(let index = matches.length-1; index >= 0 && results.length < LAST_MATCHES; index--) {
            const match = matches[index];
            let score = match.result.split('-');
            score[0] = parseInt(score[0]);
            score[1] = parseInt(score[1]);
            let result = {};
            result.tooltip = match.hometeam_name + ' ' + match.result + ' ' + match.awayteam_name;
            let teamScore;
            let advScore;
            result.matchLink = $(match.match_link).attr('href');
            if(match.hometeam_name == team) {
                teamScore = 0;
                advScore = 1;
            }
            else if(match.awayteam_name == team) {
                teamScore = 1;
                advScore = 0;
            } else
                continue;
            if(score[teamScore] > score[advScore])
                result.result = WIN;
            else if(score[teamScore] < score[advScore])
                result.result = LOSE;
            else
                result.result = DRAW;
            results.splice(0,0,result);
        }
        return results;
    }

    function applyResults(data) {
        let fixtures = filterFixtures(data);
        let teams = $('#overall_table tbody td a');
        teams.each(function(index, team) {
            if(team.text.length == 0)
                return;
            let row = team.parentElement.parentElement;
            adjustBorder($(row).children().last());
            if($(row).children().first().hasClass('highlight_td')) {
                adjustHighlight($(row));
            }
            let streak = row.insertCell(-1);
            let results = getTeamResults(fixtures, team.textContent);
            $(streak).addClass('cell_padding');
            $(streak).addClass('highlight_td_right_std');
            $(streak).css('display', 'flex');
            $(streak).css('justify-content','space-between');
            $(streak).css('cursor', 'default');
            $(streak).disableSelection();
            for (const result of results) {
                let res = document.createElement('A');
                res.textContent = CIRCLE;
                $(res).attr('href', result.matchLink);
                $(res).attr('title', result.tooltip);
                switch (result.result) {
                    case WIN:
                        $(res).css('color', WIN_COLOR);
                        break;
                    case DRAW:
                        $(res).css('color', DRAW_COLOR);
                        break;
                    case LOSE:
                        $(res).css('color', LOSE_COLOR);
                        break;
                    default:
                        break;
                }
                streak.appendChild(res);
            }
            if($(row).children().first().hasClass('highlight_td')) {
                $(streak).removeClass('highlight_td_right_std');
                $(streak).addClass('highlight_td_right');
                $(streak).addClass('highlight_td');
            }
        });
        adjustSize(columnAdjustment);
        addTableHeader();
    }
    generateMatchsHistory();
})();