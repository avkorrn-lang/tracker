import sqlite3

DATABASE = 'tasks.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT DEFAULT 'active'
        )
    ''')
    conn.commit()
    conn.close()

def get_tasks():
    conn = get_db()
    tasks = conn.execute('SELECT id, title, status FROM tasks ORDER BY id').fetchall()
    conn.close()
    return [dict(task) for task in tasks]

def add_task(title):
    conn = get_db()
    conn.execute('INSERT INTO tasks (title) VALUES (?)', (title,))
    conn.commit()
    conn.close()