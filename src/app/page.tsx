import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center my-5">Todos</h1>
      <Link
        className="bg-blue-600 text-white p-2 rounded-md mx-auto w-fit block"
        href="/todos"
      >
        Get Started
      </Link>
    </>
  );
}
