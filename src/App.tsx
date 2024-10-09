import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";

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
  const [placeholder, setPlaceholder] = useState<boolean>(true);

  // Сохраняем данные в localStorage при каждом изменении data
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(data));
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
    setPlaceholder(true);
  };

  const addTask = (task: string) => {
    if (editId !== null) {
      const updated = data.map((t) =>
        t.id === editId ? { ...t, name: task } : t
      );
      setData(updated);
      setEditId(null);
      setTask("");
    } else if (task) {
      const newTask: Task = { id: Date.now(), name: task };
      setData([...data, newTask]);
      setTask("");
    } else {
      setPlaceholder(false);
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
          placeholder={placeholder ? "Enter task..." : "Enter symbols!!!"}
          style={{ borderColor: placeholder ? "" : "red" }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              addTask(task);
              setTask("");
            }
          }}
        />
        <button onClick={() => addTask(task)}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <Reorder.Group axis="y" values={data} onReorder={setData}>
        {data.map((task) => (
          <Reorder.Item key={task.id} value={task}>
            {task.name}
            <div className="manage-btns">
              <button onClick={() => editTask(task.id)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* <ul>
        {data.map((t) => (
          <li draggable={true} key={t.id}>
            {t.name}
            <div className="manage-btns">
              <button onClick={() => editTask(t.id)}>Edit</button>
              <button onClick={() => deleteTask(t.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default App;
