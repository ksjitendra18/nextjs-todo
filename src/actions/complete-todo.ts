"use server";

import { db } from "@/db";
import { todos } from "@/db/schema";
import { getCurrentUser } from "@/utils/get-current-user";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const completeTodo = async (formData: FormData) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const todoId = formData.get("todoId");

  await db
    .update(todos)
    .set({
      completed: true,
    })
    .where(eq(todos.id, Number(todoId)));

  revalidatePath("/todos");
};
