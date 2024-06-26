chrome.runtime.sendMessage({action: 'getBlockedsites'},function(response){
  const Toblocksites=response.Toblocksites;
  Toblocksites.forEach(site=>{
    if (window.location.href.includes(site)) {
      window.location.href = 'about:blank';
    }
  });
});

function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let secs = Math.floor(seconds % 60);

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  secs = String(secs).padStart(2, '0');

  return `${hours}:${minutes}:${secs}`;
}

let clockDiv = document.createElement('div');
clockDiv.id = 'Timer';
clockDiv.style.position = 'fixed';
clockDiv.style.bottom = '10px';
clockDiv.style.right = '10px';
clockDiv.style.padding = '5px 10px';
document.body.appendChild(clockDiv);

const domain = window.location.hostname;
let startTime=new Date();
let timespent = 0;

let intervalId;
function startTimer() {
  startTime = new Date();
  intervalId = setInterval(() => {
    let currentTime = new Date();
    timespent += (currentTime - startTime) / 1000;
    startTime = currentTime;
    clockDiv.innerHTML = `<span>🕒 ${formatTime(timespent)}<span/>`;
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

const sendTimeSpentToBackground = (domain,timespent) => {
    chrome.runtime.sendMessage({ action: 'addTimeSpent', domain: domain, timespent: timespent });
  };

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopTimer();
  } else {
    startTimer();
  }
});

window.addEventListener('beforeunload', () => {
    sendTimeSpentToBackground(domain,timespent);
});

startTimer();