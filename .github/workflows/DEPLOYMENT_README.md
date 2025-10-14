# Manual Deployment Workflow - Quick Reference

**File:** `.github/workflows/deployment.yml`

## Purpose
Manually deploys applications detected by PR Change Detection workflow to AWS infrastructure (S3, CloudFront, ECR, Lightsail).

## Trigger
- **Type:** Manual (`workflow_dispatch`)
- **Required Inputs:**
  - `pr_number` - PR number containing detection results
  - `deploy_remotes` - Whether to deploy microfrontends (default: true)
  - `deploy_server` - Whether to deploy server apps (default: true)

## Architecture Overview

```
PR Detection Artifact
         ↓
  Load Detection Results
         ↓
    ┌────┴────┐
    ↓         ↓
Remotes    Server Apps
(S3/CF)    (ECR/Lightsail)
    ↓         ↓
    └────┬────┘
         ↓
   Service Restart
```

## Job Flow

### 1. load-detection-results
**Purpose:** Download and parse PR detection results artifact

**What it does:**
- Downloads `detection-results-pr-{NUMBER}` artifact via GitHub API
- Extracts affected apps, remotes, and server changes
- Provides outputs for downstream jobs

**Outputs:**
- `affected-apps` - All affected applications
- `affected-remotes` - Microfrontend apps to deploy
- `has-server-changes` - Whether server apps changed
- `client_shell_affected` - Client shell needs update
- `be_vendure_affected` - Backend needs update

### 2. build-and-deploy-remotes
**Purpose:** Build and deploy microfrontend applications to CDN

**Conditions:**
- `deploy_remotes == true`
- `affected-remotes != []`

**What it does:**
- Builds each remote app using Docker + NX
- Generates unique version tag: `{SHA}-{TIMESTAMP}`
- Uploads to S3 at two locations:
  - `s3://{BUCKET}/{APP}/{VERSION}/` (versioned, long cache)
  - `s3://{BUCKET}/{APP}/latest/` (latest, short cache)
- Updates module federation manifest (`mf-manifest.prod.json`)
- Invalidates CloudFront cache for manifest and latest

**Key Concept:** Module federation allows loading remote apps dynamically

### 3. build-and-push-server
**Purpose:** Build server applications and push Docker images to ECR

**Conditions:**
- `deploy_server == true`
- `has-server-changes == true`

**Matrix Strategy:** `['client-shell', 'be-vendure']`

**What it does:**
- Checks if specific app in matrix is affected
- Builds application using NX
- Generates unique image tag: `pr-{PR}-{RUN}-{SHA}`
- Builds Docker image using `CI_CD/ecr-{APP}.sh` script
- Pushes to ECR repository: `ewandr/{APP}`
- Verifies image was pushed successfully
- Cleans up old ECR images (keeps last 5)

### 4. update-server-configuration
**Purpose:** Update Lightsail server's `.env.production` with new image tags

**Depends on:** `build-and-push-server` success

**What it does:**
- Downloads existing `.env.production` from Lightsail via SSH
- Updates only affected service tags:
  - `CLIENT_SHELL_TAG={NEW_TAG}` (if affected)
  - `BE_VENDURE_TAG={NEW_TAG}` (if affected)
- Preserves existing values for unaffected services
- Updates ECR registry configuration
- Creates atomic backup before applying
- Uploads new config to server

**Key Concept:** Selective updates prevent unnecessary service restarts

### 5. pull-latest-images
**Purpose:** Pull new Docker images on Lightsail server

**Depends on:** `update-server-configuration` success

**What it does:**
- Logs into AWS ECR on Lightsail
- Determines which services need new images
- Runs `docker-compose pull {SERVICES}` with updated tags
- Verifies images were downloaded

### 6. cleanup-server-docker
**Purpose:** Clean up old Docker images on Lightsail to save disk space

**Depends on:** `pull-latest-images` success

**What it does:**
- For each app (client-shell, be-vendure):
  - Lists all images sorted by creation date
  - Keeps last 5 images, removes older ones
- Prunes dangling images
- Cleans build cache (keeps 2GB)
- Checks disk usage and warns if > 80%

### 7. restart-lightsail-services
**Purpose:** Restart services to use new Docker images

**Matrix Strategy:** `['client-shell', 'be-vendure']`

**Complex Conditions:**
- **be-vendure** restarts if:
  - It was affected AND `deploy_server == true`
- **client-shell** restarts if:
  - It was directly affected AND `deploy_server == true`, OR
  - Any remote apps changed AND `deploy_remotes == true`

**What it does:**
- Stops service: `docker-compose stop {APP}`
- Removes old container: `docker-compose rm -f {APP}`
- Starts with new image: `docker-compose up -d --no-deps {APP}`
- Verifies container is running
- Performs HTTP health check (if domain configured)

**Key Concept:** client-shell restarts for remote changes to load new manifest

### 8. deployment-summary
**Purpose:** Generate human-readable deployment summary

**Always runs** (even on partial failures)

**What it does:**
- Creates markdown summary in GitHub Actions UI
- Lists deployed applications by category
- Shows restart reasons for each service
- Provides statistics (total apps, remotes, servers)
- Reports final deployment status

## Key Concepts

### Image Tagging Strategy
```
pr-{PR_NUMBER}-{RUN_NUMBER}-{COMMIT_SHA}
```
Example: `pr-123-42-abc123def456...`

**Benefits:**
- Unique per deployment
- Traceable to PR and commit
- Allows rollback by changing tag in `.env.production`

### Conditional Deployment
- Jobs skip automatically if no changes detected
- Can selectively deploy remotes OR servers OR both
- Optimizes deployment time and reduces risk

### Module Federation Flow
1. Remote apps built and uploaded to CDN
2. Manifest updated with new remote URLs
3. client-shell restarts and loads updated manifest
4. New remotes available to users

### Selective Service Restart
- Only affected services restart
- Independent deployment of remotes vs servers
- Minimizes downtime

## Common Scenarios

### Scenario 1: Only Remote Apps Changed
```
deploy_remotes: true
deploy_server: true (but no server changes detected)
```
**Result:**
1. Remotes build and deploy to S3/CloudFront
2. Manifest updates
3. client-shell restarts (to load new remotes)
4. be-vendure skips (no changes)

### Scenario 2: Only Backend Changed
```
deploy_remotes: true (but no remotes affected)
deploy_server: true
```
**Result:**
1. Remote jobs skip
2. be-vendure builds, pushes to ECR
3. Config updates with new be-vendure tag
4. be-vendure restarts
5. client-shell skips (no changes)

### Scenario 3: Everything Changed
```
deploy_remotes: true (with affected remotes)
deploy_server: true (with server changes)
```
**Result:**
1. All remotes build and deploy
2. All server apps build and push
3. Both services restart

### Scenario 4: Deploy Only Specific Part
```
deploy_remotes: true
deploy_server: false
```
**Result:**
- Only remotes deploy, server jobs skip entirely

## Quick Checks

### Check deployed image tags
```bash
ssh user@lightsail "cat ~/ewandr/.env.production | grep _TAG="
```

### Verify running containers
```bash
ssh user@lightsail "cd ~/ewandr && docker-compose ps"
```

### Check which image is running
```bash
ssh user@lightsail "docker inspect --format='{{.Config.Image}}' {CONTAINER_ID}"
```

### Download detection results
```bash
gh run download {RUN_ID} -n detection-results-pr-{PR_NUMBER}
cat detection-results.json | jq '.'
```

## Troubleshooting

### Artifact not found
**Symptom:** `load-detection-results` fails with "No artifact found"

**Cause:** PR detection workflow didn't run or failed

**Solution:**
1. Check PR has detection workflow run
2. Verify workflow completed successfully
3. Ensure artifact name matches: `detection-results-pr-{NUMBER}`

### Service not restarting
**Symptom:** Service marked as affected but doesn't restart

**Cause:** Conditional logic skipped restart

**Solution:**
1. Check both toggles: `deploy_remotes` and `deploy_server`
2. Verify detection results show app as affected
3. Review restart job conditions in logs

### Docker pull fails
**Symptom:** `pull-latest-images` fails

**Causes:**
- ECR login expired
- Image tag doesn't exist in ECR
- Network issues

**Solution:**
1. Verify image was pushed: `aws ecr describe-images --repository-name ewandr/{APP}`
2. Check tag matches in `.env.production`
3. Verify ECR credentials in secrets

### Container fails to start
**Symptom:** Container exits immediately after restart

**Causes:**
- Application error in new code
- Missing environment variables
- Port conflicts

**Solution:**
1. Check logs: `docker-compose logs {APP}`
2. Verify .env.production has all required variables
3. Test image locally before deployment

### Disk space full
**Symptom:** Docker operations fail with "no space left"

**Solution:**
1. Run manual cleanup on Lightsail
2. Adjust cleanup thresholds in `cleanup-server-docker`
3. Consider increasing disk size

## Performance Notes

- **Parallel Execution:** Remotes and servers build in parallel
- **Selective Deployment:** Only affected apps deploy
- **Matrix Strategy:** Multiple apps deploy simultaneously
- **Typical Times:**
  - Load detection: ~30s
  - Build remotes: ~3-5min per app (parallel)
  - Build servers: ~5-10min per app (parallel)
  - Deploy + restart: ~2-3min

## Security

### Secrets Used
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `AWS_REGION` / `AWS_ACCOUNT_ID` - AWS configuration
- `ECR_REPOSITORY_PREFIX` - ECR naming
- `CDN_BUCKET` / `CDN_DISTRIBUTION_ID` - CloudFront/S3
- `LIGHTSAIL_SSH_KEY` - SSH private key
- `LIGHTSAIL_HOST` / `LIGHTSAIL_USER` - Server access
- `PRODUCTION_DOMAIN` - Health check endpoint (optional)

### Best Practices
- SSH keys cleaned up after use
- Temporary files removed
- Read-only permissions on source code
- Atomic config updates with backups

## Manual Rollback

If deployment fails, rollback by updating `.env.production`:

```bash
# 1. SSH to server
ssh user@lightsail

# 2. Edit .env.production
cd ~/ewandr
nano .env.production

# 3. Change tag to previous version
CLIENT_SHELL_TAG=pr-122-41-oldsha123...
BE_VENDURE_TAG=pr-122-41-oldsha123...

# 4. Pull old images
docker-compose pull

# 5. Restart services
docker-compose up -d
```

---

**For detailed workflow implementation, see:** [deployment.yml](./deployment.yml)
**For PR detection details, see:** [PR_DETECTION_README.md](./PR_DETECTION_README.md)