const core = require('@actions/core');
const github = require('@actions/github');
const getDeploys = require("./surge-utils");

try {
  // default value
  core.setOutput("should-run", true);

  const payload = github.context.payload;
  // Compute the 'preview url', as built by the surge-preview action
  const repoOwner = github.context.repo.owner.replace(/\./g, '-');
  const repoName = github.context.repo.repo.replace(/\./g, '-');
  const url = `${repoOwner}-${repoName}-${github.context.job}-pr-${payload.number}.surge.sh`;
  core.setOutput('preview-url', url);
  core.info(`Computed preview url: ${url}`);

  // the token must be set
  const surgeToken = core.getInput('surge-token');
  if (!surgeToken) {
    core.setOutput("should-run", false);
  }
  // TODO on close PR, the deployment must exist
  // if(payload.action === 'closed') {
  else {
    core.setSecret(surgeToken);
    core.startGroup('List Surge domains');
    const deploys = getDeploys(surgeToken);
    const domains = deploys.map(deploy => deploy.domain);
    core.info(`Number of domains: ${domains.length}`);
    core.debug(domains);
    core.endGroup();

    const isDomainExist = domains.includes(url);
    core.info(`surge domain exist? ${isDomainExist}`);
    core.setOutput('domain-exist', isDomainExist);
  }
} catch (error) {
  core.setFailed(error.message);
}

