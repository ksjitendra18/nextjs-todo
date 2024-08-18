"use server";

import { db } from "@/db";
import { todos } from "@/db/schema";
import { getCurrentUser } from "@/utils/get-current-user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addTodo = async (formData: FormData) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const title = formData.get("title");

  await db.insert(todos).values({
    title: title as string,
    userId: currentUser.id,
  });

  revalidatePath("/todos");
};
