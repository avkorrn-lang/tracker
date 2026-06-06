const API_URL = 'http://127.0.0.1:5000';
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
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
            const li = document.createElement('li');
            li.textContent = task.title;
            taskList.appendChild(li);
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
        showMessage('Ошибка при добавлении задачи. Проверь, запущен ли сервер.', true);
    }
}

taskForm.addEventListener('submit', addTask);
loadTasks();