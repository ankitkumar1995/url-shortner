# COMPLETE URL SHORTENER SYSTEM DESIGN DOCUMENT
## Technical Specifications, Scalability, and Code Blueprints for Enterprise Deployment

---

## SECTION 1 — INTRODUCTION
### 1.1 What is a URL Shortener?
A URL Shortener is a system that translates a long, complex URL into a short, manageable string. When a client makes a GET request to the short string, the system processes a fast redirection, sending the client's browser to the destination URL.

### 1.2 Why Companies Use URL Shorteners
* **User Experience & Brand Trust**: Clean links look professional. Custom domains (e.g., `amzn.to`) increase Click-Through Rates (CTR).
* **Social & SMS Limitations**: Platforms like Twitter (280 characters) and SMS standard format (160 characters) constrain link size.
* **Granular Tracking**: Link shorteners serve as analytical gateways to capture click metadata (device, OS, country).
* **Link Management**: Allows editing destinations dynamically after publication.

### 1.3 Real-World Examples
* **Bitly**: The industry standard for enterprise analytics and branded links.
* **TinyURL**: Simple, anonymous link shortening with classic interface.
* **Dub.co**: Modern, developer-focused, open-source link infrastructure.
* **Rebrandly**: Centered around branded custom domains.

### 1.4 Business Use Cases
* **Omnichannel Marketing**: Attribute conversions to SMS, Email, QR, and social channels.
* **Dynamic Geotargeting**: Route users from the UK to the UK app store, and US users to the US app store using a single short link.
* **Security Scanning**: Intercepting and blocklisting links containing malicious redirects.

### 1.5 Technical Challenges
* **Extreme Read Bias**: Redirects (reads) outnumber creations (writes) by a ratio of $100:1$ to $1,000:1$.
* **Low Latency Budget**: Any redirection delay degrades user experience. Target: Redirection response in $<15\text{ms}$ at the edge.
* **Global Distribution**: Serving redirects instantly to users in Asia, Europe, and America.
* **High-Volume Telemetry Ingestion**: Recording thousands of clicks per second without locking database read paths.

---

## SECTION 2 — FUNCTIONAL REQUIREMENTS
The system implements the following capability checklist:
* **Shorten URL**: Accepts long destination URLs and returns a short, unique code.
* **Redirect URL**: Translates short codes back to long URLs and redirects with HTTP 302.
* **Custom Aliases**: Allows users to define custom paths (e.g., `lnk.cx/blackfriday`).
* **Link Expiration**: Configurable TTL after which the link deactivates.
* **Analytics Logging**: Tracks clicks, IP, GeoIP, referrer, device, browser, and OS.
* **User Accounts & RBAC**: Supports secure signup, sign-in, and Role-Based Access (Admin, Creator, Reader).
* **Public/Private Links**: Links can be protected with passcodes.
* **Dynamic QR Generation**: Vectorized QR code generation corresponding to shortened URLs.
* **Link Editing**: Updates destination URLs without altering the short code.
* **Soft Delete Links**: Deactivates links while preserving their analytical history.
* **Admin Control Center**: Allows admins to audit active users and block spam domains.
* **Bulk Shortening**: Standardized API batches to shorten up to 1,000 URLs in a single call.
* **API Access Hooks**: Developer keys (`x-api-key`) with custom rate-limiting tires.

---

## SECTION 3 — NON-FUNCTIONAL REQUIREMENTS
To guarantee production-grade stability:
* **High Availability**: $99.999\%$ uptime target for redirects. The core redirection path must stay online even if sub-systems (like creation dashboards) go down.
* **Fault Tolerance**: Databases run with automated master failover. Kafka consumer offsets handle restarts gracefully.
* **Reliability & Durability**: Core URL mapping records must never be lost. We configure replication with a target of $99.999999999\%$ durability.
* **Low Latency Execution**: Multi-tier caching guarantees edge response in $<15\text{ms}$.
* **Eventual Consistency**: Analytics aggregations are allowed to be eventually consistent, updating in dashboards within 5-10 seconds of a click.

### 3.1 CAP Theorem Selection
In a network partition scenario, we choose **AP (Availability and Partition Tolerance)** for the redirection path:
* We prefer serving cached redirect mappings (even if slightly out of date) over failing the user's web query.
For the creation path, we choose **CP (Consistency and Partition Tolerance)**:
* We must prevent two users from claiming the same custom alias simultaneously.

### 3.2 System Workload Profile
* **QPS (Query Per Second)**: Highly read-biased.
* **Read-to-Write Ratio**: $100:1$ to $1000:1$.
* Redirection nodes scale horizontally, reading directly from local memory and distributed Redis replicas, bypassing PostgreSQL entirely.

---

## SECTION 4 — CAPACITY ESTIMATION
Let us design the system for $100\text{M}$ Monthly Active Users.

### 4.1 Volumetric Calculations
* **Daily Active Users (DAU)**: $10\text{M}$
* **URL Creations (Writes) per Day**: 
  Assume $1\%$ of users create links daily, with an average of 10 links each:
  $$10,000,000 \times 1\% \times 10 = 1,000,000 \text{ links created/day}$$
* **URL Redirects (Reads) per Day**:
  Assuming a 100:1 read ratio:
  $$1,000,000 \times 100 = 100,000,000 \text{ redirects/day}$$

### 4.2 Query Per Second (QPS)
* **Average Write QPS**:
  $$\text{Write QPS} = \frac{1,000,000}{86,400} \approx 11.57 \text{ writes/sec} \approx 12 \text{ RPS}$$
* **Peak Write QPS (3x)**: $36\text{ RPS}$
* **Average Read QPS**:
  $$\text{Read QPS} = \frac{100,000,000}{86,400} \approx 1,157.4 \text{ redirects/sec} \approx 1,160 \text{ RPS}$$
* **Peak Read QPS (5x)**: $5,800\text{ RPS}$

### 4.3 Storage Estimations (5-Year Projection)
Let's analyze the size of a single URL record in PostgreSQL:
* `id` (BigInt): 8 bytes
* `short_code` (VARCHAR(12)): 12 bytes
* `original_url` (VARCHAR(2048)): 500 bytes (average)
* `user_id` (UUID): 16 bytes
* `created_at` (Timestamp): 8 bytes
* `expires_at` (Timestamp): 8 bytes
* `is_active` (Boolean): 1 byte
* **Total size per record**: $\approx 553\text{ bytes}$ (rounded up to $600\text{ bytes}$ for index and DB overhead).

* **Daily Storage Ingress**:
  $$1,000,000 \times 600 \text{ bytes} \approx 600 \text{ MB/day}$$
* **Annual Storage Ingress**:
  $$600 \text{ MB} \times 365 \approx 219 \text{ GB/year}$$
* **5-Year Cumulative Storage**:
  $$219 \text{ GB} \times 5 \approx 1.095 \text{ TB}$$
* We account for indexing overhead (additional 20%), yielding **$\approx 1.3\text{ TB}$ of storage over 5 years**.

### 4.4 Bandwidth Computations
* **Ingress (Writes)**:
  $$12 \text{ RPS} \times 600 \text{ bytes} = 7.2 \text{ KB/s}$$
* **Egress (Reads)**:
  $$1,160 \text{ RPS} \times 500 \text{ bytes} = 580 \text{ KB/s}$$

### 4.5 Cache Memory Estimation
Following the 80/20 Rule: $80\%$ of redirect requests target $20\%$ of hot links.
* Daily redirects: $100\text{M}$.
* $20\%$ hot redirects: $20\text{M}$ redirects targeting a hot working set.
* Assume unique hot links in cache equal $20\%$ of all URLs generated in a month ($30\text{M}$ links):
  $$\text{Hot working set size} = 30,000,000 \times 20\% = 6,000,000 \text{ links}$$
* **Memory footprint per cached key**:
  Key `url:redirect:{code}` + value `original_url` $\approx 500\text{ bytes}$.
* **Redis RAM Required**:
  $$6,000,000 \times 500 \text{ bytes} = 3 \text{ GB}$$
  Adding a $100\%$ buffer for Redis metadata and connection overhead:
  $$\text{Redis Memory Target} \approx 6 \text{ GB}$$

---

## SECTION 5 — HIGH LEVEL ARCHITECTURE
The system is built as a highly decoupled microservices architecture.

### 5.1 Architecture Diagram
```
                     [ Client / Browser ]
                              │
                     ┌────────┴────────┐
                     ▼                 ▼
             [ DNS Resolution ]  [ Global CDN (Cloudflare Edge) ]
                                       │ (HTTPS, TLS Termination, Edge Cache)
                                       ▼
                              [ API Gateway / WAF ]
                                (Kong / AWS API Gateway)
                                       │
                         ┌─────────────┴─────────────┐
                         ▼ (Read Path: 1160 RPS)      ▼ (Write Path: 12 RPS)
                 [ Redirect Service ]          [ URL Generation Service ]
                         │                           │
         ┌───────────────┼───────────────┐           ├──────────────────┐
         │ (Cache Check) │ (Cache Miss)  │           ▼ (Validate/Save)  ▼ (Invalidate)
         ▼               ▼               ▼     [ PostgreSQL Primary ] ──▶ [ Redis Cache ]
    [ Local L1 ]   [ Redis L2 ]    [ PG Replicas ]   │ (Async Replication)
    (Node Memory)  (ElastiCache)   (Read-Only)       ▼
                                                     ├──────────────────┐
                                                     ▼ (Publish Event)  ▼
                                                 [ Kafka Broker ]   [ ElasticSearch ]
                                                     │ (Consume Event)
                                                     ▼
                                            [ Analytics Service ]
                                                     │
                                                     ▼
                                            [ ClickHouse OLAP ]
                                                     │
                                                     ▼
                                            [ Admin Dashboard ]
```

### 5.2 End-to-End Execution Flow
1. **Redirection Route (GET /:shortCode)**:
   * Client triggers GET request.
   * DNS routes the query to the nearest **CDN Edge Node (Cloudflare)**.
   * If edge cache (L0) misses, the request reaches our **API Gateway**.
   * The request is routed to the **Redirect Service** (built on Fastify).
   * Fastify checks **Local L1 Cache** (in-memory LRU). If missed, it queries **Redis (L2)**.
   * If Redis misses, it reads from a **PostgreSQL Read Replica** and writes back to Redis.
   * Fastify issues an HTTP 302 Found response.
   * Fastify pushes a raw analytics click log to the **Kafka 'link-clicks' topic** asynchronously.
2. **Shortening Route (POST /api/v1/shorten)**:
   * Client posts creation payload to API Gateway.
   * Gateway routes to **URL Service** (NestJS).
   * NestJS validates inputs using Zod, checks user rate limits in Redis, and runs security checks on the long URL using a pre-warmed Bloom filter.
   * A unique ID is generated using a distributed **Snowflake generator** and encoded to **Base62**.
   * Save record to the **PostgreSQL Primary Database**.
   * Warm up **Redis** cache with the new mapping.
   * Indexes metadata to **Elasticsearch** for administrative keyword search.

---

## SECTION 6 — DATABASE DESIGN
We utilize PostgreSQL for relational data, MongoDB for flexible metadata, and Redis for high-speed cache caching.

### 6.1 PostgreSQL Relational DDL
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'creator' CHECK (role IN ('admin', 'creator', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(12) UNIQUE NOT NULL,
    original_url VARCHAR(2048) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    passcode VARCHAR(255),
    qr_code_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    rate_limit_tier VARCHAR(20) DEFAULT 'free' CHECK (rate_limit_tier IN ('free', 'premium', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexing Strategy
CREATE INDEX idx_urls_short_code ON urls (short_code);
CREATE INDEX idx_urls_user_id ON urls (user_id);
CREATE INDEX idx_urls_expiration ON urls (expires_at, is_active);
```

### 6.2 PostgreSQL Scaling Concepts
* **Read Replicas**: To balance the high read-load, we configure 1 primary PostgreSQL database for writes and 3 geographically distributed read replicas.
* **Database Partitioning**: We partition the `urls` table by range on the `created_at` timestamp. Each month gets a dedicated partition. This bounds B-tree index sizes, keeping active write partitions hot in RAM.
* **Sharding**: Once the DB size crosses 2TB, we shard the database horizontally using a consistent hashing algorithm keyed on `short_code`.

### 6.3 MongoDB Campaign Collections
For dynamic marketing tags and retargeting metadata, we use a flexible MongoDB cluster:
```json
{
  "_id": "ObjectId",
  "short_code": "aB34zX",
  "utm_parameters": {
    "source": "facebook",
    "medium": "social",
    "campaign": "summer_sale"
  },
  "targeting_rules": {
    "ios_fallback": "https://apps.apple.com/app/id123",
    "android_fallback": "https://play.google.com/store/app/id123"
  }
}
```

---

## SECTION 7 — SHORT URL GENERATION STRATEGIES
We compare several unique ID generation strategies:

1. **Base62 Encoding**:
   * Encodes auto-incrementing serial IDs or Snowflake IDs to a 62-character alphabet (`0-9, a-z, A-Z`).
   * *Collision Probability*: 0% (Since numbers are unique).
   * *Pros*: Small codes, highly readable, mathematically deterministic.
2. **Random String Generation**:
   * Cryptographically random 6-character selection from Base62 set.
   * *Collision Probability*: Moderate (Birthday Paradox). Requires checking the database on every write.
   * *Cons*: Terrible database write performance at scale due to index lockups.
3. **Snowflake IDs**:
   * Uses a distributed, coordination-free generator to produce unique 64-bit integers.
   * *Structure*: 41-bit timestamp + 10-bit worker node ID + 12-bit sequential counter.
   * *Verdict*: **Best for production**. When paired with Base62 encoding, it allows highly scalable, collision-free, globally distributed code generation.

---

## SECTION 8 — API DESIGN

### 8.1 Create Short URL
* **POST** `/api/v1/shorten`
* **Request Payload**:
```json
{
  "originalUrl": "https://example.com/very/long/path/to/product",
  "customAlias": "custom-alias",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```
* **Response Payload (201 Created)**:
```json
{
  "success": true,
  "data": {
    "shortCode": "custom-alias",
    "shortUrl": "https://lnk.cx/custom-alias",
    "originalUrl": "https://example.com/very/long/path/to/product",
    "expiresAt": "2026-12-31T23:59:59.000Z",
    "createdAt": "2026-05-25T22:20:18.000Z"
  }
}
```

### 8.2 Perform Redirection
* **GET** `/:shortCode`
* **Response Headers**:
  * Status: `302 Found`
  * `Location`: `https://example.com/very/long/path/to/product`
  * `Cache-Control`: `private, max-age=90`

---

## SECTION 9 — REDIRECT FLOW
Redirections utilize a structured multi-layer routing plan:

1. **DNS Lookup**: Route 53 maps the customized shortening domain (`lnk.cx`) to the nearest CDN Edge location (Cloudflare).
2. **CDN Check (L0)**: Cloudflare edge nodes check their cache for the short link mapping. If hit, they issue a 302 redirect directly.
3. **Application Gateway**: Directs the edge cache miss to our application's API Gateway.
4. **L1 Local Cache Lookup**: The Fastify instance checks its local memory LRU cache.
5. **L2 Distributed Cache Lookup**: Queries the Redis Cluster. If hit, it writes back to L1 and returns.
6. **Database Fallback**: Queries PostgreSQL read replicas. If found, it updates Redis and L1, then responds.
7. **Analytics Log**: Pushes click metadata asynchronously to Kafka, and immediately sends the 302 response to the client browser.

### 9.1 Redirection Types: 301 vs 302
* **HTTP 301 (Moved Permanently)**: Browsers cache this permanently. Future clicks do not hit our servers, making click-tracking analytics impossible.
* **HTTP 302 (Found / Temporary Redirect)**: Forces browsers to ping our servers on every click, ensuring 100% telemetry capture.
* *Verdict*: We use HTTP 302 but set a light cache control header (`private, max-age=90`) to prevent immediate double-clicks from flooding the servers.

---

## SECTION 10 — CACHING STRATEGY
Caching is the primary defense system protecting our relational database.

### 10.1 Redis Cache Mechanics
* **Redis Cluster Layout**: Multi-AZ AWS ElastiCache running Redis 7.
* **Cache Key Schema**: `url:redirect:{shortCode}` mapped to the original URL string.
* **Adaptive Cache Expiry (Jitter)**:
  To prevent "Cache Stampedes" where multiple keys expire at the same time, we set cache keys to expire after 24 hours, adding a random jitter of 1 to 4 hours.
  $$\text{TTL} = 86,400 + \text{random}(3600, 14400) \text{ seconds}$$

### 10.2 Cache Invalidation Patterns
* We implement a **Write-Around Caching** strategy:
  * When editing/updating a link's destination, the database is updated, and an invalidation event is pushed to Redis (`DEL url:redirect:{shortCode}`).
  * The key is warmed back up on the next redirect request.

---

## SECTION 11 — ANALYTICS SYSTEM
High-scale click ingestion requires a decoupled, asynchronous log processing pipeline.

```
[Fastify Redirect Service] ──▶ (Push Log) ──▶ [ Kafka Topic: 'link-clicks' ]
                                                      │
                                                      ▼
                                            [ Click Consumer Group ]
                                                      │
                                                      ▼
                                            [ ClickHouse Database ]
```

* **Kafka Ingestion**: Fastify redirect nodes write click events (IP, user-agent, timestamp, code) directly to Kafka.
* **Stream Consumers**: Background Node.js workers consume the Kafka stream, resolve IP addresses to geographical countries via GeoIP, parse user-agents, and batch-insert data into **ClickHouse** in groups of 5,000 records.
* **OLAP Analytics (ClickHouse)**: ClickHouse processes aggregation queries (e.g., "Clicks by Device over the last 30 days") on billions of rows in under 20 milliseconds, keeping relational PostgreSQL databases free from analytical queries.

---

## SECTION 12 — SECURITY
Operating a public URL shortener requires stringent security protocols:

* **Sliding-Window Rate Limiting**: Redis-backed sorted sets enforce strict request limits per IP (e.g., 5 writes/minute, 100 reads/minute).
* **Bloom Filter Malware Detection**: When short links are created, we check the destination domain against a pre-warmed Bloom Filter holding millions of blacklisted domains (Google Safe Browsing datasets).
* **Robust Authentication**: JWT tokens signed using HS256 for user session verification.
* **Database & Web Protections**: Parameterized queries using Prisma to eliminate SQL Injection. String sanitization protects against Cross-Site Scripting (XSS).

---

## SECTION 13 — SCALING STRATEGIES

* **Consistent Hashing**: When scaling Redis caches or database shards, we use consistent hashing rings to ensure adding or removing nodes only affects a small fraction of keys ($1/N$).
* **Geo-Distributed Deployment**: We run application nodes in US-East, EU-West, and AP-South. All regions maintain local read-only PostgreSQL and Redis replicas. All writes are piped back to the primary database in US-East.

---

## SECTION 14 — MESSAGE QUEUES & ASYNC PROCESSING

* **Kafka Partitioning**: The `link-clicks` topic is partitioned using the `shortCode` as the partition key. This guarantees that all clicks for a given link are processed sequentially.
* **BullMQ (Redis-backed)**: Used for discrete, CPU-bound asynchronous tasks:
  * **QR Code Compiler**: Generates high-quality vector QR codes and uploads them to AWS S3.
  * **Verification Pipeline**: Dispatches transactional emails via third-party APIs.

---

## SECTION 15 — MICROSERVICES ARCHITECTURE
The platform is split into six main services:
1. **Auth Service**: Coordinates user login, signup, session validation, and RBAC rules.
2. **URL Service**: Handles short link creation, validation, Bloom filter checks, and DB inserts.
3. **Redirect Service**: Ultra-lightweight Fastify service dedicated to resolving short codes.
4. **Analytics Service**: Consumes Kafka event streams and writes analytical logs to ClickHouse.
5. **Notification Service**: Handles automated email dispatches via BullMQ queues.
6. **QR Service**: Standardizes high-speed vector QR image compilation.

* **Communication Hooks**: Internal communication uses **gRPC** for low-latency RPC queries. High-throughput events are passed asynchronously via **Kafka**.

---

## SECTION 16 — DEVOPS & DEPLOYMENT

### 16.1 Observability Infrastructure
* **Prometheus**: Polls metrics endpoints from our Node.js applications, tracking CPU, Memory, Event Loop Lag, and HTTP QPS.
* **Grafana**: Visualizes Prometheus performance metrics.
* **OpenTelemetry Tracing**: Logs detailed distributed execution traces across the API Gateway, Redirect Service, Redis cluster, and PostgreSQL database.

---

## SECTION 17 — PROJECT STRUCTURE
We design a clean monolithic directory structure that makes it simple to extract individual components into separate microservices as the platform scales.

```
url-shortener/
├── deploy/                     # DevOps, Docker, K8s, and Terraform
├── docs/                       # Architectural specifications
├── prisma/                     # Database migrations & schemas
└── src/
    ├── controllers/            # Request routers and HTTP handlers
    ├── dtos/                   # Zod schema definitions
    ├── middlewares/            # Rate limits & JWT authentication
    ├── queues/                 # BullMQ queues and workers
    ├── repositories/           # Prisma data access layers
    ├── services/               # Core business logic services
    └── utils/                  # Mathematical and Base62 converters
```

---

## SECTION 18 — ARCHITECTURAL DEEP-DIVE FOR SENIOR ENGINEERS

### 18.1 Redis Expert-Level Concepts
* **Single-Threaded Multiplexing**: Redis uses a single-threaded event loop paired with non-blocking I/O multiplexing (`epoll`). While highly efficient, executing slow, CPU-intensive commands (e.g. `KEYS *` or long Lua scripts) blocks all other cache requests.
* **Eviction Policies**: Under heavy memory pressure, we use the `allkeys-lru` (Least Recently Used) eviction policy. This guarantees that hot redirect links are preserved in cache, while old, cold links are evicted.

### 18.2 Node.js Event Loop Considerations
To keep redirect latencies under $15\text{ms}$, we must keep the Node.js event loop unblocked:
* **Avoid Sync Operations**: Never use synchronous file system (`fs.readFileSync`) or cryptographic (`crypto.pbkdf2Sync`) calls in request pipelines.
* **Offload CPU-Bound Tasks**: Offload heavy computational work (e.g. QR code generation, image compression) to BullMQ worker threads or child processes.

### 18.3 Prisma Optimization Techniques
To maximize Prisma ORM performance in high-scale PostgreSQL environments:
* **Use Raw SQL for Batch Inserts**: For large batches, bypass the ORM layer and execute raw SQL queries to avoid excessive query compilation overhead.
* **Connection Pooling**: Carefully tune Prisma's connection pool size relative to database connection limits.
  $$\text{Pool Size} = (\text{CPU Cores} \times 2) + \text{Spindle Count}$$

### 18.4 Elasticsearch Integration
* **Search Acceleration**: While B-Tree indexes in PostgreSQL are highly optimized for direct equality searches (`WHERE short_code = ?`), they perform poorly on fuzzy text searches.
* **Synchronization Pipeline**: PostgreSQL updates are published to Kafka. An Elasticsearch consumer indexes the link's metadata (e.g. custom alias names, descriptions, original URL strings), allowing administrators to search through millions of records with autocomplete and fuzzy-matching support.

---

## SECTION 19 — FRONTEND ARCHITECTURE
* **Next.js & React Server Components**: Next.js Server Components handle structural page rendering and JWT token authorization, ensuring extremely fast page load times.
* **TanStack Query (React Query)**: Manages client-side analytical queries. TanStack Query coordinates background polling, automatically refetches stale charts, and supports optimistic UI updates for instant feedback during link creation.

---

## SECTION 20 — INTERVIEW PREPARATION & SCENARIOS

### 20.1 FAANG Deep Dive: "How do you handle the global, highly popular dynamic link problem?"
* **Scenario**: A celebrity posts a short link on Twitter, generating $100,000$ clicks per second.
* **Solution**:
  1. **CDN Edge Caching**: Enforce strict edge-caching configurations on Cloudflare with a short TTL (e.g. 1 minute). This routes 99% of requests directly through CDN edge nodes.
  2. **L1 Local Cache Backups**: If requests bypass the CDN, Node.js redirect instances serve the mapping from their local, in-memory LRU cache, avoiding database and Redis queries.
  3. **Mutex Locking (Single-Flight)**: On cache misses, only the first request queries the database. Subsequence requests block and wait, preventing database overload.

---

## SECTION 21 — TRADEOFF COMPARISON
* **NestJS vs Express**: NestJS offers a structured, enterprise-grade architecture with built-in dependency injection, but adds minor bootstrapping overhead. Express is lightweight and minimalist, but requires careful project organization.
* **Kafka vs RabbitMQ**: Kafka excels at handling high-throughput, structured streaming data that needs to be replayed. RabbitMQ is a highly flexible message broker ideal for routing discrete jobs to workers with complex routing rules.

---

## SECTION 22 — FAILURE SCENARIOS & MITIGATIONS
* **Failure: ClickHouse Analytics Database Down**:
  * *Mitigation*: Kafka holds log events for up to 7 days by default. Redirections remain active, and clicks are safely buffered in Kafka until ClickHouse recovers.
* **Failure: Redis Cache Cluster Failure**:
  * *Mitigation*: The system automatically switches to PostgreSQL read replicas. API Gateways scale up throttling limits to protect replicas from database collapse.

---

## SECTION 23 — REAL-WORLD PRODUCTION IMPROVEMENTS
* **Consistent Hashing**: Guarantees minimal data migration when resizing Redis cache clusters.
* **Bloom Filters**: Keeps malicious redirect checks extremely fast and memory-efficient.
* **Distributed Locking (Redlock)**: Guarantees that custom brand-alias claims do not result in race conditions.

---

## SECTION 24 — FINAL SUMMARY
For a production-grade URL shortener handling billions of requests:
* **Ingestion Layer**: Cloudflare CDN Edge Cache -> Kong API Gateway -> Fastify Redirect Nodes.
* **Caching & DB**: Redis L2 Caches backed by PostgreSQL Shards.
* **Telemetry**: Decoupled click logging routed through Kafka to ClickHouse OLAP databases.

This architecture ensures a highly scalable, stable, and secure infrastructure capable of handling millions of redirections daily with single-digit millisecond latency.
