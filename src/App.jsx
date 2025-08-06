import React, { useState, useEffect } from 'react';

function TodoApp() {
  // State to store all todos - load from localStorage
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('my-todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  // State for the input field
  const [inputValue, setInputValue] = useState('');
  
  // State to track which todo is being edited
  const [editingId, setEditingId] = useState(null);
  
  // State for the edit input field
  const [editValue, setEditValue] = useState('');

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('my-todos', JSON.stringify(todos));
  }, [todos]);

  // Function to add a new todo
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(), // Simple ID generation
        text: inputValue,
        completed: false
      };
      
      setTodos([...todos, newTodo]); // Add new todo to existing list
      setInputValue(''); // Clear input field
    }
  };

  // Function to toggle completion status
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed } // Toggle completed status
        : todo // Keep other todos unchanged
    ));
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Function to start editing a todo
  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  // Function to save edited todo
  const saveEdit = () => {
    if (editValue.trim() !== '') {
      setTodos(todos.map(todo => 
        todo.id === editingId 
          ? { ...todo, text: editValue.trim() }
          : todo
      ));
    }
    setEditingId(null);
    setEditValue('');
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Handle Enter key press in input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  // Handle Enter key press in edit input
  const handleEditKeyPress = (event) => {
    if (event.key === 'Enter') {
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f0f2f5',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}><span style={{ color: 'blue' }}>Todoist App</span></h1>

      {/* Add Todo Section */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '30px', 
        gap: '10px' 
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a new task..."
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <div>
        {todos.length === 0 ? (
          <p style={{ 
            textAlign: 'center', 
            color: '#888', 
            fontSize: '18px' 
          }}>
            <span style={{ color: 'red' }}>No todos yet. Add one above!</span>
            <br />
            <span style={{ fontStyle: 'italic' }}>Make your Todo great again!</span>
          </p>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                margin: '10px 0',
                backgroundColor: todo.completed ? '#f0f8f0' : '#fff',
                border: '2px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{
                  marginRight: '15px',
                  transform: 'scale(1.2)',
                  cursor: 'pointer'
                }}
              />
              
              {/* Todo Text or Edit Input */}
              {editingId === todo.id ? (
                // Edit Mode
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleEditKeyPress}
                  style={{
                    flex: 1,
                    fontSize: '16px',
                    padding: '8px',
                    border: '2px solid #4CAF50',
                    borderRadius: '4px',
                    marginRight: '10px',
                    outline: 'none'
                  }}
                  autoFocus
                />
              ) : (
                // Display Mode
                <span
                  style={{
                    flex: 1,
                    fontSize: '16px',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888' : '#333',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>
              )}
              
              {/* Status Badge */}
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: todo.completed ? '#4CAF50' : '#ff9800',
                  color: 'white',
                  marginRight: '10px'
                }}
              >
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
              
              {/* Action Buttons */}
              {editingId === todo.id ? (
                // Save and Cancel buttons when editing
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={saveEdit}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#9e9e9e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // Edit and Delete buttons when not editing
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => startEdit(todo.id, todo.text)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {todos.length > 0 && (
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
            <strong>Total Tasks:</strong> {todos.length} | 
            <strong> Completed:</strong> {todos.filter(todo => todo.completed).length} | 
            <strong> Pending:</strong> {todos.filter(todo => !todo.completed).length}
          </p>
        </div>
      )}
    </div>
  </div>
);
}

export default TodoApp;

