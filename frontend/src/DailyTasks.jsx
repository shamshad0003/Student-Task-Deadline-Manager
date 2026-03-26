import { useState } from 'react';
import './DailyTasks.css';

const DailyTasks = () => {
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task.trim()) {
            setTaskList([...taskList, { text: task, completed: false, id: Date.now() }]);
            setTask('');
        }
    };

    const toggleComplete = (id) => {
        setTaskList(taskList.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const deleteTask = (id) => {
        setTaskList(taskList.filter(item => item.id !== id));
    };

    return (
        <div className="daily-tasks-container">
            <div className="tasks-card">
                <h1 className="tasks-title">My Daily Tasks</h1>
                
                <form onSubmit={handleSubmit} className="task-form">
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="What needs to be done?"
                        className="task-input"
                    />
                    <button type="submit" className="add-button">
                        Add
                    </button>
                </form>

                <div className="tasks-list">
                    {taskList.length === 0 ? (
                        <p className="empty-message">Your list is empty. Start adding tasks!</p>
                    ) : (
                        taskList.map((item) => (
                            <div 
                                key={item.id} 
                                className="task-item"
                                onClick={() => toggleComplete(item.id)}
                            >
                                <span className={`task-text ${item.completed ? 'completed' : 'active'}`}>
                                    {item.text}
                                </span>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTask(item.id);
                                    }}
                                    className="delete-button"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyTasks;
