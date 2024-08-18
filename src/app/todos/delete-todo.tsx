"use client";

import { deleteTodo } from "@/actions/delete-todo";
import { useFormStatus } from "react-dom";
import { BiTrash } from "react-icons/bi";

const DeleteTodo = ({ todoId }: { todoId: number }) => {
  const { pending } = useFormStatus();

  return (
    <form action={deleteTodo} className="flex items-center gap-2">
      <input type="hidden" name="todoId" value={todoId} />
      <button
        className="bg-red-700 text-white px-2 py-2 rounded-md"
        type="submit"
      >
        <BiTrash size={25} />
      </button>
    </form>
  );
};
export default DeleteTodo;
