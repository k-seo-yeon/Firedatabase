import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { 
  createTodo, 
  updateTodoProgress, 
  deleteTodo, 
  subscribeUserTodos 
} from "../../../services/todos";

const styles = `
.todo-bar {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.todo-container {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: white;
}

.todo-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.todo-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.todo-subtitle {
  color: #6c757d;
  font-size: 14px;
}

.task-input {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.task-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.task-input input:focus {
  border-color: #007bff;
}

.add-task-btn {
  padding: 12px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-task-btn:hover {
  background-color: #0056b3;
}

.task-list {
  flex: 1;
}

.task-list h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 40px 20px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
}

.task-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-item.completed {
  background-color: #f8f9fa;
  opacity: 0.8;
}

.progress-bar {
  position: relative;
  width: 80px;
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #007bff;
  border-radius: 10px;
  transition: width 0.2s ease;
}

.progress.completed {
  background-color: #28a745;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.progress-handle {
  position: absolute;
  top: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border: 2px solid #007bff;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.progress-handle.completed {
  border-color: #28a745;
}

.task-title {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.task-title.completed {
  text-decoration: line-through;
  color: #6c757d;
}

.task-options {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.task-options:hover {
  background-color: #f8d7da;
}
`;

function TodoList({ date = new Date() }) {
  const { user } = useAuth();
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const currentDateKey = getDateKey(date);

  // 파이어베이스에서 투두 실시간 구독
  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    console.log('투두 실시간 구독 시작:', user.uid, '날짜:', currentDateKey);

    const unsubscribe = subscribeUserTodos(user.uid, (allTodos) => {
      console.log('모든 투두 받음:', allTodos);
      // 현재 날짜의 투두만 필터링
      const todayTodos = allTodos.filter(todo => todo.date === currentDateKey);
      console.log('오늘 투두 필터링됨:', todayTodos);
      setTodos(todayTodos);
    });

    return () => {
      console.log('투두 구독 해제');
      unsubscribe();
    };
  }, [user, currentDateKey]);

  // subscribeTodosByDate로 이미 특정 날짜의 투두만 받아오므로 추가 필터링 불필요
  const todayTodos = todos;

  const addTodo = async () => {
    if (!newTodo.trim() || !user || isLoading) return;

    setIsLoading(true);
    try {
      const todoData = {
        text: newTodo.trim(),
        progress: 0,
        date: currentDateKey,
        completed: false
      };

      const newTodoItem = await createTodo(user.uid, todoData);
      console.log('Created todo:', newTodoItem);
      
      // 즉시 반영을 위해 로컬 상태에 추가 (중복 방지)
      setTodos(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        if (existingIds.has(newTodoItem.id)) {
          return prev; // 이미 존재하면 추가하지 않음
        }
        return [newTodoItem, ...prev];
      });
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('할 일 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTodoProgress = async (todoId, newProgress) => {
    try {
      // 즉시 반영을 위해 로컬 상태 업데이트
      setTodos(prev => prev.map(todo => 
        todo.id === todoId 
          ? { ...todo, progress: newProgress, completed: newProgress === 100 }
          : todo
      ));
      
      await updateTodoProgress(user.uid, todoId, newProgress);
      console.log('Updated todo progress:', todoId, newProgress);
    } catch (error) {
      console.error('Error updating todo progress:', error);
      alert('진행률 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      // 즉시 반영을 위해 로컬 상태에서 제거
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      
      await deleteTodo(user.uid, todoId);
      console.log('Deleted todo:', todoId);
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('할 일 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="todo-bar">
      <style>{styles}</style>
      <div className="todo-container">
        <div className="todo-header">
          <div className="todo-title">오늘의 할 일</div>
          <div className="todo-subtitle">
            {formatDate(date)}
          </div>
        </div>

        <div className="task-input">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="할 일을 입력하세요"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            className="add-task-btn"
            onClick={addTodo}
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 29 29" fill="white">
              <path d="M14.5 0v29M0 14.5h29" stroke="white" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="task-list">
          <h3>
            할 일 목록 ({todayTodos.length}개)
          </h3>

          {!user ? (
            <p className="empty-state">
              로그인이 필요합니다.
            </p>
          ) : todayTodos.length === 0 ? (
            <p className="empty-state">
              등록된 할 일이 없습니다.<br/>
              위에서 할 일을 추가해보세요!
            </p>
          ) : (
            todayTodos.map(todo => (
              <div
                key={todo.id}
                className={`task-item ${todo.progress === 100 ? 'completed' : ''}`}
              >
                <div
                  className="progress-bar"
                  onMouseDown={(e) => {
                    const progressBar = e.currentTarget;
                    const rect = progressBar.getBoundingClientRect();
                    const handleMouseMove = (moveEvent) => {
                      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                      const percentage = Math.round((x / rect.width) * 100);
                      handleUpdateTodoProgress(todo.id, percentage);
                    };
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                    handleMouseMove(e);
                  }}
                >
                  <div
                    className={`progress ${todo.progress === 100 ? 'completed' : ''}`}
                    style={{ width: `${todo.progress}%` }}
                  />
                  <span className="progress-text">
                    {todo.progress}%
                  </span>
                  <div
                    className={`progress-handle ${todo.progress === 100 ? 'completed' : ''}`}
                    style={{ left: `${Math.max(0, Math.min(todo.progress - 1, 99))}%` }}
                  />
                </div>

                <span className={`task-title ${todo.progress === 100 ? 'completed' : ''}`}>
                  {todo.text}
                </span>

                <button
                  className="task-options"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;