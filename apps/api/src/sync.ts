import type { Context } from 'hono'
import type { Env, PushRequest, SyncDocument, SyncSetting } from './types'
import { getUserById, pullChanges, pushChanges } from './db'
import { checkSyncRateLimit, getEffectivePlan } from './plan'

type SyncContext = Context<{ Bindings: Env, Variables: { userId: string } }>

/**
 * LWW compares raw client-supplied timestamps, so a device whose clock runs ahead
 * would pin a future update_datetime and silently drop every later edit from every
 * device until wall time catches up. Values beyond this window fall back to server now.
 */
const FUTURE_TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000
const MAX_DOCUMENTS_PER_PUSH = 2000
const MAX_SETTINGS_PER_PUSH = 500
const MAX_DOCUMENT_BYTES = 2 * 1024 * 1024

function clampTimestamp(value: unknown, now: number): number {
  const time = typeof value === `number` && Number.isFinite(value) && value > 0 ? value : now
  return time > now + FUTURE_TIMESTAMP_TOLERANCE_MS ? now : time
}

function isValidDocument(doc: SyncDocument): boolean {
  return Boolean(doc)
    && typeof doc.id === `string` && doc.id.length > 0
    && typeof doc.title === `string`
    && typeof doc.content === `string`
}

function normalizeDocument(doc: SyncDocument, now: number): SyncDocument {
  return {
    ...doc,
    parentId: typeof doc.parentId === `string` ? doc.parentId : null,
    history: Array.isArray(doc.history) ? doc.history : [],
    createDatetime: clampTimestamp(doc.createDatetime, now),
    updateDatetime: clampTimestamp(doc.updateDatetime, now),
    deleted: Boolean(doc.deleted),
  }
}

function normalizeSetting(setting: SyncSetting, now: number): SyncSetting {
  return { ...setting, updatedAt: clampTimestamp(setting.updatedAt, now) }
}

async function enforceSyncRateLimit(c: SyncContext): Promise<Response | null> {
  const userId = c.get(`userId`)
  const user = await getUserById(c.env.DB, userId)
  if (!user)
    return c.json({ error: `not_found` }, 404)

  const plan = getEffectivePlan(user.plan, user.plan_expires_at)
  const rate = await checkSyncRateLimit(c.env.DB, userId, plan)
  if (!rate.allowed) {
    return c.json({
      error: `rate_limit_exceeded`,
      plan,
      limit: rate.limit,
      retryAfterSec: rate.retryAfterSec,
      upgradeRequired: plan === `free`,
    }, 429)
  }
  return null
}

export async function pullHandler(c: SyncContext) {
  const blocked = await enforceSyncRateLimit(c)
  if (blocked)
    return blocked

  const userId = c.get(`userId`)
  const sinceRaw = c.req.query(`since`)
  const since = Number.parseInt(sinceRaw ?? `0`, 10)
  const cursor = Number.isFinite(since) && since > 0 ? since : 0

  const { documents, settings, maxCursor } = await pullChanges(c.env, userId, cursor)
  return c.json({ documents, settings, cursor: maxCursor })
}

export async function pushHandler(c: SyncContext) {
  const blocked = await enforceSyncRateLimit(c)
  if (blocked)
    return blocked

  const userId = c.get(`userId`)

  let body: PushRequest
  try {
    body = await c.req.json<PushRequest>()
  }
  catch {
    return c.json({ error: `invalid_body` }, 400)
  }

  const rawDocuments = Array.isArray(body.documents) ? body.documents : []
  const rawSettings = Array.isArray(body.settings) ? body.settings : []

  if (rawDocuments.length > MAX_DOCUMENTS_PER_PUSH || rawSettings.length > MAX_SETTINGS_PER_PUSH) {
    return c.json({
      error: `payload_too_large`,
      maxDocuments: MAX_DOCUMENTS_PER_PUSH,
      maxSettings: MAX_SETTINGS_PER_PUSH,
    }, 413)
  }

  const invalid = rawDocuments.find(doc => !isValidDocument(doc))
  if (invalid)
    return c.json({ error: `invalid_document`, id: typeof invalid?.id === `string` ? invalid.id : null }, 400)

  const oversized = rawDocuments.find(
    doc => new TextEncoder().encode(doc.content).byteLength > MAX_DOCUMENT_BYTES,
  )
  if (oversized)
    return c.json({ error: `document_too_large`, id: oversized.id, maxBytes: MAX_DOCUMENT_BYTES }, 413)

  const invalidSetting = rawSettings.find(
    setting => !setting || typeof setting.key !== `string` || setting.key.length === 0,
  )
  if (invalidSetting)
    return c.json({ error: `invalid_setting` }, 400)

  const now = Date.now()
  const documents = rawDocuments.map(doc => normalizeDocument(doc, now))
  const settings = rawSettings.map(setting => normalizeSetting(setting, now))

  const { documents: mergedDocs, settings: mergedSettings, maxCursor } = await pushChanges(
    c.env,
    userId,
    documents,
    settings,
  )
  return c.json({ documents: mergedDocs, settings: mergedSettings, cursor: maxCursor })
}
