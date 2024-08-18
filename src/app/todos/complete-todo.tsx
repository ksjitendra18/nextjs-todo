"use client";

import { completeTodo } from "@/actions/complete-todo";
import { useFormStatus } from "react-dom";
import { BiCheck, BiLoaderAlt } from "react-icons/bi";

const CompleteTodo = ({ todoId }: { todoId: number }) => {
  const { pending } = useFormStatus();

  return (
    <form action={completeTodo} className="flex items-center gap-2">
      <input type="hidden" name="todoId" value={todoId} />
      <button
        className="bg-blue-700 text-white px-2 py-2 rounded-md"
        type="submit"
      >
        <BiCheck size={25} />
      </button>
    </form>
  );
};
export default CompleteTodo;
