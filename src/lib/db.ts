import type { Tier } from "./tier";

type UserRow = {
  id: number;
  discord_id: string;
  username: string;
  avatar_url: string | null;
  tier: Tier;
  department: string | null;
  rank: string | null;
  supervisor_id: number | null;
  status: "pending" | "active" | "suspended";
};

function mapUser(row: UserRow): AppUser {
  return {
    id: row.id,
    discordId: row.discord_id,
    username: row.username,
    avatarUrl: row.avatar_url,
    tier: row.tier,
    department: row.department,
    rank: row.rank,
    supervisorId: row.supervisor_id,
    status: row.status,
  };
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function getUserBySessionToken(db: D1Database, token: string): Promise<AppUser | null> {
  const row = await db
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?1 AND s.expires_at > datetime('now')`
    )
    .bind(token)
    .first<UserRow>();
  return row ? mapUser(row) : null;
}

export async function getUserByDiscordId(db: D1Database, discordId: string) {
  const row = await db.prepare(`SELECT * FROM users WHERE discord_id = ?1`).bind(discordId).first<UserRow>();
  return row ? mapUser(row) : null;
}

export async function getUserById(db: D1Database, id: number) {
  const row = await db.prepare(`SELECT * FROM users WHERE id = ?1`).bind(id).first<UserRow>();
  return row ? mapUser(row) : null;
}

export async function createPendingUser(
  db: D1Database,
  profile: { discordId: string; username: string; avatarUrl: string | null }
) {
  const row = await db
    .prepare(
      `INSERT INTO users (discord_id, username, avatar_url) VALUES (?1, ?2, ?3)
       RETURNING *`
    )
    .bind(profile.discordId, profile.username, profile.avatarUrl)
    .first<UserRow>();
  return mapUser(row!);
}

export async function refreshUserProfile(
  db: D1Database,
  id: number,
  profile: { username: string; avatarUrl: string | null }
) {
  await db
    .prepare(`UPDATE users SET username = ?2, avatar_url = ?3, updated_at = datetime('now') WHERE id = ?1`)
    .bind(id, profile.username, profile.avatarUrl)
    .run();
}

export async function createSession(db: D1Database, userId: number): Promise<string> {
  const token = crypto.randomUUID() + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  await db
    .prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?1, ?2, ?3)`)
    .bind(token, userId, expiresAt)
    .run();
  return token;
}

export async function deleteSession(db: D1Database, token: string) {
  await db.prepare(`DELETE FROM sessions WHERE token = ?1`).bind(token).run();
}

export async function getPendingUsers(db: D1Database) {
  const { results } = await db
    .prepare(`SELECT * FROM users WHERE status = 'pending' ORDER BY created_at ASC`)
    .all<UserRow>();
  return results.map(mapUser);
}

export async function getDirectReports(db: D1Database, supervisorId: number) {
  const { results } = await db
    .prepare(`SELECT * FROM users WHERE supervisor_id = ?1 ORDER BY username ASC`)
    .bind(supervisorId)
    .all<UserRow>();
  return results.map(mapUser);
}

export async function getPotentialSupervisors(db: D1Database, minTier: Tier) {
  const tiersAtOrAbove: Record<Tier, Tier[]> = {
    member: ["member", "supervisor", "chief", "staff"],
    supervisor: ["supervisor", "chief", "staff"],
    chief: ["chief", "staff"],
    staff: ["staff"],
  };
  const tiers = tiersAtOrAbove[minTier];
  const placeholders = tiers.map((_, i) => `?${i + 1}`).join(",");
  const { results } = await db
    .prepare(`SELECT * FROM users WHERE tier IN (${placeholders}) AND status = 'active' ORDER BY username ASC`)
    .bind(...tiers)
    .all<UserRow>();
  return results.map(mapUser);
}

export async function approveUser(
  db: D1Database,
  id: number,
  fields: { tier: Tier; department: string | null; rank: string | null; supervisorId: number | null }
) {
  await db
    .prepare(
      `UPDATE users SET status = 'active', tier = ?2, department = ?3, rank = ?4, supervisor_id = ?5, updated_at = datetime('now')
       WHERE id = ?1`
    )
    .bind(id, fields.tier, fields.department, fields.rank, fields.supervisorId)
    .run();
}

export async function denyUser(db: D1Database, id: number) {
  await db.prepare(`DELETE FROM users WHERE id = ?1 AND status = 'pending'`).bind(id).run();
}

export async function updateReport(
  db: D1Database,
  id: number,
  fields: { tier: Tier; department: string | null; rank: string | null; supervisorId: number | null }
) {
  await db
    .prepare(
      `UPDATE users SET tier = ?2, department = ?3, rank = ?4, supervisor_id = ?5, updated_at = datetime('now')
       WHERE id = ?1`
    )
    .bind(id, fields.tier, fields.department, fields.rank, fields.supervisorId)
    .run();
}

export async function setUserStatus(db: D1Database, id: number, status: "active" | "suspended") {
  await db.prepare(`UPDATE users SET status = ?2, updated_at = datetime('now') WHERE id = ?1`).bind(id, status).run();
}

// ---------- LOA requests ----------

type LoaRow = {
  id: number;
  user_id: number;
  supervisor_id: number | null;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  review_note: string | null;
  created_at: string;
  submitter_username?: string;
};

export async function createLoaRequest(
  db: D1Database,
  fields: { userId: number; supervisorId: number | null; startDate: string; endDate: string; reason: string }
) {
  await db
    .prepare(
      `INSERT INTO loa_requests (user_id, supervisor_id, start_date, end_date, reason) VALUES (?1, ?2, ?3, ?4, ?5)`
    )
    .bind(fields.userId, fields.supervisorId, fields.startDate, fields.endDate, fields.reason)
    .run();
}

export async function listLoaRequestsForUser(db: D1Database, userId: number) {
  const { results } = await db
    .prepare(`SELECT * FROM loa_requests WHERE user_id = ?1 ORDER BY created_at DESC`)
    .bind(userId)
    .all<LoaRow>();
  return results;
}

export async function listPendingLoaForSupervisor(db: D1Database, supervisorId: number) {
  const { results } = await db
    .prepare(
      `SELECT l.*, u.username AS submitter_username FROM loa_requests l
       JOIN users u ON u.id = l.user_id
       WHERE l.supervisor_id = ?1 AND l.status = 'pending'
       ORDER BY l.created_at ASC`
    )
    .bind(supervisorId)
    .all<LoaRow>();
  return results;
}

export async function reviewLoaRequest(
  db: D1Database,
  id: number,
  fields: { status: "approved" | "denied"; reviewedBy: number; note: string | null }
) {
  await db
    .prepare(
      `UPDATE loa_requests SET status = ?2, reviewed_by = ?3, review_note = ?4, reviewed_at = datetime('now')
       WHERE id = ?1`
    )
    .bind(id, fields.status, fields.reviewedBy, fields.note)
    .run();
}

// ---------- Resources ----------

type ResourceRow = {
  id: number;
  title: string;
  url: string;
  category: string | null;
  visibility: Tier;
  sort_order: number;
  created_at: string;
};

export async function listVisibleResources(db: D1Database, viewerTier: Tier) {
  const tiersAtOrBelow: Record<Tier, Tier[]> = {
    member: ["member"],
    supervisor: ["member", "supervisor"],
    chief: ["member", "supervisor", "chief"],
    staff: ["member", "supervisor", "chief", "staff"],
  };
  const tiers = tiersAtOrBelow[viewerTier];
  const placeholders = tiers.map((_, i) => `?${i + 1}`).join(",");
  const { results } = await db
    .prepare(`SELECT * FROM resources WHERE visibility IN (${placeholders}) ORDER BY sort_order ASC, title ASC`)
    .bind(...tiers)
    .all<ResourceRow>();
  return results;
}

export async function createResource(
  db: D1Database,
  fields: { title: string; url: string; category: string | null; visibility: Tier; createdBy: number }
) {
  await db
    .prepare(`INSERT INTO resources (title, url, category, visibility, created_by) VALUES (?1, ?2, ?3, ?4, ?5)`)
    .bind(fields.title, fields.url, fields.category, fields.visibility, fields.createdBy)
    .run();
}

export async function deleteResource(db: D1Database, id: number) {
  await db.prepare(`DELETE FROM resources WHERE id = ?1`).bind(id).run();
}
