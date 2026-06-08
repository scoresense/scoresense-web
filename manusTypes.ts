import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, diagnostics, appointments, newsletter, blogPosts, Lead, Diagnostic, Appointment, InsertLead, InsertDiagnostic, InsertAppointment, Newsletter, InsertNewsletter, BlogPost, InsertBlogPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new lead and associated diagnostic
 */
export async function createLeadWithDiagnostic(
  leadData: InsertLead,
  diagnosticData: Omit<InsertDiagnostic, 'leadId'>
): Promise<{ lead: Lead; diagnostic: Diagnostic }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Insert lead first
    const leadInsert = await db.insert(leads).values(leadData).$returningId();
    const leadId = Number(leadInsert[0]!.id);

    // Insert diagnostic with leadId
    const diagnosticInsert = await db.insert(diagnostics).values({
      ...diagnosticData,
      leadId,
    }).$returningId();
    const diagnosticId = Number(diagnosticInsert[0]!.id);

    // Fetch and return the created records
    const createdLead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    const createdDiagnostic = await db.select().from(diagnostics).where(eq(diagnostics.id, diagnosticId)).limit(1);

    return {
      lead: createdLead[0]!,
      diagnostic: createdDiagnostic[0]!,
    };
  } catch (error) {
    console.error("[Database] Failed to create lead with diagnostic:", error);
    throw error;
  }
}

/**
 * Create a new lead from appointment form
 */
export async function createLeadFromAppointment(
  leadData: InsertLead,
  appointmentData: Omit<InsertAppointment, 'leadId'>
): Promise<{ lead: Lead; appointment: Appointment }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const leadInsert = await db.insert(leads).values(leadData).$returningId();
    const leadId = Number(leadInsert[0]!.id);

    const appointmentInsert = await db.insert(appointments).values({
      ...appointmentData,
      leadId,
    }).$returningId();
    const appointmentId = Number(appointmentInsert[0]!.id);

    const createdLead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    const createdAppointment = await db.select().from(appointments).where(eq(appointments.id, appointmentId)).limit(1);

    return {
      lead: createdLead[0]!,
      appointment: createdAppointment[0]!,
    };
  } catch (error) {
    console.error("[Database] Failed to create lead from appointment:", error);
    throw error;
  }
}

/**
 * Get all leads with optional filters
 */
export async function getAllLeads(filters?: {
  status?: string;
  source?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    let query: any = db.select().from(leads);

    if (filters?.status) {
      query = query.where(eq(leads.status, filters.status as any));
    }
    if (filters?.source) {
      query = query.where(eq(leads.source, filters.source as any));
    }

    const result = await query
      .orderBy(desc(leads.createdAt))
      .limit(filters?.limit || 50)
      .offset(filters?.offset || 0);

    return result;
  } catch (error) {
    console.error("[Database] Failed to get leads:", error);
    throw error;
  }
}

/**
 * Get lead by ID with diagnostic
 */
export async function getLeadWithDiagnostic(leadId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const lead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (!lead.length) return null;

    const diagnostic = await db.select().from(diagnostics).where(eq(diagnostics.leadId, leadId)).limit(1);

    return {
      lead: lead[0]!,
      diagnostic: diagnostic[0] || null,
    };
  } catch (error) {
    console.error("[Database] Failed to get lead with diagnostic:", error);
    throw error;
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(leadId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(leads).set({ status: status as any }).where(eq(leads.id, leadId));
  } catch (error) {
    console.error("[Database] Failed to update lead status:", error);
    throw error;
  }
}

/**
 * Subscribe email to newsletter
 */
export async function subscribeNewsletter(data: InsertNewsletter): Promise<Newsletter> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Try to insert, if email exists, update status to subscribed
    await db.insert(newsletter).values(data).onDuplicateKeyUpdate({
      set: { status: 'subscribed', updatedAt: new Date() },
    });

    const subscribed = await db.select().from(newsletter).where(eq(newsletter.email, data.email)).limit(1);
    return subscribed[0]!;
  } catch (error) {
    console.error("[Database] Failed to subscribe newsletter:", error);
    throw error;
  }
}

/**
 * Get all published blog posts (paginated)
 */
export async function getPublishedPosts(limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
      .offset(offset);
    
    return posts;
  } catch (error) {
    console.error("[Database] Failed to get blog posts:", error);
    throw error;
  }
}

/**
 * Get blog post by slug
 */
export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const post = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
      .limit(1);
    
    return post[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get post by slug:", error);
    throw error;
  }
}

/**
 * Get blog posts by category
 */
export async function getPostsByCategory(category: string, limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.category, category as any), eq(blogPosts.status, "published")))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
      .offset(offset);
    
    return posts;
  } catch (error) {
    console.error("[Database] Failed to get posts by category:", error);
    throw error;
  }
}

/**
 * Create blog post (admin only)
 */
export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(blogPosts).values({
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
    });
    
    return result;
  } catch (error) {
    console.error("[Database] Failed to create blog post:", error);
    throw error;
  }
}

/**
 * Update blog post (admin only)
 */
export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(blogPosts).set({
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
    }).where(eq(blogPosts.id, id));
  } catch (error) {
    console.error("[Database] Failed to update blog post:", error);
    throw error;
  }
}

/**
 * Delete blog post (admin only)
 */
export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete blog post:", error);
    throw error;
  }
}
