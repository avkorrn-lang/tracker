const API_URL = 'http://127.0.0.1:5000';
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const taskTemplate = document.querySelector('#task-template');
const messageBox = document.querySelector('#message');
const filterBtns = document.querySelectorAll('.filter-btn');

let allTasks = [];
let currentFilter = 'all';

function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.style.color = isError ? '#f28b82' : '#81c995';
    messageBox.style.background = isError ? '#5f2120' : '#1e3a1f';
    setTimeout(() => { messageBox.textContent = ''; }, 4000);
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        allTasks = await response.json();
        renderTasks();
    } catch (error) {
        showMessage('Не удалось загрузить задачи.', true);
    }
}

function renderTasks() {
    const filtered = allTasks.filter(task => {
        if (currentFilter === 'active') return task.status === 'active';
        if (currentFilter === 'done') return task.status === 'done';
        return true;
    });

    taskList.innerHTML = '';
    filtered.forEach(task => {
        const clone = taskTemplate.content.cloneNode(true);
        clone.querySelector('.task-title').textContent = task.title;
        clone.querySelector('.task-status').textContent = task.status === 'done' ? '✓' : '';

        const li = clone.querySelector('li');
        if (task.status === 'done') li.style.opacity = '0.6';

        clone.querySelector('.done-btn').addEventListener('click', () => toggleTask(task.id, task.status));
        clone.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(clone);
    });
}

async function addTask(event) {
    event.preventDefault();
    const title = taskInput.value.trim();
    
    if (title === '') {
        showMessage('Введите текст задачи', true);
        taskInput.style.boxShadow = '0 0 0 2px #f28b82';
        setTimeout(() => { taskInput.style.boxShadow = ''; }, 1500);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        taskInput.value = '';
        taskInput.style.boxShadow = '';
        await loadTasks();
    } catch (error) {
        showMessage('Ошибка при добавлении задачи.', true);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/api/tasks/${taskId}`, { method: 'DELETE' });
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

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

taskForm.addEventListener('submit', addTask);
loadTasks();