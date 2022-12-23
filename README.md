# github-actions-playground

Let's play with GitHub Actions!

We use this repository to test and configure GitHub Workflows prior their real usage in repositories of the [Process Analytics organization](https://github.com/process-analytics).

GitHub pages environment generated by this repository
- Home: https://process-analytics.github.io/github-actions-playground/
- Typedoc API: https://process-analytics.github.io/github-actions-playground/api/

## Miscellaneous

- [fill github draft releases](.github/workflows/fill-gh-draft-release.yml): experiment the release-drafter configuration (used in bpmn-visualization)
- [Generate Documentation API](.github/workflows/generate-documentation-api.yml): generate a TypeDoc API documentation and push to github-pages (for bpmn-visualization)
- [Slack send message](.github/workflows/slack-send-message.yml): send a message to a Slack channel or user
- [Workflow concurrency](.github/workflows/workflow-concurrency.yml): avoid to have more than 1 workflow run at a time
- [Workflow dispatch](.github/workflows/workflow-dispatch.yml): run job depending on if the workflow is triggered from the `main` branch or another branch

### Release simulation

#### `bpmn-visualization`

Simulate `bpmn-visualization` release, assets generation and companion repositories updates

The [Release of bpmn-visualization](.github/workflows/release-bpmn_visualization.yml) workflow runs `npm version` and pushes branch/tag on a branch with restricted rules (used in bpmn-visualization).

Then, you can run a [dedicated workflow](.github/workflows/post-release-upload-demo-archive-and-trigger-companion-repositories-update.yml) builds a fake demo, attaches it as an artifact
and sends a `repository_dispatch` event to simulate notification of companion repositories as done in `bpmn-visualization`.

**NOTE**: in the bpmn-visualization repository, this workflow is triggered automatically.

The event is received by the repository which triggers workflows (simulate what happen in companion repositories)
- [bpmn-visualization-examples repository](.github/workflows/post-release-update_bpmn_visualization_version_in_Examples_repo.yml): download the artifact attached to the previous workflow run, then create a Pull Request
- [bpmn-visualization-R repository](.github/workflows/post-release-update_bpmn_visualization_version_in_R_repo.yml): update bpmn-visualization assets an create a Pull Request

#### BPMN Visualization - R package

The [Release of R package](.github/workflows/release-R.yml) workflow update the `README.md` file and the `DESCRIPTION` file, commit the modification, and pushes branch/tag on a branch with restricted rules (used in [bpmn-visualization-R](https://github.com/process-analytics/bpmn-visualization-R)).

### Surge deployments

- [Surge preview for Pull Request](.github/workflows/surge-preview-for-pr.yml): create/teardown a surge deployment when a new Pull Request is created/closed  
- [Manage Surge Deployments](.github/workflows/surge-manage-deployments.yml): list all surge deployments or let remove a surge domain. Can be used for real maintenance as domains are not always dropped on PR closed (missing events?)
- [Teardown old Surge deployments](.github/workflows/surge-teardown-inactive-deployments.yml): remove deployments older than one month (on demand or every week)

## Extra

- [Dependabot configuration](.github/dependabot.yml): as configured in repository using dependabot to update dependencies


## Test to update the README of https://github.com/process-analytics/bpmn-visualization-R

The following simulates the content of the `README.md` file of [bpmn-visualization-R](https://github.com/process-analytics/bpmn-visualization-R) repository. This content is updated automatically during the release process.

#### Install _BPMN Visualization - R Package_ from GitHub

To install a dedicated version (available versions can be found in the [GitHub releases page](https://github.com/process-analytics/bpmn-visualization-R/releases)), run:
```r
devtools::install_github("process-analytics/bpmn-visualization-R@v3.0.5")
```