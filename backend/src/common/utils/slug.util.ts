/**
 * Generate a URL-safe slug from an arbitrary string. Falls back to a short
 * random suffix for inputs that produce an empty slug (e.g. Arabic-only names).
 */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || `item-${Math.random().toString(36).slice(2, 8)}`;
}
