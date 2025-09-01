'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Todo type
type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

// Mock data for design purposes
const mockTodos: Todo[] = [
  { id: '1', text: 'Review project requirements', completed: false },
  { id: '2', text: 'Set up development environment', completed: true },
  { id: '3', text: 'Design database schema', completed: false },
  { id: '4', text: 'Implement authentication flow', completed: false },
  { id: '5', text: 'Create UI components', completed: true },
];

// Sortable Task Item Component
function SortableTaskItem({ 
  todo, 
  toggleTodo, 
  onEdit,
  onDelete,
  editingId,
  editText,
  setEditText,
  onSaveEdit,
  onCancelEdit
}: { 
  todo: Todo; 
  toggleTodo: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
  editText: string;
  setEditText: (text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingId === todo.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-surface border-4 border-border p-4
        brutalist-shadow brutalist-button
        ${todo.completed ? 'diagonal-lines' : ''}
        ${isDragging ? 'cursor-grabbing' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="w-10 h-10 flex items-center justify-center bg-black text-white hover:bg-accent cursor-grab transition-colors drag-handle"
          title="Drag to reorder"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        
        {/* Checkbox */}
        <div className="relative w-6 h-6" onClick={() => toggleTodo(todo.id)}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className="sr-only"
          />
          <div className={`
            w-6 h-6 border-3 border-border transition-all duration-100 cursor-pointer
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
        
        {/* Task Text or Edit Input */}
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit();
              if (e.key === 'Escape') onCancelEdit();
            }}
            className="flex-1 bg-white border-2 border-black px-2 py-1 font-bold text-lg uppercase text-black focus:outline-none focus:border-accent"
            autoFocus
          />
        ) : (
          <span className={`
            flex-1 font-bold text-lg uppercase select-none min-w-0 truncate
            ${todo.completed 
              ? 'text-text-muted line-through' 
              : 'text-black'
            }
          `}>
            {todo.text}
          </span>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={onSaveEdit}
                className="px-3 py-1 bg-accent text-white border-2 border-black font-bold text-xs uppercase hover:bg-accent-hover transition-colors"
              >
                [SAVE]
              </button>
              <button
                onClick={onCancelEdit}
                className="px-3 py-1 bg-white text-black border-2 border-black font-bold text-xs uppercase hover:bg-gray-200 transition-colors"
              >
                [CANCEL]
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(todo.id)}
                className="px-3 py-1 bg-black text-white border-2 border-black font-bold text-xs uppercase hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                [EDIT]
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="px-3 py-1 bg-gray-200 text-red-500 border-2 border-black font-bold text-xs uppercase hover:bg-gray-300 transition-colors flex-shrink-0"
              >
                [DELETE]
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [todos, setTodos] = useState(mockTodos);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Ensure client-side only rendering for drag and drop
  useEffect(() => {
    setMounted(true);
  }, []);

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleEdit = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setEditingId(id);
      setEditText(todo.text);
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editingId) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setTodos(todos.filter(todo => todo.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && !showAddModal && !editingId && !showDeleteModal) {
        setShowAddModal(true);
      } else if (e.key === 'Escape') {
        if (showAddModal) {
          setShowAddModal(false);
          setNewTodoText('');
        }
        if (editingId) {
          handleCancelEdit();
        }
        if (showDeleteModal) {
          cancelDelete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAddModal, editingId, showDeleteModal]);

  const activeTodo = todos.find(todo => todo.id === activeId);
  const todoToDelete = todos.find(todo => todo.id === deleteId);

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
                left: `${(i * 2) % 100}%`,
                top: '-10px',
                animationDelay: `${(i * 0.01)}s`,
                backgroundColor: ['#0066FF', '#FFFFFF', '#FF0066', '#00FF66'][i % 4]
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

        {/* Task List with Drag and Drop */}
        {mounted ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={todos}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {todos.map((todo) => (
                  <SortableTaskItem 
                    key={todo.id} 
                    todo={todo} 
                    toggleTodo={toggleTodo}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    editingId={editingId}
                    editText={editText}
                    setEditText={setEditText}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                  />
                ))}
              </div>
            </SortableContext>
            
            {/* Drag Overlay */}
            <DragOverlay>
              {activeTodo && (
                <div
                  className={`
                    bg-surface border-4 border-accent p-4 cursor-grabbing
                    brutalist-shadow opacity-90
                    ${activeTodo.completed ? 'diagonal-lines' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-black text-white">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <span className={`
                      flex-1 font-bold text-lg uppercase
                      ${activeTodo.completed 
                        ? 'text-text-muted line-through' 
                        : 'text-black'
                      }
                    `}>
                      {activeTodo.text}
                    </span>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          // Non-draggable fallback for SSR
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`
                  bg-surface border-4 border-border p-4
                  brutalist-shadow brutalist-button
                  ${todo.completed ? 'diagonal-lines' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-black text-white">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <div className="relative w-6 h-6" onClick={() => toggleTodo(todo.id)}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="sr-only"
                    />
                    <div className={`
                      w-6 h-6 border-3 border-border transition-all duration-100 cursor-pointer
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
                    flex-1 font-bold text-lg uppercase select-none min-w-0 truncate
                    ${todo.completed 
                      ? 'text-text-muted line-through' 
                      : 'text-black'
                    }
                  `}>
                    {todo.text}
                  </span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(todo.id)}
                      className="px-3 py-1 bg-black text-white border-2 border-black font-bold text-xs uppercase hover:bg-gray-800 transition-colors flex-shrink-0"
                    >
                      [EDIT]
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="px-3 py-1 bg-gray-200 text-red-500 border-2 border-black font-bold text-xs uppercase hover:bg-gray-300 transition-colors flex-shrink-0"
                    >
                      [DELETE]
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <div className="mt-12 text-xs monospace text-gray-400">
          <p>KEYBOARD SHORTCUTS:</p>
          <p>[N] NEW TASK | [ESC] CANCEL | [DRAG] REORDER TASKS</p>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && todoToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border-4 border-border p-8 w-full max-w-md brutalist-shadow">
            <h2 className="text-2xl font-black uppercase mb-4 text-black">DELETE TASK?</h2>
            <p className="text-lg mb-8 text-black">
              "{todoToDelete.text.toUpperCase()}"
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3 bg-white border-4 border-border font-black uppercase hover:bg-gray-200 brutalist-button text-black"
              >
                [NO]
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-gray-200 text-red-500 border-4 border-border font-black uppercase hover:bg-gray-300 brutalist-button"
              >
                [YES, DELETE]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}