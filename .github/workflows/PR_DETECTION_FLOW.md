# PR Detection Workflow Documentation

## Overview

The **PR Change Detection** workflow automatically detects which applications and libraries are affected by changes in a pull request. It uses NX's intelligent dependency graph analysis with a fallback to git-based file detection.

**Workflow File:** `.github/workflows/pr-detection.yml`

---

## Trigger Conditions

The workflow runs automatically when:

- **Event:** Pull request
- **Target Branch:** `main` (configurable via `on.pull_request.branches`)
- **PR Types:**
  - `opened` - When a new PR is created
  - `synchronize` - When new commits are pushed to an existing PR
  - `reopened` - When a closed PR is reopened

---

## Permissions

The workflow requires the following GitHub permissions:

- `contents: read` - Read repository contents
- `pull-requests: write` - Post comments on PRs
- `issues: write` - Update PR comments (PRs are issues internally)

---

## Environment Variables

```yaml
NODE_VERSION: '20'           # Node.js version for setup
NX_NO_CLOUD: true           # Disable NX Cloud features
NX_PREFER_TS_NODE: true     # Use ts-node for TypeScript execution
```

---

## Workflow Steps

### 1. Checkout Repository
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```
- Checks out the repository with full git history
- `fetch-depth: 0` ensures all commits are available for comparison

### 2. Setup Node.js (10 min timeout)
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
```
- Installs Node.js version 20
- Enables npm caching with explicit cache dependency path
- Speeds up subsequent runs

### 3. Install Dependencies (10 min timeout)
```yaml
- name: Install dependencies
  timeout-minutes: 10
  run: npm ci --legacy-peer-deps
```
- Clean install of all dependencies
- Uses `--legacy-peer-deps` for compatibility with older peer dependencies
- Timeout protects against hanging installations

### 4. Validate Configuration Files (5 min timeout)
```yaml
- name: Validate configuration files
  timeout-minutes: 5
```

**Purpose:** Pre-validates TypeScript configuration files to prevent NX graph errors

**Process:**
1. Finds all `playwright.config.ts` files
2. Finds all `webpack.config.ts` files
3. For each file:
   - Validates TypeScript syntax with `tsc --noEmit --skipLibCheck`
   - If validation fails:
     - Creates backup: `file.original`
     - Replaces with stub: `export default {};`
     - Logs GitHub warning

**Why?** Syntax errors in config files can crash NX's dependency graph analysis. This step temporarily replaces broken files to allow NX to run.

### 5. Detect Affected Apps (10 min timeout) ⭐ CORE STEP
```yaml
- name: Detect affected apps
  id: detect
  timeout-minutes: 10
```

This is the primary detection logic with sophisticated fallback mechanisms.

#### 5.1 Find Base and Head Commits

**For Pull Requests:**
```bash
BASE_REF="${{ github.event.pull_request.base.ref }}"  # Dynamic base branch
```

**Git Fetch Strategy (with fallbacks):**

1. **Attempt 1:** Shallow fetch of base branch
   ```bash
   git fetch --no-tags --prune --depth=1 origin "+refs/heads/${BASE_REF}:refs/remotes/origin/${BASE_REF}"
   ```

2. **Attempt 2 (if #1 fails):** Unshallow the repository
   ```bash
   git fetch --no-tags --prune --unshallow
   ```

3. **Attempt 3 (if #2 fails):** Use HEAD~1 or base SHA as fallback
   ```bash
   BASE="$(git rev-parse HEAD~1 2>/dev/null || echo "${{ github.event.pull_request.base.sha }}")"
   ```

**Result:**
- `BASE` = Merge base commit (common ancestor)
- `HEAD` = Current PR head commit

#### 5.2 NX Affected Detection (Primary Method)

**Command:**
```bash
npx -y nx show projects --affected --base="$BASE" --head="$HEAD" --select=projects
```

**Success Criteria:**
- Exit code = 0
- Output is not empty

**If successful:**
- Sets `DETECTION_METHOD="nx"`
- Converts output to JSON array format
- Handles both space-separated and newline-separated project lists

#### 5.3 Git Diff Fallback (Secondary Method)

**Triggered when:**
- NX command exits with non-zero code, OR
- NX returns empty results

**Process:**
1. Get list of changed files:
   ```bash
   git diff --name-only "$BASE" "$HEAD"
   ```

2. Check specific application directories:
   - `apps/clients/client-shell/` → adds `client-shell`
   - `apps/clients/client_*/` → adds matching `client_*` apps

3. Check library changes:
   - `libs/client-shell/` → adds `client-shell`
   - `libs/*` (any lib) → **adds ALL clients** (conservative approach)

4. Sets `DETECTION_METHOD="git_diff_fallback"`

**Heuristic Logic:**
- Direct app changes → only that app affected
- Library changes → ALL apps potentially affected (safe default)
- Uses directory existence checks before scanning

#### 5.4 Determine Server Changes

```bash
git diff --name-only "$BASE" "$HEAD" | grep -q '^be-'
```
- Checks if any backend files changed (files starting with `be-`)
- Sets `HAS_SERVER_CHANGES` boolean flag

#### 5.5 Extract Remote Microfrontends

**Purpose:** Identify which microfrontend apps (not the shell) are affected

**Filter Criteria:**
- Include: apps matching `client_*` pattern
- Exclude: `client-shell` (the shell/host app)
- Exclude: apps ending in `-e2e` (test apps)

**Result:** `REMOTES_JSON` array of microfrontend apps

#### 5.6 Write Step Outputs

Outputs are written in multiline heredoc format for safety:
```bash
{
  echo "affected_apps<<EOF"
  echo "$AFFECTED_JSON"
  echo "EOF"
  echo "remotes<<EOF"
  echo "$REMOTES_JSON"
  echo "EOF"
  echo "has_server_changes=$HAS_SERVER_CHANGES"
  echo "detection_method=$DETECTION_METHOD"
} >> "$GITHUB_OUTPUT"
```

**Available for subsequent steps:**
- `steps.detect.outputs.affected_apps` - JSON array of affected apps
- `steps.detect.outputs.remotes` - JSON array of affected microfrontends
- `steps.detect.outputs.has_server_changes` - Boolean flag
- `steps.detect.outputs.detection_method` - Method used (nx or git_diff_fallback)

### 6. Restore Configuration Files
```yaml
- name: Restore configuration files
  if: always()  # Runs even if previous steps fail
```

**Purpose:** Restore original config files that were backed up in step 4

**Process:**
1. Find all `.original` files
2. Restore each: `mv file.original file`
3. Remove temporary JS files created by validation step
4. Clean up `module-federation.config.js` and `webpack.config.js` temp files

**Why `if: always()`?** Ensures cleanup happens even if detection fails

### 7. Debug Outputs
```yaml
- name: Debug outputs
```

Logs step outputs for troubleshooting:
- `affected_apps` array
- `remotes` array
- String lengths
- Helps diagnose empty or malformed output issues

### 8. Check for Server Changes
```yaml
- name: Check for server changes
  id: check-server
```

**Logic:**
Uses `jq` to check if `client-shell` or `be-vendure` are in affected apps:
```bash
jq -e '.[] | select(. == "client-shell" or . == "be-vendure")'
```

**Output:**
- `check-server.outputs.has-changes` - Boolean string ("true" or "false")

### 9. Check Individual Apps
```yaml
- name: Check individual apps
  id: check-apps
```

**Purpose:** Create boolean flags for specific critical apps

**Outputs:**
- `client-shell-affected` - Is client-shell app affected?
- `be-vendure-affected` - Is be-vendure backend affected?

**Note:** Uses consistent hyphenated naming (not underscores)

### 10. Save Detection Results
```yaml
- name: Save detection results
```

**Purpose:** Create a comprehensive JSON artifact with all detection metadata

**Process:**
1. Collect all outputs from previous steps
2. Validate JSON arrays (fallback to `[]` if invalid)
3. Validate detection method (fallback to `"unknown"`)
4. Build JSON file using `jq` with proper escaping

**Output File:** `detection-results.json`

**JSON Structure:**
```json
{
  "pr_number": 123,
  "pr_title": "Feature: Add new functionality",
  "pr_url": "https://github.com/org/repo/pull/123",
  "base_sha": "abc123...",
  "head_sha": "def456...",
  "timestamp": "2025-10-14T12:34:56Z",
  "affected_apps": ["client-shell", "client_product_details"],
  "affected_remotes": ["client_product_details"],
  "has_server_changes": false,
  "client_shell_affected": true,
  "be_vendure_affected": false,
  "detection_method": "nx"
}
```

**Key Improvements:**
- Uses `jq -n` with `--arg` and `--argjson` for safe value passing
- PR title handled directly without nested escaping
- Boolean conversions handled by jq
- Validates output JSON before proceeding

### 11. Upload Detection Results
```yaml
- name: Upload detection results
```

**Pre-flight Checks:**
- Verifies `detection-results.json` exists
- Logs file size
- Shows preview of first 20 lines

### 12. Upload Artifact
```yaml
- name: Upload artifact
  uses: actions/upload-artifact@v4
```

**Configuration:**
- **Name:** `detection-results-pr-{PR_NUMBER}`
- **Path:** `detection-results.json`
- **Retention:** 7 days

**Purpose:** Persist detection results for use by other workflows or manual deployment

### 13. Comment on PR
```yaml
- name: Comment on PR
  uses: actions/github-script@v7
```

**Purpose:** Post human-readable detection summary to PR

**Comment Format:**
```markdown
## 🔍 Change Detection Results

✅ NX detection  (or ⚠️ Fallback method used)

**Affected Applications:**
- client-shell
- client_product_details

**Server Changes:** ✅ Yes (or ❌ No)
**Remote Apps:** 1 affected

---
*This detection result has been saved and can be used for manual deployment.*
*Artifact: `detection-results-pr-123`*
```

**Features:**
- Dynamic badge based on detection method
- Lists all affected apps
- Highlights server changes
- Links to artifact for downstream use

---

## Detection Method Comparison

### NX Affected Detection (Primary)

**Pros:**
- ✅ Accurate dependency graph analysis
- ✅ Understands project relationships
- ✅ Detects transitive dependencies
- ✅ Respects NX configuration

**Cons:**
- ❌ Can fail if project graph has errors
- ❌ Requires valid NX workspace configuration
- ❌ May fail on config file syntax errors

**Use Cases:**
- Standard PRs with valid code
- Monorepo with well-defined dependencies

### Git Diff Fallback (Secondary)

**Pros:**
- ✅ Always works (no dependencies on NX)
- ✅ Simple file-based logic
- ✅ Fast execution

**Cons:**
- ❌ Conservative (may over-report affected apps)
- ❌ Doesn't understand dependency relationships
- ❌ Any lib change → all apps affected

**Use Cases:**
- NX graph errors
- Config file syntax errors
- Emergency fallback

---

## Error Handling & Resilience

### Timeouts
- **Install:** 10 minutes (prevents hanging npm installs)
- **Validation:** 5 minutes (prevents infinite TypeScript checks)
- **Detection:** 10 minutes (prevents hanging NX operations)

### Fallback Chain
1. NX detection → 2. Git diff detection → 3. Always succeeds with some result

### Config File Handling
1. Validate → 2. Backup broken files → 3. Create stubs → 4. Run NX → 5. Restore originals

### Git Fetch Handling
1. Shallow fetch → 2. Unshallow → 3. Use HEAD~1 → 4. Use base SHA

### JSON Validation
- All JSON outputs validated before use
- Fallback to empty arrays `[]` on invalid JSON
- Fallback to `"unknown"` for missing detection method

---

## Output Artifacts

### Step Outputs (for workflow consumption)
- `affected_apps` - JSON array
- `remotes` - JSON array
- `has_server_changes` - boolean string
- `detection_method` - string enum

### GitHub Artifact (for external consumption)
- **File:** `detection-results.json`
- **Name:** `detection-results-pr-{PR_NUMBER}`
- **Retention:** 7 days
- **Use Case:** Manual deployment, audit trail, downstream workflows

### PR Comment (for human consumption)
- Visual summary with badges
- Affected apps list
- Server change indicator
- Artifact reference link

---

## Common Scenarios

### Scenario 1: Changing a Client App
**Changed Files:** `apps/clients/client_product_details/src/app.tsx`

**Result:**
- `affected_apps`: `["client_product_details"]`
- `remotes`: `["client_product_details"]`
- `has_server_changes`: `false`

### Scenario 2: Changing a Shared Library
**Changed Files:** `libs/shared-components/src/Button.tsx`

**Result (Git Fallback):**
- `affected_apps`: `["client-shell", "client_product_details", "client_cart", ...]` (all clients)
- `remotes`: `["client_product_details", "client_cart", ...]` (all except shell)
- `has_server_changes`: `false`

### Scenario 3: Changing Backend
**Changed Files:** `be-vendure/src/api/users.ts`

**Result:**
- `affected_apps`: `["be-vendure"]`
- `remotes`: `[]`
- `has_server_changes`: `true`

### Scenario 4: Config File Syntax Error
**Changed Files:** `webpack.config.ts` (has syntax error)

**Flow:**
1. Validation step detects error
2. Backs up to `webpack.config.ts.original`
3. Creates stub file
4. NX runs successfully with stub
5. Original restored after detection

---

## Monitoring & Debugging

### Check Detection Method
Look for log line:
```
🔍 Detection method: nx
```
or
```
🔍 Detection method: git_diff_fallback
```

### Verify NX Success
Look for:
```
✅ Nx detection successful!
```

### Check Fallback Trigger
Look for:
```
🔄 Nx failed (RC=1) or returned empty. Falling back to git diff analysis...
```

### Debug Outputs Section
```
=== DEBUG OUTPUTS ===
Apps output: '["client-shell"]'
Remotes output: '[]'
```

### JSON Validation
```
✅ Valid JSON created
```
or
```
❌ Invalid JSON created, showing raw content:
```

---

## Maintenance Notes

### Modifying Detection Logic

**To add new app pattern:**
1. Update git fallback logic in step 5
2. Add pattern check to `client_*` loop or create new loop
3. Test with both NX and fallback methods

**To change detection heuristics:**
1. Modify library change logic (currently conservative)
2. Consider impact on deployment safety
3. Document changes in this file

### Adding New Output Fields

1. Add to step 5 outputs (`$GITHUB_OUTPUT`)
2. Add to step 9 individual checks (if needed)
3. Add to step 10 JSON generation
4. Update this documentation
5. Update consuming workflows

### Updating Dependencies

- NX version changes may affect `show projects --affected` command syntax
- jq updates are rare but verify JSON processing still works
- actions/checkout and actions/setup-node should use latest v4

---

## Integration with Other Workflows

This workflow is designed to be consumed by:

1. **Deployment Workflows**
   - Download artifact: `detection-results-pr-{PR_NUMBER}`
   - Parse JSON to determine what to deploy
   - Use `affected_apps` or `remotes` arrays

2. **Testing Workflows**
   - Read step outputs via `needs.detect-changes.outputs.affected_apps`
   - Run tests only for affected apps
   - Skip unchanged apps

3. **Manual Deployments**
   - Download artifact from GitHub UI
   - Use JSON file to inform deployment decisions
   - Reference PR number for traceability

---

## Troubleshooting

### Issue: No apps detected but files changed
**Cause:** NX might have filtered out non-source changes (e.g., docs, configs)
**Solution:** Check `git diff` output in logs. May be intentional if only docs changed.

### Issue: All apps detected on small change
**Cause:** Fallback method triggered due to NX failure
**Solution:**
1. Check for NX errors in logs
2. Verify project graph is valid: `npx nx graph`
3. Check for config file syntax errors

### Issue: Workflow times out
**Cause:** npm install hanging or NX taking too long
**Solution:**
1. Check npm registry availability
2. Verify package-lock.json is committed
3. Consider increasing timeout (currently 10 min)

### Issue: PR comment not posted
**Cause:** Missing permissions or GitHub API error
**Solution:**
1. Verify `pull-requests: write` permission
2. Check GitHub API status
3. Look for error in github-script step logs

### Issue: Invalid JSON in artifact
**Cause:** Special characters in PR title or malformed step outputs
**Solution:**
1. Check "Debug variables" section in logs
2. Verify jq validation passed
3. PR title is now safely handled with `--arg`, should not fail

---

## Security Considerations

- Workflow uses `GITHUB_TOKEN` with limited permissions
- No secrets are exposed in artifacts or PR comments
- Step outputs sanitized through jq validation
- Config file restoration ensures no persistent changes to repository

---

## Performance Optimization

- npm caching enabled (speeds up 50-80%)
- Shallow git fetch for base branch (faster than full history)
- Config validation runs in parallel for different file types
- JSON operations use jq (fast C implementation)

---

## Version History

See git history for detailed changes. Major updates:
- Initial implementation with NX detection
- Added git diff fallback mechanism
- Improved error handling and restoration
- Added comprehensive timeouts
- Standardized naming conventions
- Enhanced JSON validation and PR title handling