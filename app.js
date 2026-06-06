// Базовый URL нашего API (Flask сервер)
const API_URL = 'http://127.0.0.1:5000';

// Элементы интерфейса
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');

// Загрузка задач с сервера при старте страницы
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const tasks = await response.json(); // парсим JSON

        // Очищаем список и добавляем каждую задачу
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.title;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Не удалось загрузить задачи:', error);
    }
}

// Добавление новой задачи
async function addTask(event) {
    event.preventDefault(); // не даём форме перезагрузить страницу

    const title = taskInput.value.trim();
    if (title === '') return;

    try {
        const response = await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title }) // превращаем объект в JSON
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        taskInput.value = '';       // очищаем поле ввода
        await loadTasks();         // перезагружаем список с сервера
    } catch (error) {
        console.error('Не удалось добавить задачу:', error);
        alert('Ошибка при добавлении задачи. Проверь, запущен ли сервер.');
    }
}

// Назначение обработчиков
taskForm.addEventListener('submit', addTask);

// Первоначальная загрузка списка
loadTasks();