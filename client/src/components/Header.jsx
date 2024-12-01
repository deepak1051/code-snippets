import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import api from "../config/api";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export default function Header() {
  const { data } = useQuery({
    queryKey: ["current_user"],
    queryFn: () => api.get("/current_user").then((res) => res.data),
  });

  let content;

  if (data === undefined) {
    content = null;
  } else if (data === "") {
    content = (
      <div className="flex items-center gap-3">
        <a href="/auth/google">
          <Button variant="secondary" className="gap-2 hover:bg-blue-100">
            <FaGoogle className="h-4 w-4" />
            <span>Login with Google</span>
          </Button>
        </a>
        <a href="/auth/github">
          <Button variant="secondary" className="gap-2 hover:bg-blue-100">
            <FaGithub className="h-4 w-4" />
            <span>Login with GitHub</span>
          </Button>
        </a>
      </div>
    );
  } else if (data) {
    content = (
      <div className="flex items-center gap-4">
        <Link to="/snippets/new">
          <Button variant="default" className="gap-2">
            Create
          </Button>
        </Link>
        <Link to="/snippets">
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            My Snippets
          </Button>
        </Link>
        <a href="/auth/logout">
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Logout
          </Button>
        </a>
      </div>
    );
  }

  return (
    <header className="sticky py-2 top-0 z-50 w-full border-b bg-gray-200/60 backdrop-blur supports-[backdrop-filter]:bg-gray-200/60 shadow-sm">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link
            to="/"
            className={cn(
              "flex items-center space-x-2 text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors"
            )}
          >
            Code Snippets
          </Link>
          {content}
        </div>
      </div>
    </header>
  );
}
