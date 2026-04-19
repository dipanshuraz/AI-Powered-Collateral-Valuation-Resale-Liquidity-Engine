# Documents and persistence

## Do you need a database?

For this Next.js flow, **no database is required** for a working demo:

- **Form fields** are held in React state and posted to `/api/estimate` as JSON.
- **Uploads** are **client-only**: the UI tracks `File` lists for papers and photos, but only **counts** (`collateral_uploads_meta`) are sent to the API so the valuation engine can nudge confidence. The binary files never leave the browser unless you add storage.

## If you need real file storage later

| Approach | When to use |
|----------|-------------|
| **Object storage (S3, R2, Supabase Storage)** | Production: presigned uploads, durable URLs, works with any app server. |
| **IndexedDB** | Large files stay on-device; good for offline or privacy-first prototypes without a backend bucket. |
| **Postgres + BYTEA** | Usually worse than object storage for blobs; use metadata in SQL and files in object storage instead. |

**Recommendation:** keep **metadata** (counts, optional hashes, user id) in a **SQL DB** if you add accounts; store **blobs** in **object storage**, not in the database.
