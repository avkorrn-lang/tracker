// Находим необходимые элементы
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');

// Функция добавления задачи
function addTask(event) {
    event.preventDefault(); // предотвращаем перезагрузку страницы

    const text = taskInput.value.trim(); // берём текст, убираем лишние пробелы

    if (text === '') {
        return; // если пусто — ничего не делаем
    }

    // Создаём новый элемент списка
    const newTask = document.createElement('li');
    newTask.textContent = text;

    // Добавляем его в список
    taskList.appendChild(newTask);

    // Очищаем поле ввода
    taskInput.value = '';

    // Задание: выводим сообщение в консоль
    console.log('Добавлена задача:', text);
}

// Прикрепляем обработчик к форме (событие submit)
taskForm.addEventListener('submit', addTask);