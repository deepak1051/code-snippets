import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
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
      <div className="flex items-center gap-3">
        <a
          href="/auth/google"
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <FaGoogle size={18} />
          <span>Login with Google</span>
        </a>
        <a
          href="/auth/github"
          className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2 rounded-full hover:bg-gray-800 shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <FaGithub size={18} />
          <span>Login with GitHub</span>
        </a>
      </div>
    );
  } else if (data) {
    content = (
      <div className="flex items-center gap-4">
        <Link
          to="/snippets/new"
          className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Create
        </Link>
        <Link
          to="/snippets"
          className="text-gray-600 hover:text-indigo-500 transition-colors duration-200"
        >
          My Snippets
        </Link>
        <img
          src={data?.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
        />
        <a
          href="/api/logout"
          className="text-red-500 hover:text-red-600 transition-colors duration-200"
        >
          Logout
        </a>
      </div>
    );
  }

  return (
    <header className="bg-indigo-50 shadow-md">
      <div className="container mx-auto px-6 py-4 max-w-5xl flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold italic text-indigo-600">
          Snippets
        </Link>
        {content}
      </div>
    </header>
  );
}
