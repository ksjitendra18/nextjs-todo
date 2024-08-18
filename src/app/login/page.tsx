import Link from "next/link";
import React from "react";
import {} from "react-icons";
import { FaGithub } from "react-icons/fa";
const Login = () => {
  return (
    <>
      <h1 className="text-4xl font-bold text-center my-5">Login</h1>

      <Link
        href="/api/auth/github"
        className="px-5 py-2 bg-black text-white rounded-md flex items-center w-fit mx-auto justify-center gap-2"
      >
        <FaGithub size={30} />
        Login with Github
      </Link>
    </>
  );
};

export default Login;
