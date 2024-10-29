import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../config/api';

export default function Header() {
  const { data } = useQuery({
    queryKey: ['current_user'],
    queryFn: () => api.get('/current_user').then((res) => res.data),
  });

  let content;

  if (data === undefined) {
    content = null;
  } else if (data === '') {
    content = (
      <div className="flex items-center gap-4">
        <a href="/auth/google" className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors duration-300">
          Login with Google
        </a>
        <a href="/auth/github" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300">
          Login with Github
        </a>
      </div>
    );
  } else if (data) {
    content = (
      <div className="flex items-center gap-4">
        <Link to="/snippets/new" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-300">
          Create
        </Link>
        <Link to="/snippets" className="text-gray-700 hover:underline">My Snippets</Link>
        <img
          src={data?.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
        />
        <a href="/api/logout"  className="text-red-500 hover:underline">Logout</a>
      </div>
    );
  }

  return (
    <header className="bg-indigo-50 shadow-md">
      <div className="container mx-auto p-4 max-w-4xl flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold italic text-indigo-600">
          Snippets
        </Link>
        {content}
      </div>
    </header>
  );
}
