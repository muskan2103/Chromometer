function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let secs = Math.floor(seconds % 60);

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  secs = String(secs).padStart(2, '0');

  return `${hours}h ${minutes}m ${secs}s`;
}

var percentages=[];
var Labels=[];
var bgcolors=[];
const MySites=['www.netflix.com','leetcode.com','www.geeksforgeeks.org','www.youtube.com'];

function drawPieChart(data, labels, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  canvas.width=150;
  canvas.height=150;
  const total = 100;
  let startAngle = 0;
  let endAngle = 0;

  for (let i = 0; i < data.length; i++) {
      const sliceAngle = (2 * Math.PI * data[i]) / total;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, startAngle, startAngle + sliceAngle);
      ctx.fillStyle = bgcolors[i]; // Function to get random color
      ctx.fill();

      startAngle += sliceAngle;
  }

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    const centertext = document.createElement('span');
    centertext.textContent = `${percentages[0].toFixed(2)}`+'%';
    centertext.style.position = 'absolute';
    centertext.style.top = `${canvas.offsetTop + (canvas.height / 2) - 10}px`; // Adjust position as needed
    centertext.style.left = `${canvas.offsetLeft + (canvas.width / 2) - 30}px`; // Adjust position as needed
    centertext.style.fontSize = '15px';
    centertext.style.fontWeight = 'bold';
    centertext.style.color = 'black';
    canvas.parentNode.appendChild(centertext);

    const site = document.createElement('span');
    site.textContent = Labels[0];
    site.style.position = 'absolute';
    site.style.top = `${canvas.offsetTop + (canvas.height / 2)+5}px`; // Adjust position as needed
    site.style.left = `${canvas.offsetLeft + (canvas.width / 2)-35}px`; // Adjust position as needed
    site.style.fontSize = '10px';
    site.style.color = 'black';
    canvas.parentNode.appendChild(site);
}

function calculatePercentage(time,totalTime) {
  return ((time / totalTime) * 100);
}

function getTotalTimeSpent(Arr) {
  let total=0;
  Arr.forEach(([domain,time])=>{
    total=total+time;
  });
  console.log(total);
  return total;
}

function getTotalTimeSpentInWeek(oData) {
  let total = 0;
  
  oData.forEach(day => {
    total += Object.values(day).reduce((dayTotal, time) => dayTotal + time, 0);
  });

  return total;
}

function sortDomainsByTimeSpent(index, oData) {
  return Object.entries(oData[index]).sort((a, b) => b[1] - a[1]);
}

function getTimeSpentperDomain(domain, oData) {
  var timespent = [];
  
  oData.forEach(day => {
    if (day.hasOwnProperty(domain)) {
      timespent.push(day[domain]);
    } else {
      timespent.push(0);
    }
  });

  return timespent;
}

function getTotalTimeperDomain(timespent) {
  return timespent.reduce((total, current) => total + current, 0);
}

function CreateTodayTable(Arr, index,oData) {
  // Create the table element
  const table = document.createElement('table');
  table.className = 'datatable js-datatable-day__table';
  table.id = 'table-day';
  table.setAttribute('data-range', 'day');
  table.addEventListener('click', function(event) {
      const row = event.target.parentNode;
      const name = row.cells[1].textContent;
      const percentage = row.getAttribute('data-percentage-string');
      const time = row.querySelector('.time').textContent;
      document.getElementById('box2').innerHTML = `<h1>${name}</h1>`;
      MyPrepInfo(oData,[name]);
      getBarGraphs([name],oData);
      console.log(`Clicked row data - Name: ${name}, Percentage: ${percentage}, Time: ${time}`);
  });

  // Create the table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('td');
  headerCell.colSpan = 4;
  
  const day=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  headerCell.textContent = new Date;
  headerRow.appendChild(headerCell);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create the table body
  const tbody = document.createElement('tbody');

  // Iterate over each domain's data
  Arr.forEach(([domain, time]) => {
    const row = document.createElement('tr');
    row.className = 'domain';
    row.setAttribute('data-connect-id', domain);
    row.setAttribute('data-url', domain);
    row.setAttribute('data-percentage-string', calculatePercentage(time, getTotalTimeSpent(Arr)).toFixed(2) + ' %');

    // Label cell
    const labelCell = document.createElement('td');
    labelCell.className = 'label';
    const labelSpan = document.createElement('span');
    const randomHue = Math.floor(Math.random() * 360); // Generate random hue
    bgcolors.push(`hsl(${randomHue}, 100%, 50%)`);
    labelSpan.style.color = `hsl(${randomHue}, 100%, 50%)`; // Set color using HSL
    labelSpan.textContent = '⬤';
    labelCell.appendChild(labelSpan);
    row.appendChild(labelCell);

    // Name cell
    const nameCell = document.createElement('td');
    nameCell.className = 'name';
    nameCell.textContent = domain;
    Labels.push(domain);
    row.appendChild(nameCell);

    // Percentage cell
    const percentageCell = document.createElement('td');
    percentageCell.className = 'percentage';
    let percentage=calculatePercentage(time, getTotalTimeSpent(Arr));
    percentages.push(percentage);
    percentageCell.textContent = percentage.toFixed(2) + ' %';
    row.appendChild(percentageCell);

    // Time cell
    const timeCell = document.createElement('td');
    timeCell.className = 'time';

    const totalMilliseconds = time*1000;
    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);

    const timeHour = document.createElement('span');
    timeHour.className = 'time-hour';
    timeHour.innerHTML = `<span class="digit-tens">${hours >= 10 ? Math.floor(hours / 10) : 0}</span><span class="digit-units">${hours % 10}h</span>`;
    timeCell.appendChild(timeHour);

    const timeMinute = document.createElement('span');
    timeMinute.className = 'time-minute';
    timeMinute.innerHTML = `<span class="digit-tens">${minutes >= 10 ? Math.floor(minutes / 10) : 0}</span><span class="digit-units">${minutes % 10}m</span>`;
    timeCell.appendChild(timeMinute);

    const timeSecond = document.createElement('span');
    timeSecond.className = 'time-second';
    timeSecond.innerHTML = `<span class="digit-tens">${seconds >= 10 ? Math.floor(seconds / 10) : 0}</span><span class="digit-units">${seconds % 10}s</span>`;
    timeCell.appendChild(timeSecond);

    row.appendChild(timeCell);

    tbody.appendChild(row);
  });

  const lineRow = document.createElement('tr');
  const lineCell = document.createElement('td');
  lineCell.colSpan = 4;
  lineCell.style.borderTop = '1px solid black'; // Adjust border style as needed
  lineRow.appendChild(lineCell);
  tbody.appendChild(lineRow);

  const row = document.createElement('tr');
  row.className = 'domain';
  row.setAttribute('data-connect-id', 'Total');
  row.setAttribute('data-url', 'Total');
  row.setAttribute('data-percentage-string', '100' + ' %');

  // Label cell
  const labelCell = document.createElement('td');
  labelCell.className = 'label';
  const labelSpan = document.createElement('span');
  labelSpan.textContent = ' ';
  labelCell.appendChild(labelSpan);
  row.appendChild(labelCell);

  // Name cell
  const nameCell = document.createElement('td');
  nameCell.className = 'name';
  nameCell.textContent = 'Total';
  row.appendChild(nameCell);

  // Percentage cell
  const percentageCell = document.createElement('td');
  percentageCell.className = 'percentage';
  percentageCell.textContent = '100 %';
  row.appendChild(percentageCell);

  // Time cell
  const timeCell = document.createElement('td');
  timeCell.className = 'time';

  const totalMilliseconds = getTotalTimeSpent(Arr)*1000;
  const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);

  const timeHour = document.createElement('span');
  timeHour.className = 'time-hour';
  timeHour.innerHTML = `<span class="digit-tens">${hours >= 10 ? Math.floor(hours / 10) : 0}</span><span class="digit-units">${hours % 10}h</span>`;
  timeCell.appendChild(timeHour);

  const timeMinute = document.createElement('span');
  timeMinute.className = 'time-minute';
  timeMinute.innerHTML = `<span class="digit-tens">${minutes >= 10 ? Math.floor(minutes / 10) : 0}</span><span class="digit-units">${minutes % 10}m</span>`;
  timeCell.appendChild(timeMinute);

  const timeSecond = document.createElement('span');
  timeSecond.className = 'time-second';
  timeSecond.innerHTML = `<span class="digit-tens">${seconds >= 10 ? Math.floor(seconds / 10) : 0}</span><span class="digit-units">${seconds % 10}s</span>`;
  timeCell.appendChild(timeSecond);

  row.appendChild(timeCell);

  tbody.appendChild(row);
  table.appendChild(tbody);

  const box = document.getElementById('data');
  box.appendChild(table);
}


function fetchData() {
      var index=new Date().getDay();
      chrome.runtime.sendMessage({action: 'getData'}, function(response) {
        if (response) {
          let oData = response.data;
          console.log(oData);
          const dayArr=sortDomainsByTimeSpent(index, oData);
          console.log(dayArr);
          CreateTodayTable(dayArr,index,oData);
          console.log(percentages,Labels,bgcolors);
          drawPieChart(percentages, Labels, 'myCanvas');
          MyPrepInfo(oData,MySites);
          getBarGraphs(MySites,oData);
        }
      });
    }

function MyPrepInfo(oData,MySites){
  const box2=document.getElementById('box2');
  const defaultstats=document.createElement('div');
  defaultstats.classList.add('wrapper-center')
    MySites.forEach(site=>{
      DomainArr=getTimeSpentperDomain(site,oData);
      Total=DomainArr.reduce((total, time) => total + time, 0);
      console.log(DomainArr,Total);

      const wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('stats-halves-wrapper');
      const upper=document.createElement('div');
      upper.classList.add('upper');
        
      const siteNameSpan = document.createElement('strong');
      siteNameSpan.setAttribute('title','Days when at least one webpage visited');
      siteNameSpan.textContent = site ;
      upper.appendChild(siteNameSpan);
 
      const timeSpentWeeklyText = document.createElement('span');
      timeSpentWeeklyText.classList.add('days-total');
      timeSpentWeeklyText.textContent = 'Total Activity: ' + formatTime(Total);
      upper.appendChild(timeSpentWeeklyText);

      const dailyaverageText = document.createElement('span');
      dailyaverageText.textContent = 'Daily Average: ' + formatTime(Total/7);
      upper.appendChild(dailyaverageText);

      wrapperDiv.appendChild(upper);
      const Canvas = document.createElement('canvas');
      Canvas.id = site;
      wrapperDiv.appendChild(Canvas);
      defaultstats.append(wrapperDiv);
  });
  box2.append(defaultstats);
}

function getBarGraphs(MySites,oData){
    MySites.forEach(site=>{
      domainArr=getTimeSpentperDomain(site,oData);
      total=domainArr.reduce((total, time) => total + time, 0);
      console.log('arr',domainArr);
      const relative = domainArr.map(value => (value / total) * 100);
      console.log('relative',relative);
      drawBarGraph(relative,site);
    });
}

function drawBarGraph(data,canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set canvas width and height
  canvas.width = 300; // Adjust as per your design requirements
  canvas.height = 80; // Adjust as per your design requirements

  // Calculate bar dimensions
  const barWidth = canvas.width / data.length;
  const maxValue = Math.max(...data);
  const barSpacing = 2; // Adjust spacing between bars

  Labels=['S','M','T','W','T','F','S'];
  // Draw bars
  const randomHue = Math.floor(Math.random() * 360);
  data.forEach((value, index) => {
    ctx.fillStyle = `hsl(${randomHue}, 100%, 50%)`; // Adjust bar color
    const barHeight = (canvas.height - 50) * (value / maxValue);
    const x = index * (barWidth + barSpacing);
    const y = canvas.height - barHeight - 30; // Align bars from the bottom
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.font = '12px Arial'; // Adjust font size and style
    ctx.textAlign = 'center';
    ctx.fillStyle='black';
    ctx.fillText(Labels[index], x + barWidth / 2, canvas.height - 10); // Adjust vertical position of label
  });

  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 30); // Start point at left padding, bottom - 30 pixels for margin
  ctx.lineTo(canvas.width, canvas.height - 30); // End point at right padding, bottom - 30 pixels for margin
  ctx.strokeStyle = 'purple'; // Line color (adjust as needed)
  ctx.lineWidth = 0.5; // Line width (adjust as needed)
  ctx.stroke();
}

fetchData();