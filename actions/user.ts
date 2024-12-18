"use server"

import { db, users } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { eq, inArray } from "drizzle-orm"

export async function createUser(fullName: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "No user found" };
    }
    
    await db.insert(users).values({
      id: user.id,
      name: fullName,
      email: user.emailAddresses[0].emailAddress,
      avatarUrl: user.imageUrl,
      createdAt: new Date(),
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
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
    console.log("Querying for emails:", emails);
    // Convert emails to lowercase for comparison
    const lowerEmails = emails.map(email => email.toLowerCase());
    const usersList = await db
      .select()
      .from(users)
      .where(inArray(users.email, lowerEmails));
    
    console.log("Raw database result:", usersList);
    
    return Object.fromEntries(
      usersList.map(user => [
        user.email, 
        { 
          name: user.name,
          avatarUrl: user.avatarUrl,
          id: user.id
        }
      ])
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return {};
  }
}