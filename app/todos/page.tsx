'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}


const TodosPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const todosPerPage = 10;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/todos/');
        if (!res.ok) throw new Error('Failed to fetch todos');
        const data: Todo[] = await res.json();
        setTodos(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchTodos();
  }, []);

  // Filtered list based on search term
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1); // reset to first page on new search
  };

  if (error) {
    return <div className="text-red-600 text-center mt-10">Error: {error}</div>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Todo List</h1>

      {/* Search Input and Button */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search todos..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-grow p-3 border rounded-md shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <ul className="space-y-4">
        {currentTodos.length > 0 ? (
          currentTodos.map((todo) => (
            <li key={todo.id} className="p-4 bg-white rounded shadow hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{todo.title}</h2>
                  <p className={`mt-1 ${todo.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {todo.completed ? 'Completed' : 'Pending'}
                  </p>
                </div>
                <Link href={`/todos/${todo.id}`} className="text-blue-500 hover:underline text-sm">
                  View Details
                </Link>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No todos found.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded-md border text-sm ${
                currentPage === num
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </main>
  );
};

export default TodosPage;
