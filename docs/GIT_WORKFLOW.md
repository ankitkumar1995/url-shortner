# GIT & GITHUB ENTERPRISE DEVELOPMENT WORKFLOW BLUEPRINT
## Standardized Collaboration Guide for URL Shortener Platform Development

---

## 1. ARCHITECTURAL PHILOSOPHY
We adopt the **GitFlow branching model** paired with **Conventional Commits** to ensure high-velocity development, complete traceability, safe production deployments, and seamless rollbacks.

### Branch Structure
```
main (Production)
  ▲
  │ [Release Merges & Hotfixes]
  │
release/* ──▶ [Testing & Validation]
  ▲
  │ [Stabilization Merges]
  │
develop (Integration)
  ▲
  ├─ feature/auth-service (Feature Branch)
  ├─ feature/url-shortening (Feature Branch)
  ├─ refactor/prisma-layer (Refactoring Branch)
  └─ fix/redirect-loop (Hotfix/Bugfix Branch)
```

* **`main`**: Represents production-ready code. Directly reflects what is running in live environments. Protected against direct pushes.
* **`develop`**: The primary integration branch. All feature branches merge here first.
* **`feature/*`**: Isolated branches for developing new functional modules.
* **`fix/*` / `bugfix/*`**: Target-oriented branches to resolve bugs found during testing.
* **`hotfix/*`**: Emergency patches created directly from `main` to resolve live production bugs.
* **`release/*`**: Pre-production stabilization branches.

---

## 2. COMMIT MESSAGE STANDARDS
We strictly follow **Conventional Commits (v1.0.0)**. This allows automatic changelog compilation and clear history traversal.

### Commit Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

* **Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `ci`, `chore`.
* **Scopes**: `auth`, `url-shortener`, `cache`, `analytics`, `db`, `devops`.

---

## 3. CORE DEVELOPER WORKFLOW BY MODULE

Below is the step-by-step Git workflow for each implementation section, complete with CLI commands, pull request templates, and merging protocols.

---

### MODULE 1: URL SHORTENING & BASE62 SERVICE

#### 1. Purpose
Implements the core base62 encoder/decoder and short link generation service logic.

#### 2. Recommended Branch
* **Branch Name**: `feature/url-shortening-base62`
* **Why**: Follows the `feature/` namespace rule, clearly stating the scope of work.

#### 3. CLI Git Execution Commands
```bash
# Ensure local develop is synchronized
git checkout develop
git pull origin develop

# Spin up a fresh isolated feature branch
git checkout -b feature/url-shortening-base62

# Stage implementations
git add src/utils/base62.ts src/controllers/url.controller.ts

# Commit atomically with Conventional Commits
git commit -m "feat(url-shortener): implement Base62 encoder and core redirect controller"

# Push feature branch to upstream remote repository
git push -u origin feature/url-shortening-base62
```

#### 4. GitHub Pull Request (PR) Specification
* **PR Title**: `feat(url-shortener): implement Base62 generator and shortening logic`
* **PR Description**:
  ```markdown
  ## Summary
  Implements the mathematical Base62 encoder/decoder utility to map database BigInt sequences to URL-safe alphanumeric strings. Introduces the Redirect controller supporting fast caches and DB fallback strategies.

  ## Changes Made
  - Created `src/utils/base62.ts` for numerical encoding/decoding.
  - Implemented `UrlController.handleRedirect` in `src/controllers/url.controller.ts`.
  - Added unit test validation suite for Base62 logic.

  ## Verification Completed
  - Verified BigInt encoding to string values and back.
  - Verified edge-case conversions (e.g. `0` mapping).
  ```
* **Merge Strategy**: **Squash and Merge**. This compresses micro-commits into a single clean commit on `develop`, keeping history readable.
* **Cleanup Commands**:
  ```bash
  git checkout develop
  git pull origin develop
  git branch -d feature/url-shortening-base62
  git remote prune origin
  ```

---

### MODULE 2: REDIS CACHING & Sliding Window RATE LIMITER

#### 1. Purpose
Implements Redis Cache infrastructure and Express sliding-window rate limiters.

#### 2. Recommended Branch
* **Branch Name**: `feature/redis-cache-rate-limiter`
* **Why**: Explicitly identifies the technical elements integrated.

#### 3. CLI Git Execution Commands
```bash
# Sync work space
git checkout develop
git pull origin develop

# Spin up feature branch
git checkout -b feature/redis-cache-rate-limiter

# Stage changes
git add src/services/redis.service.ts src/middlewares/rate-limiter.ts

# Atomic Commit
git commit -m "feat(cache): implement Redis caching and sliding window rate limiter"

# Push to upstream
git push -u origin feature/redis-cache-rate-limiter
```

#### 4. GitHub Pull Request (PR) Specification
* **PR Title**: `feat(cache): implement Redis service and sliding window rate limiter`
* **PR Description**:
  ```markdown
  ## Summary
  Introduces the centralized Redis cache service to store and manage active URL redirects, and implements a high-performance sliding window rate limiter middleware.

  ## Changes Made
  - Built `RedisService` utilizing the `ioredis` driver.
  - Configured sliding-window rate limiting middleware utilizing Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`).

  ## Verification Completed
  - Confirmed sliding window rate limit blocks queries exceeding limits.
  - Verified cache-hit redirection bypasses DB querying.
  ```
* **Merge Strategy**: **Squash and Merge** to maintain a clean history.
* **Cleanup Commands**:
  ```bash
  git checkout develop
  git pull origin develop
  git branch -d feature/redis-cache-rate-limiter
  git remote prune origin
  ```

---

### MODULE 3: BULLMQ ASYNC PROCESSING

#### 1. Purpose
Integrates background queue management and processing for asynchronous events (e.g. click logging).

#### 2. Recommended Branch
* **Branch Name**: `feature/bullmq-async-processing`

#### 3. CLI Git Execution Commands
```bash
git checkout develop
git pull origin develop
git checkout -b feature/bullmq-async-processing
git add src/queues/analytics.queue.ts
git commit -m "feat(analytics): implement BullMQ ingestion queues and worker threads"
git push -u origin feature/bullmq-async-processing
```

#### 4. Pull Request Specification
* **PR Title**: `feat(analytics): implement BullMQ for click ingestion`
* **PR Description**:
  ```markdown
  ## Summary
  Implements asynchronous click ingestion queues using BullMQ to offload click logging workloads from redirection requests.

  ## Changes Made
  - Created `src/queues/analytics.queue.ts` implementing a Redis-backed queue and asynchronous click processing worker.

  ## Verification
  - Verified click ingestion events are successfully queued and processed in the background.
  ```
* **Merge Strategy**: **Squash and Merge**
* **Cleanup Commands**:
  ```bash
  git checkout develop
  git pull origin develop
  git branch -d feature/bullmq-async-processing
  git remote prune origin
  ```

---

### MODULE 4: PRISMA DATABASE LAYER

#### 1. Purpose
Implements the core PostgreSQL schema and sets up database migrations using Prisma.

#### 2. Recommended Branch
* **Branch Name**: `feature/prisma-db-layer`

#### 3. CLI Git Execution Commands
```bash
git checkout develop
git pull origin develop
git checkout -b feature/prisma-db-layer
git add prisma/schema.prisma
git commit -m "feat(db): configure Prisma schema and postgresql mappings"
git push -u origin feature/prisma-db-layer
```

#### 4. Pull Request Specification
* **PR Title**: `feat(db): define Prisma schema and entity mappings`
* **PR Description**:
  ```markdown
  ## Summary
  Establishes the base PostgreSQL schema using Prisma ORM.

  ## Changes Made
  - Created `prisma/schema.prisma` with User, Url, and ApiKey models.
  - Implemented custom database indexes for performance.
  ```
* **Merge Strategy**: **Squash and Merge**
* **Cleanup Commands**:
  ```bash
  git checkout develop
  git pull origin develop
  git branch -d feature/prisma-db-layer
  git remote prune origin
  ```

---

### MODULE 5: DOCKER ORCHESTRATION

#### 1. Purpose
Configures local development orchestration using Docker Compose.

#### 2. Recommended Branch
* **Branch Name**: `feature/docker-orchestration`

#### 3. CLI Git Execution Commands
```bash
git checkout develop
git pull origin develop
git checkout -b feature/docker-orchestration
git add deploy/docker-compose.yml
git commit -m "feat(devops): configure docker-compose development services stack"
git push -u origin feature/docker-orchestration
```

#### 4. Pull Request Specification
* **PR Title**: `feat(devops): configure Docker Compose orchestration`
* **PR Description**:
  ```markdown
  ## Summary
  Provides local development orchestration config using Docker Compose.

  ## Changes Made
  - Created `deploy/docker-compose.yml` defining PostgreSQL, Redis, Zookeeper, Kafka, and ClickHouse services.
  ```
* **Merge Strategy**: **Squash and Merge**
* **Cleanup**:
  ```bash
  git checkout develop
  git pull origin develop
  git branch -d feature/docker-orchestration
  git remote prune origin
  ```

---

## 4. MERGE STRATEGY RECOMMENDATIONS & WHY
1. **Feature Branches to `develop`**: **Squash and Merge**. Compress feature development commit noise into a single clean semantic commit (e.g. `feat(url-shortener): ...`).
2. **`develop` to `release/*`**: **Create a Merge Commit**. Retains individual feature integration history for regression tracking.
3. **`release/*` to `main`**: **Create a Merge Commit** and **Tag** the merge commit with a semver tag (e.g. `v1.0.0`). Ensures exact point-in-time deployment history.
4. **`hotfix/*` to `main` and `develop`**: **Create a Merge Commit**. Applies critical security/functional patches to both production and development streams immediately.

---

## 5. ROLLBACK STRATEGY
If a production deployment introduces critical issues:
1. **Fast-Revert**: Identify the offending merge commit on `main`, run `git revert -m 1 <commit_hash>` to create a rollback commit, and push it to trigger the automated CI/CD pipeline.
2. **Instant Tag Rollback**: In Kubernetes/EKS, configure the deployment to roll back to the previously tagged Docker image tag (`v0.9.8`), instantly bypassing the broken build without redeploying code.
