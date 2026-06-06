from flask import Flask, request, jsonify

app = Flask(__name__)

# Пока храним задачи в обычном списке (в памяти)
tasks = []

@app.route('/')
def hello():
    return '<h1>API трекера задач работает</h1>'

# GET — получить список задач
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# POST — добавить задачу
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()          # парсим JSON из тела запроса
    if not data or 'title' not in data:
        return jsonify({'error': 'Нужно поле title'}), 400

    task = {
        'id': len(tasks) + 1,          # простой автоинкремент
        'title': data['title'],
        'status': 'active'
    }
    tasks.append(task)
    return jsonify(task), 201          # 201 — "создано"
if __name__ == '__main__':
    app.run(debug=True)