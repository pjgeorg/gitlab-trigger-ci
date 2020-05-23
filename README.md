# GitLab trigger CI docker action

This action triggers a GitLab CI using the Pipeline API.

## Inputs

### `url`

**Required** URL of the GitLab instance to issue commands to.

### `cacert`

CA certificate (string) to use for connections to GitLab.

### `project_id`

**Required** GitLab project ID. Project must be publicly accessible.

### `token`

**Required** GitLab CI token. See [GitLab documentation how to add a trigger](https://docs.gitlab.com/ee/ci/triggers/#adding-a-new-trigger).

### `ref`

Trigger GitLab CI pipeline of a specific ref (branch or tag). Default `"master"`.

## Example usage

```yml
uses: pjgeorg/gitlab-trigger-ci@v1
with:
  url: "https://gitlab.com"
  cacert: ${{ secrets.GITLAB_CACERT }}
  project_id: 880
  token: ${{ secrets.GITLAB_TRIGGER_TOKEN }}
  ref: master
```
