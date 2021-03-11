# Trigger GitLab CI

This action triggers a GitLab CI using the Pipeline API.

## Usage
```yaml
name: Trigger GitLab CI
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest

    env:
      ca-bundle: ${{ secrets.GITLAB_CA_BUNDLE }}
      token: ${{ secrets.GITLAB_TRIGGER_TOKEN }}

    strategy:
      fail-fast: false
      matrix:
        refs: ['main',]

    steps:
    - name: Check for secrets
      id: check
      shell: bash
      run: |
        if [ "${{ env.ca-bundle }}" != "" ] && [ "${{ env.token }}" != "" ]
        then
          echo ::set-output name=secrets::'true'
        else
          echo "Do not trigger RQCD CI as at least one of the secrets is missing."
        fi

    - name: Trigger CI Job
      if: ${{ steps.check.outputs.secrets }}
      uses: pjgeorg/gitlab-trigger-ci@v2
      with:
        host: "gitlab.com"
        port: 8443
        ca-bundle: ${{ env.ca-bundle }}
        project-id: 880
        token: ${{ env.token }}
        ref:  ${{ matrix.refs }}
        delay: 30000
```

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
