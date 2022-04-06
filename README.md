# github-actions-playground

Let's play with GitHub Actions!

We use this repository to test and configure GitHub Workflows prior their real usage in repositories of the [Process Analytics organization](https://github.com/process-analytics).

## Non exhaustive list

- [detect PR type (opened, closed, ...)](.github/workflows/detect-pr-type.yml): log if the PR is closed. To use for surge-preview: don't failOnError when closing PR. Pull Requests created by dependabot don't deploy to surge, but when a contributor is merging the PR, the teardown fails as there is no deployment.
- [execute job on secrets availability](.github/workflows/execute-depending-on-secrets-availability.yml): use in surge deployments to avoid trying to create deployments for external contributors and dependabot (surge token secret not available)
- [fill github draft releases](.github/workflows/fill-gh-draft-release.yml): experiment the release-drafter configuration (used in bpmn-visualization)
- [Generate Documentation API](.github/workflows/generate-documentation-api.yml): generate a TypeDoc API documentation and push to github-pages (for bpmn-visualization)
- [release](.github/workflows/release.yml): run npm version and push branch/tag on a branch with restricted rules (used in bpmn-visualization)
- [workflow dispatch](.github/workflows/workflow-dispatch.yml): run job depending on if the workflow is triggered from the `master` branch or another branch

### Release simulation

[Build a fake demo](.github/workflows/build_demo.yml) and [download the demo](.github/workflows/download_demo.yml) as done by `bpmn-visualization` and `bpmn-visualization-examples`
- on git tag creation, create an artifact attached to a workflow run and send a `repository_dispatch` event
- receive the event and download the artifact attached to the previous workflow run, then create a Pull Request

### Surge deployments

- [Manage Surge Deployments](.github/workflows/manage-surge-deployments.yml): list all surge deployments or let remove a surge domain. Can be used for real maintenance as domains are not always dropped on PR closed (missing events?)
- [Teardown old Surge deployments](.github/workflows/teardown-inactive-surge-deployments.yml): remove deployments older than one month (on demand or every week)

## Extra

- [Dependabot configuration](.github/dependabot.yml): as configured in repository using dependabot to update dependencies
