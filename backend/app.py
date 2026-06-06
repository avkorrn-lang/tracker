from flask import Flask, request, jsonify
from flask_cors import CORS   # <-- новая строка

app = Flask(__name__)
CORS(app)                      # <-- разрешаем кросс-доменные запросы

tasks = []

@app.route('/')
def hello():
    return '<h1>API трекера задач работает</h1>'

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({'error': 'Нужно поле title'}), 400

    task = {
        'id': len(tasks) + 1,
        'title': data['title'],
        'status': 'active'
    }
    tasks.append(task)
    return jsonify(task), 201

if __name__ == '__main__':
    app.run(debug=True)