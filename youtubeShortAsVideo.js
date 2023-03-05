// ==UserScript==
// @name        Open Shorts as a normal video
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/shorts/*
// @grant       none
// @version     2023-02-23
// @author      https://github.com/mayc0njr
// @description Adds a Button on the header of a Youtube #Shorts Video Page to open the video as a normal youtube video.
// ==/UserScript==


(function() {
    'use strict';
  
    async function createButton() {
      const buttons = document.getElementById("buttons");
      console.log("[OPEN_AS_VIDEO] Trying to get buttons div!!!");
      if(!buttons || !buttons.children.length) {
        setTimeout(() => { createButton(); }, 3000);
        if(buttons)
          console.log("[OPEN_AS_VIDEO] - no loaded children for div buttons yet", buttons.children);
        else
          console.log("[OPEN_AS_VIDEO] - div buttons wasnt loaded yet", buttons);
        return;
      }
      console.log("[OPEN_AS_VIDEO] Creating buttons!!!");
      const url = window.location.href.split('/').at(-1);
      const div = document.createElement('a');
      div.href=`https://www.youtube.com/watch?v=${url}`;
      div.id = "openAsVideoItem"
      const icon = "data:image/png;base64, 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";
      div.innerHTML = `<div style="border-radius: 100px; border: solid 2px white; height: 28px; width: 28px; margin-right: 8px; display: flex; align-items: center; justify-content: center"><img src="${icon}" style="max-height: 50%; max-width: 50%;"></div>`
  
      buttons.prepend(div);
      // document.getElementById("buttons").prepend(`<form action="https://www.youtube.com/watch?v=${url}"><input type="submit" value="Open as Video" /></form>`);
      // window.location.href = `https://www.youtube.com/watch?v=${url}`;
      console.log("[OPEN_AS_VIDEO] Button created!!!");
    }
  
  window.addEventListener('load', async function () {
    console.log("[OPEN_AS_VIDEO] LOADED.");
        await createButton();
  })
  
  })();