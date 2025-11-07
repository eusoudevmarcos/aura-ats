import { tarefaApi } from '@/axios/tarefaApi';
import { AdminGuard } from '@/components/auth/AdminGuard';
import Card from '@/components/Card';
import { useEffect, useRef, useState } from 'react';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

export default function Tarefas() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    loadTarefas();
  }, []);

  const loadTarefas = async () => {
    try {
      setLoading(true);
      const tarefas = await tarefaApi.getAll();
      const todoItems: TodoItem[] = tarefas.map(tarefa => ({
        id: tarefa.id!,
        text: tarefa.descricao,
        done: tarefa.concluida,
      }));
      setTodos(todoItems);
    } catch (error) {
      console.log('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Permitir Tab e Enter customizados em textareas
  function handleTextareaKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    action: () => void
  ) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value =
        textarea.value.substring(0, start) +
        '\t' +
        textarea.value.substring(end);
      setInput(value);
      // Atualizar o cursor depois de inserir o tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      // Salva (adiciona ou edita) com Ctrl+Enter / Cmd+Enter
      action();
    }
    // Enter padrão cria nova linha.
  }

  // Para edição, precisamos uma função que diferencia input e editText
  function handleEditTextareaKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    id: number
  ) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value =
        textarea.value.substring(0, start) +
        '\t' +
        textarea.value.substring(end);
      setEditText(value);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      setEditId(null);
    }
    // Enter padrão deixa quebrar linha.
  }

  // Adicionar nova tarefa
  const handleAdd = async () => {
    if (!input.trim()) return;

    try {
      const novaTarefa = await tarefaApi.save({
        descricao: input,
        concluida: false,
        orderBy: todos.length,
      });

      setTodos([
        ...todos,
        {
          id: novaTarefa.id!,
          text: novaTarefa.descricao,
          done: novaTarefa.concluida,
        },
      ]);
      setInput('');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  // Apagar tarefa
  const handleDelete = async (id: number) => {
    try {
      await tarefaApi.delete(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  // Iniciar edição
  const handleEditStart = (todo: TodoItem) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  // Salvar edição
  const handleEditSave = async (id: number) => {
    try {
      await tarefaApi.save({
        id,
        descricao: editText,
        concluida: todos.find(t => t.id === id)?.done || false,
        orderBy: todos.find(t => t.id === id)?.id || 0,
      });

      setTodos(todos.map(t => (t.id === id ? { ...t, text: editText } : t)));
      setEditId(null);
      setEditText('');
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
    }
  };

  // Marcar como concluído
  const handleToggleDone = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      await tarefaApi.save({
        id,
        descricao: todo.text,
        concluida: !todo.done,
        orderBy: todos.findIndex(t => t.id === id),
      });

      setTodos(todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  // Drag and drop - início do drag
  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };

  // Drag and drop - durante o drag
  const handleDragEnter = (idx: number) => {
    dragOverItem.current = idx;
  };

  // Drag and drop - soltar
  const handleDragEnd = async () => {
    if (
      dragItem.current === null ||
      dragOverItem.current === null ||
      dragItem.current === dragOverItem.current
    ) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const _todos = [...todos];
    const movedItem = _todos.splice(dragItem.current, 1)[0];
    _todos.splice(dragOverItem.current, 0, movedItem);
    setTodos(_todos);

    // Salvar nova ordem no backend
    try {
      const tarefasComOrdem = _todos.map((todo, index) => ({
        id: todo.id,
        orderBy: index,
      }));
      await tarefaApi.updateOrder(tarefasComOrdem);
    } catch (error) {
      console.error('Erro ao atualizar ordem das tarefas:', error);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Render multiline tarefa (quebra \n em <br/>)
  function renderMultiline(text: string) {
    return text.split('\n').map((line, idx) => (
      <span key={idx}>
        {line}
        {idx !== text.split('\n').length - 1 && <br />}
      </span>
    ));
  }

  return (
    <Card title={{ label: 'Tarefas', className: 'text-2xl' }}>
      <AdminGuard>
        <div className="flex gap-2 mb-4">
          <textarea
            className="w-full p-2 border rounded-lg focus:outline-primary resize-y min-h-[40px] max-h-40"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Adicione uma nova tarefa"
            onKeyDown={e => handleTextareaKeyDown(e, handleAdd)}
            rows={2}
          />
          <button
            className="bg-primary text-white px-4 py-2 rounded-md shadow hover:scale-105 transition"
            onClick={handleAdd}
            title="Adicionar tarefa"
          >
            Adicionar
          </button>
        </div>

        <div className="text-xs text-secondary mb-2">
          <strong>Enter</strong>: Nova linha • <strong>Tab</strong>: Tabulação •
          <strong>Ctrl+Enter</strong>: Adicionar/Salvar
        </div>
      </AdminGuard>

      <ul className="space-y-2">
        {loading ? (
          <li className="text-secondary text-center">Carregando tarefas...</li>
        ) : todos.length === 0 ? (
          <li className="text-secondary text-center">Nenhuma tarefa ainda.</li>
        ) : (
          todos.map((todo, idx) => (
            <li
              key={todo.id}
              className={`flex items-center p-2 rounded-lg border bg-white shadow hover:bg-gray-50 transition group ${
                todo.done ? 'opacity-50 line-through' : ''
              }`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragEnter={() => handleDragEnter(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
            >
              {/* Ícone arrastar */}
              <span className="mr-2 cursor-move text-gray-400 group-hover:text-primary">
                <span className="material-icons-outlined w-5 h-5">
                  drag_indicator
                </span>
              </span>
              <button
                className={`mr-3 rounded-full border-2 aspect-square w-6 h-6 flex items-center justify-center ${
                  todo.done
                    ? 'border-primary bg-primary text-white'
                    : 'border-primary/40 text-primary'
                }`}
                title="Concluir"
                onClick={() => handleToggleDone(todo.id)}
              >
                {todo.done && (
                  <span className="material-icons-outlined w-4 h-4">check</span>
                )}
              </button>
              {editId === todo.id ? (
                <textarea
                  className="flex-1 p-1 border rounded resize-y min-h-[36px] max-h-40"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => handleEditTextareaKeyDown(e, todo.id)}
                  autoFocus
                  rows={2}
                />
              ) : (
                <span
                  className={`flex-1 text-gray-700 whitespace-pre-line ${
                    todo.done ? 'line-through' : ''
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {renderMultiline(todo.text)}
                </span>
              )}
              <div className="flex gap-1 ml-2">
                {editId === todo.id ? (
                  <button
                    className="px-2 py-1 text-xs rounded bg-primary text-white hover:bg-primary/80 shadow"
                    onClick={() => handleEditSave(todo.id)}
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    className="p-1 rounded hover:bg-gray-100 text-primary"
                    onClick={() => handleEditStart(todo)}
                    title="Editar"
                  >
                    <span className="material-icons-outlined w-4 h-4">
                      edit
                    </span>
                  </button>
                )}
                <button
                  className="p-1 rounded hover:bg-gray-100 text-error"
                  onClick={() => handleDelete(todo.id)}
                  title="Excluir"
                >
                  <span className="material-icons-outlined w-4 h-4">
                    delete
                  </span>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
