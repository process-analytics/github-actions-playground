# github-actions-playground

Let's play with GitHub Actions!

We use this repository to test and configure GitHub Workflows prior their real usage in repositories of the [Process Analytics organization](https://github.com/process-analytics).

## Non exhaustive list

- [Generate Documentation API](.github/workflows/generate-documentation-api.yml): generate a TypeDoc API documentation and push to github-pages

### Surge deployments

- [Manage Surge Deployments](.github/workflows/manage-surge-deployments.yml): list all surge deployments or let remove a surge domain. Can be used for real maintenance as domains are not always dropped on PR closed (missing events?)
- [Teardown old Surge deployments](.github/workflows/teardown-inactive-surge-deployments.yml): remove deployments older than one month (on demand or every week)
