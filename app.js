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
let overtime_div      = document.getElementById('overtime');
let overtimePanel_div = document.getElementById('overtime-panel');
let beep_div          = document.getElementById('beep');

let timerType     = '';
let timerLabel    = '';
let timeLeftMin   = 0;
let timeLeftSec   = 0;
let overtimeMin   = 0;
let overtimeSec   = 0;

let counting = false;

var x = null;

// Update settings
function updateValue(type,increment){
  settings[type].length = Math.min(Math.max(settings[type].length+increment,1),60);
  $(settings[type].length_div).text(settings[type].length);
  if (timerType==type){
    changeSession(type)
  }
}

// Counting
function countDown(){
  if (timeLeftSec == 0 && timeLeftMin==0){
    resetValue();
  } else {
    counting = !counting
    beep_div.pause();
    beep_div.currentTime = 0;
    clearOverTime();
    $('#overtime-panel').hide();

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
      stopCounting();
    }
  }
}

function countOvertime(){
  $('#overtime-panel').fadeToggle(500);
  $('#save-overtime').hide();
  x = setInterval(function(){
    overtimeSec += 1;
    if (overtimeSec >60){
      overtimeMin += 1;
      overtimeSec -= 60;
    }
    changeOvertimeText();
  },1000);
}

function timeUp(){
  beep_div.play();
  updateRecord(settings[timerType].length,timerType,true);
  countOvertime();
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

// Change texts
function changeOvertimeText(){
  let overtime = '+'+('0'+overtimeMin).slice(-2)+':'+('0'+overtimeSec).slice(-2)
  $(overtime_div).text(overtime);
}

function changeTimeLeftText(){
  let timeLeft = ('0'+timeLeftMin).slice(-2)+':'+('0'+timeLeftSec).slice(-2)
  $(timeLeft_div).text(timeLeft);
}

// Update records
function updateRecord(timePassedMin,type,addCount){
  if (addCount){
    records[type].count += 1;
  }
  records[type].duration += timePassedMin
  console.log(type,records[type])
}

function updateOvertimeRecord(timePassedMin,type){
  updateRecord(overtimeMin,type,timerType!==type);
  stopCounting();
  $('#overtime-panel').fadeToggle(500);
  setTimeout(function(){ clearOverTime() },500);
}

// Resetting
function clearOverTime(){
  overtimeMin = 0;
  overtimeSec = 0;
  changeOvertimeText();
}

function resetValue(){
  beep_div.pause();
  beep_div.currentTime = 0;
  stopCounting();
  changeSession(timerType);
  //clearOverTime();
}

function stopCounting(){
  if ($('#overtime-panel').is(':visible')){
    $('#save-overtime').fadeToggle(500);
  }
  if (counting){
    counting = !counting;
    $(startStop_div).text('Start');
    clearInterval(x);
  }
}

function main(){
  $('#overtime-panel').hide();
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
  $('#to-session').click(function(){
    updateOvertimeRecord(overtimeMin,'session');
  });
  $('#to-sbreak').click(function(){
    updateOvertimeRecord(overtimeMin,'shortBreak');
  });
  $('#to-lbreak').click(function(){
    updateOvertimeRecord(overtimeMin,'longBreak');
  });
}

main();
