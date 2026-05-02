# DevFlow — What I Built & Why

A self-hosted CI/CD pipeline dashboard. Connect a GitHub repo, define steps, push code — the pipeline executes in Docker and streams logs live to your browser.

---

## Architecture Overview

```
GitHub Push
    │
    ▼
POST /api/webhook  ←─── HMAC signature verified
    │
    ▼
Run created (status: pending) in MongoDB
    │
    ▼
Go runner polls MongoDB every 5s
    │
    ▼
Pulls Pipeline config → spins up Docker containers per step
    │
    ▼
Each log line → POST /api/run/:id/logs → Server → WebSocket → Browser
    │
    ▼
Run status updated (running → success / failed)
```

---

## Tech Stack & Why Each Was Chosen

### React + Vite + TypeScript (Frontend)
**What:** UI framework for building the dashboard.  
**Why React:** Component-based — each page (Projects, Runs, RunDetail) is a self-contained piece with its own state. Vite replaces Create React App — it's faster, leaner, and uses native ES modules.  
**Why TypeScript:** Catches bugs at compile time. When you define `type Run`, every file that uses it knows exactly what shape to expect — no runtime "undefined is not a function" surprises.

### React Router (`react-router-dom`)
**What:** Client-side routing — switches between pages without reloading.  
**Why:** Without it, every URL change would hit the server. React Router intercepts navigation, matches the path to a component, and renders it instantly. The `useParams` hook extracts `:id` from the URL.

### Tailwind CSS
**What:** Utility-first CSS framework.  
**Why:** Instead of writing separate CSS files, you apply classes directly in JSX (`bg-zinc-900 border border-zinc-800`). Fast to iterate, consistent spacing/color scales, no naming conventions to invent.

### Bun
**What:** JavaScript runtime (replaces Node.js).  
**Why:** Faster startup, built-in TypeScript support, and a fast package manager. Also has native WebSocket support that Hono uses directly.

### Hono
**What:** Web framework for the API server (like Express but faster).  
**Why:** Minimal, type-safe, and works natively with Bun. Routing is simple: `app.get('/path', handler)`. Also has built-in WebSocket support via `hono/bun` which avoids needing a separate ws library.

### MongoDB + Mongoose
**What:** NoSQL database + ODM (Object Document Mapper).  
**Why MongoDB:** Schema-flexible — a Run document can have an empty logs array that grows over time. No migrations needed.  
**Why Mongoose:** Adds schemas and validation on top of MongoDB. Defines exactly what a `Project`, `Pipeline`, and `Run` document looks like, and validates before saving.

**Collections:**
| Collection | Purpose |
|---|---|
| `projects` | Connected GitHub repos + webhook secrets |
| `pipelines` | Step configs per project (Docker image, commands) |
| `runs` | Individual execution records with status and logs |

### Go (Runner)
**What:** The job executor — a separate service that polls MongoDB and runs pipeline steps.  
**Why Go:** Built for concurrency. Go's goroutines are lightweight threads — in future, you can run multiple pipelines in parallel with minimal code. Also compiles to a single binary, making it easy to deploy.

**Key Go concepts used:**

#### `context.WithTimeout`
```go
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
```
Every MongoDB or Docker operation gets a deadline. If it takes longer than 10 seconds, Go cancels it automatically. Without this, a hanging DB call would block the runner forever.

#### `bson.D`
```go
bson.D{{Key: "status", Value: "pending"}}
```
BSON (Binary JSON) is MongoDB's wire format. `bson.D` is an ordered document — a list of key-value pairs. Used for filters and `$set` update operations.

#### `bufio.Scanner`
```go
scanner := bufio.NewScanner(logReader)
for scanner.Scan() {
    line := scanner.Text()
}
```
Reads the Docker log stream line by line. Without it you'd get raw bytes — Scanner splits them into human-readable lines.

#### `select` with channels
```go
select {
case err := <-errCh:
case <-statusCh:
}
```
Go's way of waiting on multiple events. `ContainerWait` returns two channels — one for errors, one for the container finishing. `select` blocks until either fires. This is Go's concurrency model in action.

### Docker SDK for Go
**What:** Programmatic Docker control — same as running `docker run` but from code.  
**Why:** The runner needs to spin up containers dynamically based on pipeline config. The SDK calls the Docker daemon directly without shelling out.

**Flow per step:**
```
ContainerCreate → ContainerStart → ContainerLogs → ContainerWait → ContainerRemove
```
Each step gets a fresh container — isolated, clean, no state leaks between steps.

### WebSockets
**What:** Persistent two-way connection between browser and server.  
**Why not regular HTTP polling:** HTTP is request-response — the browser would need to ask "any new logs?" every second. WebSockets keep the connection open and push logs the moment they arrive.

**Flow:**
```
Go runner → POST /api/run/:id/logs
Server → saves log to DB + sends to ws.send(log)
Browser → ws.onmessage fires → appends to logs state → React re-renders
```

### GitHub Webhooks + HMAC SHA-256
**What:** GitHub calls your server when code is pushed.  
**Why HMAC:** Anyone on the internet can POST to your `/api/webhook`. HMAC verification proves the request actually came from GitHub by checking a signature generated with a shared secret.

```
signature = HMAC-SHA256(request_body, webhook_secret)
```
If the signatures match → the request is genuine.

### Docker Compose
**What:** Defines and runs multi-container apps with one command.  
**Why:** Instead of starting mongo, server, and runner in three terminals with three different commands and environment variables, `docker-compose up` starts everything in the right order with the right config.

**`depends_on`** ensures mongo starts before server, and server starts before runner.  
**Named volumes** (`mongo_data`) persist MongoDB data across container restarts.  
**Internal DNS** — containers talk to each other by service name (`mongo:27017`, `server:3000`) instead of IP addresses.

---

## Patterns Worth Remembering

### Environment Variables
- Go: `os.Getenv("MONGODB_URI")`
- Bun/Node: `Bun.env.MONGODB_URI`
- Vite/React: `import.meta.env.VITE_API_URL` (must be prefixed with `VITE_`)

### Why the runner is a separate service
The runner uses Go's Docker SDK to create containers — this is CPU/IO intensive work. Keeping it separate from the Node API means a slow pipeline doesn't block your API from responding. Separation of concerns.

### Why `defer cancel()` in Go
Context cancellation prevents resource leaks. If you create a context with a timeout but never cancel it, Go keeps a goroutine alive waiting for that timeout even if the operation already finished. `defer cancel()` runs cancel when the surrounding function returns, always.

### Why `omitempty` only on `_id`
`omitempty` tells BSON to skip a field when encoding if it's the zero value. On `_id` it means "let MongoDB generate the ID". On other fields it would skip required data — a `status: ""` would silently not be saved.

---

## What's Left Before Production

- [ ] Build the React frontend (`bun run build`) and serve it via nginx
- [ ] Add the client as a service in `docker-compose.yml`
- [ ] Set real domain in `client/.env.production`
- [ ] Set strong `MONGO_PASSWORD` in `.env`
- [ ] Add nginx reverse proxy for SSL termination
- [ ] Set up a VPS (DigitalOcean / Hetzner) and run `docker-compose up -d`
