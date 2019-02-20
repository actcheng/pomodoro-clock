$(document).ready(function() {

});

let settings = {
  session: {
    length_div : document.getElementById('session-length'),
    lengthDefault: 25,
    length: 25,
    text: 'Productivity Time'
  },
  shortBreak: {
    length_div : document.getElementById('sbreak-length'),
    lengthDefault: 5,
    length: 5,
    text: 'Short Break'
  },
  longBreak: {
    length_div : document.getElementById('lbreak-length'),
    lengthDefault: 15,
    length: 15,
    text: 'Long Break'
  },
}

let records = {
  session: {
    count: 0,
    duration: 0
  },
  shortBreak: {
    count: 0,
    duration: 0
  },
  longBreak: {
    count: 0,
    duration: 0
  }
}

let startStop_div     = document.getElementById('start_stop');
let timerLabel_div    = document.getElementById('timer-label');
let timeLeft_div      = document.getElementById('time-left');
let beep_div          = document.getElementById('beep');

let timerType     = '';
let timerLabel    = '';
let timeLeftMin   = 0;
let timeLeftSec   = 0;

let counting = false;

var x = null;

function countDown(){
  if (timeLeftSec == 0 && timeLeftMin==0){
    resetValue();
  } else {
    counting = !counting
    beep_div.pause();
    beep_div.currentTime = 0;

    if (counting){
      $(startStop_div).text('Stop');
      x = setInterval(function(){
        timeLeftSec -= 1;
        if (timeLeftSec<0){
          if (timeLeftMin>0){
            timeLeftMin -= 1;
            timeLeftSec += 60;
          } else {
            timeLeftSec = 0;
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
}

function changeTimeLeftText(){
  let timeLeft = ('0'+timeLeftMin).slice(-2)+':'+('0'+timeLeftSec).slice(-2)
  $(timeLeft_div).text(timeLeft);
}

function updateRecord(timePassed){
  records[timerType].count += 1;
  records[timerType].duration += timePassed;
  console.log(timerType,records[timerType])
}

function timeUp(){
  beep_div.play();
  updateRecord(settings[timerType].length);
}

function changeSession(type){
  if (counting){
    countDown();
  }
  timerLabel = settings[type].text;
  timeLeftMin = settings[type].length;
  timeLeftSec = 0;
  changeTimeLeftText();
  $(timerLabel_div).text(timerLabel);
  timerType = type;
}

function updateValue(type,increment){
  settings[type].length = Math.min(Math.max(settings[type].length+increment,1),60);
  $(settings[type].length_div).text(settings[type].length);
  if (timerType==type){
    changeSession(type)
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
  timeLeftMin = settings[timerType].length;
  timeLeftSec = 0;
  changeTimeLeftText();
}

function main(){
  changeSession('session');
  updateValue('session',0);
  updateValue('shortBreak',0);
  updateValue('longBreak',0);
  $('#session-increment').click(function(){
    updateValue('session',1);
  });
  $('#session-decrement').click(function(){
    updateValue('session',-1);
  });
  $('#sbreak-increment').click(function(){
    updateValue('shortBreak',1);
  });
  $('#sbreak-decrement').click(function(){
    updateValue('shortBreak',-1);
  });
  $('#lbreak-increment').click(function(){
    updateValue('longBreak',1);
  });
  $('#lbreak-decrement').click(function(){
    updateValue('longBreak',-1);
  });
  $('#start_stop').click(function(){
    countDown();
  });
  $('#reset').click(function(){
    resetValue();
  });
  $('#session-label').click(function(){
    changeSession('session');
    countDown();
  });
  $('#sbreak-label').click(function(){
    changeSession('shortBreak');
    countDown();
  });
  $('#lbreak-label').click(function(){
    changeSession('longBreak');
    countDown();
  });
}

main();
