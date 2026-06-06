from flask import Flask, request, jsonify
from flask_cors import CORS
import db

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return '<h1>API трекера задач работает</h1>'

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = db.get_tasks()
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({'error': 'Нужно поле title'}), 400
    db.add_task(data['title'])
    return jsonify({'status': 'ok'}), 201

if __name__ == '__main__':
    db.init_db()  # создаст таблицу, если её нет
    app.run(debug=True)