'use client';

import { useState, useEffect } from 'react';

// Mock data for design purposes
const mockTodos = [
  { id: '1', text: 'Review project requirements', completed: false },
  { id: '2', text: 'Set up development environment', completed: true },
  { id: '3', text: 'Design database schema', completed: false },
  { id: '4', text: 'Implement authentication flow', completed: false },
  { id: '5', text: 'Create UI components', completed: true },
];

export default function Home() {
  const [todos, setTodos] = useState(mockTodos);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  const toggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
    if (newTodoText.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        text: newTodoText,
        completed: false
      }]);
      setNewTodoText('');
      setShowAddModal(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && !showAddModal) {
        setShowAddModal(true);
      } else if (e.key === 'Escape' && showAddModal) {
        setShowAddModal(false);
        setNewTodoText('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAddModal]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Confetti Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Confetti pieces */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#0066FF', '#FFFFFF', '#FF0066', '#00FF66'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
          {/* Success message */}
          <div className="fixed top-32 left-1/2 transform -translate-x-1/2">
            <h2 className="text-6xl font-black text-accent animate-pulse">TASK DONE!</h2>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b-4 border-white bg-black">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-black uppercase text-white">TASKS</h1>
          <button className="text-sm font-bold uppercase text-white hover:text-accent transition-colors">
            [SIGN OUT]
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 mt-24">
        {/* Task Counter */}
        <div className="mb-8 flex gap-8 text-sm monospace">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-white"></div>
            <span className="font-bold text-white">{pendingCount} PENDING</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent border-2 border-white"></div>
            <span className="font-bold text-white">{completedCount} COMPLETED</span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`
                bg-surface border-4 border-border p-4 cursor-pointer
                brutalist-shadow brutalist-button
                ${todo.completed ? 'diagonal-lines' : ''}
              `}
              onClick={() => toggleTodo(todo.id)}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-6 h-6">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 border-3 border-border transition-all duration-100
                    ${todo.completed 
                      ? 'bg-accent' 
                      : 'bg-surface hover:border-accent'
                    }
                  `}>
                    {todo.completed && (
                      <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`
                  flex-1 font-bold text-lg uppercase
                  ${todo.completed 
                    ? 'text-text-muted line-through' 
                    : 'text-black'
                  }
                `}>
                  {todo.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-12 text-xs monospace text-gray-400">
          <p>KEYBOARD SHORTCUTS:</p>
          <p>[N] NEW TASK | [ESC] CANCEL</p>
        </div>
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-accent text-white font-black text-3xl brutalist-shadow brutalist-button hover:bg-accent-hover"
        aria-label="Add new task"
      >
        +
      </button>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border-4 border-border p-8 w-full max-w-md brutalist-shadow">
            <h2 className="text-2xl font-black uppercase mb-6 text-black">NEW TASK</h2>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="WHAT NEEDS TO BE DONE?"
              className="w-full bg-white border-4 border-border px-4 py-3 text-black placeholder-text-muted focus:outline-none focus:border-accent font-bold uppercase"
              autoFocus
            />
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTodoText('');
                }}
                className="flex-1 py-3 bg-white border-4 border-border font-black uppercase hover:bg-gray-200 brutalist-button text-black"
              >
                [CANCEL]
              </button>
              <button
                onClick={addTodo}
                className="flex-1 py-3 bg-accent text-white border-4 border-border font-black uppercase hover:bg-accent-hover brutalist-button"
              >
                [ADD TASK]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}