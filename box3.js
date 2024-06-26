document.addEventListener('DOMContentLoaded', () => {
    const createTaskBtn = document.getElementById('createTaskBtn');
    const popup = document.getElementById('popup');
    const closeBtns = document.querySelectorAll('.close');
    const taskForm = document.getElementById('taskForm');
    const pendingTasks = document.getElementById('pendingTasks');
    const completedTasks = document.getElementById('completedTasks');

    createTaskBtn.addEventListener('click', () => {
        popup.style.display = 'flex';
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.popup').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskName = document.getElementById('taskName').value;
        const taskStatus = document.getElementById('taskStatus').value;
        const taskNotes = document.getElementById('taskNotes').value;
        const taskTime = document.getElementById('taskTime').value;

        const task = {
            Name: taskName,
            Status: taskStatus,
            notes: taskNotes,
            time: taskTime,
        };

        chrome.runtime.sendMessage({ action: 'addTasks', task: task }, (response) => {
            if (response && response.status === 'success') {
                addTaskToUI(task);
            }
        });

        taskForm.reset();
        popup.style.display = 'none';
    });

    function fetchTasks() {
        chrome.runtime.sendMessage({ action: 'getTasks' }, function(response) {
            if (response) {
                let taskArr = response.tasks;
                taskArr.forEach(task => {
                    addTaskToUI(task);
                });
            }
        });
    }

    function deleteTask(button) {
        const taskBox = button.parentElement.parentElement;
        const taskId = taskBox.id;

        chrome.runtime.sendMessage({ action: 'deleteTask', taskId: taskId }, function(response) {
            if (response.success) {
                taskBox.remove();
            } else {
                console.log('Failed to delete task');
            }
        });
    }
    function addTaskToUI(task) {
        // Create task item container
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.id = task.Name;
    
        // Create elements for task details
        const taskName = document.createElement('h3');
        taskName.textContent = task.Name;
    
        const taskNotes = document.createElement('p');
        taskNotes.textContent = `Notes: ${task.notes}`;
    
        const taskStatus = document.createElement('p');
        taskStatus.textContent = `Status: ${task.Status}`;
    
        // Append task details to task item container
        taskItem.appendChild(taskName);
        taskItem.appendChild(taskNotes);
        taskItem.appendChild(taskStatus);
    
        // Create task buttons container
        const taskButtons = document.createElement('div');
        taskButtons.className = 'task-item-buttons';
    
        // Create toggle status button
        const toggleStatusBtn = document.createElement('button');
        toggleStatusBtn.className = 'toggleStatusBtn';
        toggleStatusBtn.id = `toggle_${task.name}`; // Set ID based on task name
        toggleStatusBtn.textContent = task.Status === 'pending' ? 'Move to Completed' : 'Move to Pending';
    
        toggleStatusBtn.addEventListener('click', function(event) {
            const newStatus = task.Status === 'pending' ? 'completed' : 'pending';
        
            chrome.runtime.sendMessage({ action: 'statusChange', task: task }, function(response) {
                console.log(response.status);
                if (response && response.status === 'success') {
                    task.Status = newStatus;
                    taskStatus.textContent = `Status: ${newStatus}`;
                    toggleStatusBtn.textContent = newStatus === 'pending' ? 'Move to Completed' : 'Move to Pending';
        
                    if (newStatus === 'completed') {
                        completedTasks.appendChild(taskItem);
                        pendingTasks.removeChild(taskItem);
                    } else {
                        pendingTasks.appendChild(taskItem);
                        completedTasks.removeChild(taskItem);
                    }
                } else {
                    console.error('Failed to change task status:', response && response.error);
                }
            });
        });
    
        // Create delete task button
        const deleteTaskBtn = document.createElement('button');
        deleteTaskBtn.className = 'deleteTaskBtn';
        deleteTaskBtn.id = `del_${task.name}`; // Set ID based on task name
        deleteTaskBtn.textContent = 'Delete';
    
        // Add event listener for delete task button
        deleteTaskBtn.addEventListener('click', function(event) {
            taskItem.remove();
            // Additional logic to delete the task from your data or perform other actions
        });
    
        // Append buttons to task buttons container
        taskButtons.appendChild(toggleStatusBtn);
        taskButtons.appendChild(deleteTaskBtn);
    
        // Append task buttons container to task item container
        taskItem.appendChild(taskButtons);
    
        // Append task item container to appropriate task list based on status
        if (task.Status === 'completed') {
            completedTasks.appendChild(taskItem);
        } else {
            pendingTasks.appendChild(taskItem);
        }
    }


function fetchBlockedSites() {
    chrome.runtime.sendMessage({action: 'getBlockedsites'},function(response){
        const blockedSites = response.Toblocksites;
        const blockedSitesList = document.getElementById('blockedSitesList');
        blockedSitesList.innerHTML = '';

        blockedSites.forEach(site => {
            const listItem = document.createElement('div');
            listItem.textContent = site;
            blockedSitesList.appendChild(listItem);
        });
    });
}

document.getElementById('addBlockedSiteBtn').addEventListener('click', function(event) {
    event.preventDefault();
    const blockedSiteInput = document.getElementById('blockedSiteInput');
    const siteUrl = blockedSiteInput.value.trim();

    if (siteUrl) {
        chrome.runtime.sendMessage({action:'addToblock', site:siteUrl},function(response){
            if(response){
                fetchBlockedSites();
                blockedSiteInput.value = '';
                }
            });
        }
    });

fetchTasks();
fetchBlockedSites();
});
