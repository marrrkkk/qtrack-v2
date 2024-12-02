"use server"

import { db, users } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { eq, inArray } from "drizzle-orm"

export async function createUser(role: string) {
  try {
    // Get user data from Clerk
    const user = await currentUser()
    if (!user) {
      return { success: false, error: "No user found" }
    }
    
    // Insert into Supabase
    await db.insert(users).values({
      id: user.id,
      name: user.fullName || "",
      email: user.emailAddresses[0].emailAddress,
      role,
      avatarUrl: user.imageUrl,
      createdAt: new Date(), // Use current date and time
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function getUser(userId: string) {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    return user[0] || null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function getUsersByEmails(emails: string[]) {
  try {
    const usersList = await db
      .select({
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(inArray(users.email, emails));
    
    // Convert to a map for easier lookup, now including avatarUrl
    return Object.fromEntries(
      usersList.map(user => [
        user.email, 
        { name: user.name, avatarUrl: user.avatarUrl }
      ])
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return {};
  }
}