const core = require('@actions/core');
const github = require('@actions/github');

try {
  // Compute the 'preview url', as built by the surge-preview action
  const repoOwner = github.context.repo.owner.replace(/\./g, '-');
  const repoName = github.context.repo.repo.replace(/\./g, '-');
  const url = `${repoOwner}-${repoName}-${github.context.job}-pr-${github.context.payload.number}.surge.sh`;
  core.setOutput('preview-url', url);

  // the token must be set
  const surgeToken = core.getInput('surge-token');
  if (!surgeToken) {
    core.setOutput("should-run", false);
    return;
  }
  // on close PR, the deployment must exist
} catch (error) {
  core.setFailed(error.message);
}
