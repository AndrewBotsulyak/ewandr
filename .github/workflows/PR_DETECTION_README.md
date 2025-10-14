# PR Detection Workflow - Quick Reference

**File:** `.github/workflows/pr-detection.yml`

## Purpose
Automatically detects which applications and libraries are affected by PR changes using NX dependency graph analysis with git-based fallback.

## Triggers
- **When:** PR opened, synchronized, or reopened
- **Target:** `main` branch
- **Runtime:** ~45-90s (with cache) or ~2-3min (without)

## Detection Methods

### Primary: NX Affected
```bash
nx show projects --affected --base=<BASE> --head=<HEAD>
```
- ✅ Accurate dependency analysis
- ✅ Understands project relationships
- ❌ Can fail on config errors

### Fallback: Git Diff
```bash
git diff --name-only <BASE> <HEAD>
```
- ✅ Always works
- ✅ Fast and reliable
- ⚠️ Conservative (lib changes affect ALL clients)

## Workflow Steps

1. **Setup** - Checkout code, setup Node.js, install dependencies
2. **Validate Configs** - Check `playwright.config.ts` and `webpack.config.ts` for syntax errors
3. **Detect Changes** - Run NX or git diff to find affected apps
4. **Extract Metadata** - Identify server changes, remotes, individual apps
5. **Save Results** - Create JSON artifact with all detection data
6. **Comment on PR** - Post human-readable summary

## Outputs

### Step Outputs (for other workflows)
```yaml
steps.detect.outputs.affected_apps       # JSON: ["client-shell", "client_product_details"]
steps.detect.outputs.remotes             # JSON: ["client_product_details"]
steps.detect.outputs.has_server_changes  # boolean string: "true"/"false"
steps.detect.outputs.detection_method    # string: "nx" or "git_diff_fallback"
```

### Artifact
**Name:** `detection-results-pr-{PR_NUMBER}`
**File:** `detection-results.json`
**Retention:** 7 days

**Structure:**
```json
{
  "pr_number": 123,
  "pr_title": "Feature: Add new functionality",
  "affected_apps": ["client-shell", "client_product_details"],
  "affected_remotes": ["client_product_details"],
  "has_server_changes": false,
  "client_shell_affected": true,
  "be_vendure_affected": false,
  "detection_method": "nx",
  "timestamp": "2025-10-14T12:34:56Z"
}
```

## Detection Logic

### Direct App Changes
```
apps/clients/client-shell/  →  affects: client-shell
apps/clients/client_cart/   →  affects: client_cart
```

### Library Changes (Conservative)
```
libs/shared-components/     →  affects: ALL clients
libs/data-access/          →  affects: ALL clients
```

### Backend Changes
```
be-vendure/                 →  has_server_changes: true
be-*/                       →  has_server_changes: true
```

### Remote Apps (Microfrontends)
- Includes: `client_*` apps (except `client-shell`)
- Excludes: `-e2e` test apps

## Performance Optimizations

- ✅ npm cache enabled with explicit dependency path
- ✅ `--prefer-offline` flag (uses cache first)
- ✅ Reduced timeouts: 5min detection, 2min validation
- ✅ Single `find` command for config validation
- ✅ Shallow git fetch (depth=1) with unshallow fallback

## Error Handling

### Git Fetch Chain
1. Try shallow fetch (`depth=1`)
2. If fails → try unshallow
3. If fails → use `HEAD~1` or base SHA

### NX Failure
1. Run NX detection
2. If fails → automatically switch to git diff
3. Always produces a result (never fails completely)

### Config File Errors
1. Validate TypeScript syntax
2. If invalid → backup to `.original`
3. Create stub file with `export default {}`
4. Restore after detection completes

## Usage Example

### Consuming in Another Workflow
```yaml
jobs:
  detect:
    uses: ./.github/workflows/pr-detection.yml

  deploy:
    needs: detect
    runs-on: ubuntu-latest
    steps:
      - name: Download detection results
        uses: actions/download-artifact@v4
        with:
          name: detection-results-pr-${{ github.event.pull_request.number }}

      - name: Deploy affected apps
        run: |
          APPS=$(jq -r '.affected_apps[]' detection-results.json)
          for app in $APPS; do
            echo "Deploying $app"
            # deployment logic here
          done
```

### Reading Step Outputs
```yaml
jobs:
  detect:
    uses: ./.github/workflows/pr-detection.yml

  test:
    needs: detect
    runs-on: ubuntu-latest
    steps:
      - name: Test affected apps
        run: |
          echo "Affected: ${{ needs.detect.outputs.affected_apps }}"
          echo "Method: ${{ needs.detect.outputs.detection_method }}"
```

## Troubleshooting

### No apps detected
- Check if only docs/configs changed (intentional)
- Verify NX workspace configuration

### All apps detected on small change
- Likely git diff fallback was used
- Check for NX errors in workflow logs
- Verify project graph: `npx nx graph`

### Workflow timeout
- Check npm registry availability
- Verify `package-lock.json` is committed
- Review timeout settings (currently conservative)

## Quick Checks

**Verify detection method:**
```
grep "Detection method:" workflow-logs
# Output: nx or git_diff_fallback
```

**Check what's affected:**
```
jq '.affected_apps' detection-results.json
# Output: ["client-shell", "client_product_details"]
```

**Download artifact manually:**
```bash
gh run download <RUN_ID> -n detection-results-pr-123
```

## Configuration

### Change target branch
```yaml
on:
  pull_request:
    branches:
      - main        # change this
      - develop     # or add more branches
```

### Adjust timeouts
```yaml
- name: Install dependencies
  timeout-minutes: 5    # increase if needed

- name: Detect affected apps
  timeout-minutes: 5    # increase for large repos
```

### Modify detection heuristics
Edit the git diff fallback logic in step "Detect affected apps" (lines 51-201)

---

**For detailed documentation, see:** [PR_DETECTION_FLOW.md](./PR_DETECTION_FLOW.md)
