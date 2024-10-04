import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  name: string;
}

function App() {
  // Инициализация состояния данными из localStorage
  const [data, setData] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  
  const [task, setTask] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  // Сохраняем данные в localStorage при каждом изменении data
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(data));
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const addTask = () => {
    if (editId !== null) {
      const updated = data.map((t) =>
        t.id === editId ? { ...t, name: task } : t
      );
      setData(updated);
      setEditId(null);
    } else {
      const newTask: Task = { id: Date.now(), name: task };
      setData([...data, newTask]);
      setTask("");
    }
  };

  const deleteTask = (id: number) => {
    const filtered = data.filter((t) => t.id !== id);
    setData(filtered);
  };

  const editTask = (id: number) => {
    const toEdit = data.find((t) => t.id === id);

    if (toEdit) {
      setTask(toEdit.name);
      setEditId(id);
    }
  };

  return (
    <div className="app">
      <h1>To-do List</h1>
      <div className="input-wrapper">
        <input
          type="text"
          value={task}
          onChange={handleInputChange}
          placeholder="Enter task..."
        />
        <button onClick={addTask}>{editId ? "Update" : "Add"}</button>
      </div>

      <ul>
        {data.map((t) => (
          <li key={t.id}>
            {t.name}
            <div className="manage-btns">
              <button onClick={() => editTask(t.id)}>Edit</button>
              <button onClick={() => deleteTask(t.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
