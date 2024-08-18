import React from "react";
import AddTodo from "./add-todo";
import { db } from "@/db";
import { getCurrentUser } from "@/utils/get-current-user";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { todos } from "@/db/schema";
import CompleteTodo from "./complete-todo";
import DeleteTodo from "./delete-todo";

const Todos = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }
  const allTodos = await db.query.todos.findMany({
    where: eq(todos.userId, currentUser.id),
    orderBy: desc(todos.createdAt),
  });
  return (
    <>
      <section>
        <h1 className="text-3xl font-bold text-center ">Todos</h1>

        <AddTodo />
      </section>

      {allTodos.filter((todo) => !todo.completed).length > 0 && (
        <section className="my-10">
          <h2 className="text-2xl my-3 font-bold">Your Todos</h2>
          <ul className="flex flex-col gap-4">
            {allTodos
              .filter((todo) => !todo.completed)
              .map((todo) => (
                <li
                  className="border-2 flex items-center justify-between bg-gray-100 shadow-md px-4 py-2 rounded-md"
                  key={todo.id}
                >
                  {todo.title}

                  <div className="flex gap-2">
                    <CompleteTodo todoId={todo.id} />
                    <DeleteTodo todoId={todo.id} />
                  </div>
                </li>
              ))}
          </ul>
        </section>
      )}

      {allTodos.filter((todo) => todo.completed).length > 0 && (
        <section className="my-10">
          <h2 className="text-2xl my-3 font-bold">Completed Todos</h2>
          <ul className="flex flex-col gap-4">
            {allTodos
              .filter((todo) => todo.completed)
              .map((todo) => (
                <li
                  className="border-2 flex items-center justify-between bg-green-600 text-white shadow-md px-4 py-2 rounded-md"
                  key={todo.id}
                >
                  {todo.title}
                  <DeleteTodo todoId={todo.id} />
                </li>
              ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default Todos;
