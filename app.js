const API_URL = 'http://127.0.0.1:5000';
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const taskTemplate = document.querySelector('#task-template');
const messageBox = document.querySelector('#message');

function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.style.color = isError ? 'red' : 'green';
    setTimeout(() => { messageBox.textContent = ''; }, 5000);
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const clone = taskTemplate.content.cloneNode(true);
            clone.querySelector('.task-title').textContent = task.title;
            clone.querySelector('.task-status').textContent = task.status;
            
            const doneBtn = clone.querySelector('.done-btn');
            const deleteBtn = clone.querySelector('.delete-btn');
            
            doneBtn.addEventListener('click', () => toggleTask(task.id, task.status));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            taskList.appendChild(clone);
        });
    } catch (error) {
        showMessage('Не удалось загрузить задачи.', true);
    }
}

async function addTask(event) {
    event.preventDefault();
    const title = taskInput.value.trim();
    if (title === '') return;
    try {
        const response = await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        taskInput.value = '';
        await loadTasks();
    } catch (error) {
        showMessage('Ошибка при добавлении задачи.', true);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        await loadTasks();
    } catch (error) {
        showMessage('Ошибка при удалении задачи.', true);
    }
}

async function toggleTask(taskId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'done' : 'active';
    try {
        const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        await loadTasks();
    } catch (error) {
        showMessage('Ошибка при обновлении задачи.', true);
    }
}

taskForm.addEventListener('submit', addTask);
loadTasks();