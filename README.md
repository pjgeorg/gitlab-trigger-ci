# GitLab trigger CI JavaScript action

This action triggers a GitLab CI using the Pipeline API.

## Inputs

### `host`

**Required** Host running the GitLab CI instance to issue commands to.

### `port`

**Required** Host port to connect to.

### `ca-bundle`

CA bungle (string) to use for connections to GitLab.

### `project-id`

**Required** GitLab project ID. Project must be publicly accessible.

### `token`

**Required** GitLab CI token. See [GitLab documentation how to add a trigger](https://docs.gitlab.com/ee/ci/triggers/#adding-a-new-trigger).

### `ref`

Trigger GitLab CI pipeline of a specific ref (branch or tag). Default: `"master"`.

### `delay`

Time to wait before re-checking status of GitLab CI job status in ms. Default: 30000

## Example usage

```yml
uses: pjgeorg/gitlab-trigger-ci@v2
with:
  host: "gitlab.com"
  port: 8443
  ca-bundle: ${{ secrets.GITLAB_CA_BUNDLE }}
  project-id: 880
  token: ${{ secrets.GITLAB_TRIGGER_TOKEN }}
  ref: master
  delay: 30000
```
