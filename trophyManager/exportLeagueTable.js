// ==UserScript==
// @name        TM Export League Table as CSV
// @name:pt     TM Exportar Tabela da liga como CSV.
// @namespace   Violentmonkey Scripts
// @match       https://trophymanager.com/league/
// @grant       none
// @version     1.0
// @author      -
// @description 21/07/2021 12:55:09
// ==/UserScript==

(function() {
    'use strict';

    // $(".container-fluid").prepend("<button id='exportcsv'>Export</button>");
    $("#overall_table").parent().parent().parent().append("<button id='exportcsv'>Baixar Tabela</button>");
  
    $('#exportcsv').click(function() {
    let titles = [];
    let data = [];
    let bTeam = /\s+(B)/

    /*
     * Get the table headers, this will be CSV headers
     * The count of headers will be CSV string separator
     */
    $('#overall_table th').each(function() {
      let text = $(this).text().trim();
      let colspan = $(this).attr("colspan")
      if(colspan && colspan > 1) {
        for (let i = 1; i < colspan; i++) {
          titles.push(text);
        }
      }
      titles.push(text);

    });

    /*
     * Get the actual data, this will contain all the data, in 1 array
     */
    $('#overall_table td').each(function() {
      let text = $(this).text().trim();
      let isBteam = bTeam.test(text);
      if(isBteam) {
        text = text.replace(bTeam, " [$1]");
      }
      data.push(text);
    });

    /*
     * Convert our data to CSV string
     */
    var CSVString = prepCSVRow(titles, titles.length, '');
    CSVString = prepCSVRow(data, titles.length, CSVString);

    /*
     * Make CSV downloadable
     */
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", CSVString]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";

    /*
     * Actually download CSV
     */
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });

     /*
  * Convert data array to CSV string
  * @param arr {Array} - the actual data
  * @param columnCount {Number} - the amount to split the data into columns
  * @param initial {String} - initial string to append to CSV string
  * return {String} - ready CSV string
  */
  function prepCSVRow(arr, columnCount, initial) {
    let docNumber = /(\d{25})/;
    let replaceDoc = '="$1"';
    var row = ''; // this will hold data
    var delimeter = ';'; // data slice separator, in excel it's `;`, in usual CSv it's `,`
    var newLine = '\r\n'; // newline separator for CSV row
    let valueString = /(\d+)\.(\d+)/;
    let replaceValue = '$1,$2';

    /*
     * Convert [1,2,3,4] into [[1,2], [3,4]] while count is 2
     * @param _arr {Array} - the actual array to split
     * @param _count {Number} - the amount to split
     * return {Array} - splitted array
     */
    function splitArray(_arr, _count) {
      var splitted = [];
      var result = [];
      _arr.forEach(function(item, idx) {
        if ((idx + 1) % _count === 0) {
          splitted.push(item);
          result.push(splitted);
          splitted = [];
        } else {
          splitted.push(item);
        }
      });
      return result;
    }
    var plainArr = splitArray(arr, columnCount);
    // it converts `['a', 'b', 'c']` to `a,b,c` string
    plainArr.forEach(function(arrItem) {
      arrItem.forEach(function(item, idx) {
        item = item.replace(docNumber, replaceDoc);
        item = item.replace(valueString, replaceValue);
        row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
      });
      row += newLine;
    });
    return initial + row;
  }
})();