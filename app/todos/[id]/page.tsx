// app/todos/[id]/page.tsx

import { notFound } from 'next/navigation';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

async function getTodo(id: string): Promise<Todo | null> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
  const todos: Todo[] = await res.json();

  return todos.map((todo) => ({
    id: todo.id.toString(),
  }));
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const todo = await getTodo(params.id);

  if (!todo) return notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">📝 Todo #{todo.id}</h1>
      <p className="text-lg mb-2 font-medium">{todo.title}</p>
      <p className="text-gray-700">
        Status: {todo.completed ? '✅ Completed' : '❌ Incomplete'}
      </p>
      <a href="/todos" className="block mt-6 text-sm text-blue-600 hover:underline">
        ← Back to Todos
      </a>
    </div>
  );
}
