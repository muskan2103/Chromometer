chrome.action.onClicked.addListener((tab) => {
chrome.tabs.create({ url: chrome.runtime.getURL('controller.html') });
});

function reset() {
  const freq = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const prev = midnight.getTime();
  const now = Date.now();
  const index = new Date().getDay();

  chrome.storage.local.get('Reset', (result) => {
      const lastResetTime = result.Reset || -1;
      if (lastResetTime === -1 || (now - lastResetTime) > freq) {
          chrome.storage.local.set({ 'Reset': prev });
          chrome.storage.local.get(['dataset', 'tasks','Toblock'], (data) => {
              const odata = data.dataset || [{},{},{},{},{},{},{}];
              odata[index] = {};
              chrome.storage.local.set({ 'dataset': odata });
              chrome.storage.local.set({ 'tasks': [] });
              chrome.storage.local.set({ 'Toblock': [] });
          });
      }
  });
}

setInterval(reset, 1000); // Set the interval to call reset every second

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
      case 'addTimeSpent':
          const domain = message.domain;
          const timespent = message.timespent;
          const index = new Date().getDay();

          chrome.storage.local.get('dataset', (result) => {
              const dataset = result.dataset;

              if (!dataset[index].hasOwnProperty(domain)) {
                  dataset[index][domain] = 0;
              }
              dataset[index][domain] += timespent;
              chrome.storage.local.set({ 'dataset': dataset });
          });
          return true;

      case 'getData':
          chrome.storage.local.get('dataset', (result) => {
              const data = result.dataset;
              sendResponse({ data });
          });
          return true;

      case 'addTasks':
          const task = message.task;
          chrome.storage.local.get('tasks', (result) => {
              const tasks = result.tasks;
              tasks.push(task);

              chrome.storage.local.set({ 'tasks': tasks }, () => {
                  sendResponse({ status: 'success' });
              });
          });
          return true;

      case 'getTasks':
          chrome.storage.local.get('tasks', (result) => {
              const tasks = result.tasks;
              sendResponse({ tasks });
          });
          return true;

      case 'statusChange':
          const Task = message.task;
          chrome.storage.local.get('tasks', (result) => {
              const tasks = result.tasks;
              tasks.forEach(task => {
                  if (task.Name === Task.Name) {
                      task.Status = task.Status === 'pending' ? 'completed' : 'pending';
                  }
              });
              chrome.storage.local.set({ 'tasks': tasks }, () => {
                  if (chrome.runtime.lastError) {
                      sendResponse({ status: 'failure', error: chrome.runtime.lastError });
                  } else {
                      sendResponse({ status: 'success' });
                  }
              });
          });
          return true;

      case 'getBlockedsites':
        chrome.storage.local.get('Toblock', (result) => {
          const Toblocksites = result.Toblock;
          sendResponse({ Toblocksites });
        });
        return true;

        case 'addToblock':
          const addsite = message.site;
          chrome.storage.local.get('Toblock', (result) => {
              let blockedsites = result.Toblock
      
              if (!blockedsites.includes(addsite)) {
                  blockedsites.push(addsite);
                  chrome.storage.local.set({ 'Toblock': blockedsites }, () => {
                      sendResponse({ status: 'success' });
                  });
              } else {
                  sendResponse({ status: 'already_exists' });
              }
          });
          return true;

      default:
          console.log('message',message.action);
          sendResponse({ status: 'unknown action' });
          return false;
  }
});
