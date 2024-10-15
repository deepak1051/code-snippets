import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../config/api';

export default function Header() {
  const { data } = useQuery({
    queryKey: ['current_user'],
    queryFn: () => api.get('/current_user').then((res) => res.data),
  });

  console.log('DATA', data);

  let content;

  if (data === undefined) {
    content = null;
  } else if (data === '') {
    content = (
      <div className="flex items-center gap-4">
        <a href="/auth/google" className="bg-teal-500 text-white p-2 rounded ">
          Login with Google
        </a>

        <a href="/auth/github" className="bg-zinc-500 text-white p-2 rounded">
          Login with Github
        </a>
      </div>
    );
  } else if (data) {
    content = (
      <div className="flex items-center gap-4">
        <Link to="/snippets/new">Create</Link>
        <Link to="/snippets">My Snippets</Link>
        <img
          src={data?.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
        />
        <Link to="/logout">Logout</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-indigo-50 p-2 rounded flex items-center justify-between">
        <Link to="/" className="text-3xl  font-bold  italic text-indigo-500">
          Snippets
        </Link>

        {content}
      </div>
    </div>
  );
}
