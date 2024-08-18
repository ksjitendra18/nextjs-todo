import Link from "next/link";
import React from "react";

const Navbar = ({ userIsAuthenticated }: { userIsAuthenticated: boolean }) => {
  return (
    <header className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold">
        Todos
      </Link>

      <nav>
        <ul className="flex items-center gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          {userIsAuthenticated ? (
            <>
              <li>
                <Link href="/todos">Todos</Link>
              </li>
              <li>
                <Link href="/logout">Logout</Link>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
