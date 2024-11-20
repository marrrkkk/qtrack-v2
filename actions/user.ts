// app/actions/user.ts
"use server"

import { db, users } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function createUser(name: string, role: string) {
  try {

    // Get user data from Clerk
    const user = await currentUser()
    if(!user) return
    
    // Insert into Supabase
    await db.insert(users).values({
      id: user.id,
      name,
      role,
      avatarUrl: user.imageUrl,
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}