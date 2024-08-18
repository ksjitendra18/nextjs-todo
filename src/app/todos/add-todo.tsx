"use client";

import { addTodo } from "@/actions/add-todo";
import { useFormStatus } from "react-dom";
import { BiLoaderAlt } from "react-icons/bi";

const AddTodo = () => {
  const { pending } = useFormStatus();

  return (
    <form action={addTodo} className="flex items-center gap-2">
      <input
        placeholder="Add a new todo"
        className="border-2 rounded-md px-2 py-2"
        type="text"
        id="title"
        name="title"
      />
      <button
        className="bg-blue-700 text-white px-5 py-2 rounded-md"
        type="submit"
      >
        {pending ? <BiLoaderAlt size={25} className="animate-spin" /> : "Add"}
      </button>
    </form>
  );
};
export default AddTodo;
