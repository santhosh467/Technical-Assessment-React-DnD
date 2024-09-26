import React, { useState } from 'react';

// React uses "state" to store dynamic data and re-render components when data changes.
const ToDoList = () => {
  // 'tasks' will store the list of to-dos, and 'setTasks' allows us to update it.
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(''); // stores the current input value

  // Add task function, triggered when a task is added.
  const addTask = () => {
   // if (newTask.trim() !== '') { // prevents adding empty tasks
      setTasks([...tasks, newTask]); // adds new task to the existing list
      setNewTask(''); // clears the input field
   // }
  };

  // Delete task function, removes a task by its index in the array
//   const deleteTask = (index) => {
//     const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
//     setTasks(updatedTasks);
//   };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)} // updates the input value as user types
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task} 
            {/* <button onClick={() => deleteTask(index)}>Delete</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
