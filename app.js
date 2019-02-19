$(document).ready(function() {

});

let body              = document.body;
let startStop_div     = document.getElementById('start_stop');
let timerLabel_div    = document.getElementById('timer-label');
let timeLeft_div      = document.getElementById('time-left');
let sessionLength_div = document.getElementById('session-length');
let breakLength_div   = document.getElementById('break-length');
let beep_div          = document.getElementById('beep');

let sessionLengthDefault = 25;
let breakLengthDefault = 5;

let sessionText = 'Session';
let breakText = 'Break';

let timerLabel = sessionText;
let sessionLength = sessionLengthDefault;
let breakLength = breakLengthDefault;
let timeLeftMin = sessionLength;
let timeLeftSec = 0;

let counting = false;
let playing  = false;
let i = 1;

var x = null;

function countDown(){

  counting = !counting
  if (counting){
    $(startStop_div).text('Stop');
    x = setInterval(function(){
      timeLeftSec -= 1;
      if (timeLeftSec<0){
        if (timeLeftMin>0){
          timeLeftMin -= 1;
          timeLeftSec += 60;
        } else {
          clearInterval(x);
          timeUp();
        }
      }
      changeTimeLeftText();
    },1000);
  } else {
    $(startStop_div).text('Start');
    clearInterval(x);
  }
}

function changeTimeLeftText(){
  let timeLeft = ('0'+timeLeftMin).slice(-2)+':'+('0'+timeLeftSec).slice(-2)
  $(timeLeft_div).text(timeLeft);
}

function timeUp(){
  beep_div.play();
  if (timerLabel===sessionText){
    changeSession(breakText);
  } else {
    changeSession(sessionText);
  }
  counting = !counting;
  countDown();
}

function changeSession(type){
  if (type===sessionText){
    timerLabel = sessionText;
    timeLeftMin = sessionLength;
    timeLeftSec = 0;
    changeTimeLeftText();
  } else { // break
    timerLabel = breakText;
    timeLeftMin = breakLength;
    timeLeftSec = 0;
    changeTimeLeftText();
  }
  $(timerLabel_div).text(timerLabel);
}

function updateValue(type,increment){
  if (type===sessionText){
    sessionLength = Math.min(Math.max(sessionLength+increment,1),60);
    $(sessionLength_div).text(sessionLength);
    if (timerLabel==sessionText){
      changeSession(type)
    }
  } else {
    breakLength = Math.min(Math.max(breakLength+increment,1),60);
    $(breakLength_div).text(breakLength);
    if (timerLabel==breakText){
      changeSession(type)
    }
  }
}

function resetValue(){
  beep_div.pause();
  beep_div.currentTime = 0;
  if (counting){
    counting = !counting;
    $(startStop_div).text('Start');
    clearInterval(x);
  }
  sessionLength = sessionLengthDefault;
  breakLength = breakLengthDefault;
  timeLeftMin = sessionLength;
  timeLeftSec = 0;

  $(sessionLength_div).text(sessionLength);
  $(breakLength_div).text(breakLength);
  changeTimeLeftText();
  changeSession(sessionText);
}

function main(){
  changeSession(sessionText);
  updateValue(sessionText,0);
  updateValue(breakText,0);
  $('#session-increment').click(function(){
    updateValue(sessionText,1);
  });
  $('#session-decrement').click(function(){
    updateValue(sessionText,-1);
  });
  $('#break-increment').click(function(){
    updateValue(breakText,1);
  });
  $('#break-decrement').click(function(){
    updateValue(breakText,-1);
  });
  $('#start_stop').click(function(){
    countDown();
  });
  $('#reset').click(function(){
    resetValue();
  });
  $('#session-label').click(function(){
    changeSession(sessionText);
  });
  $('#break-label').click(function(){
    changeSession(breakText);
  });
}

main();
