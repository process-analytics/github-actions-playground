import * as core from '@actions/core';
import * as github from "@actions/github";
import {checkLogin, getDeploys} from "./surge-utils"

try {
  const payload = github.context.payload;
  // Compute the 'preview url', as built by the surge-preview action
  const repoOwner = github.context.repo.owner.replace(/\./g, '-');
  const repoName = github.context.repo.repo.replace(/\./g, '-');
  const url = `https://${repoOwner}-${repoName}-${github.context.job}-pr-${payload.number}.surge.sh`;
  core.setOutput('preview-url', url);
  core.info(`Computed preview url: ${url}`);

  // the token must be set
  const surgeToken = core.getInput('surge-token');
  core.setSecret(surgeToken);
  const isSurgeTokenValid = checkLogin(surgeToken);
  core.info(`surge token valid? ${isSurgeTokenValid}`)
  core.setOutput("surge-token-valid", isSurgeTokenValid);

  let isDomainExist = false;
  if (isSurgeTokenValid) {
    core.startGroup('List Surge domains');
    const deploys = getDeploys(surgeToken);
    const domains = deploys.map(deploy => deploy.domain);
    core.info(`Number of domains: ${domains.length}`);
    core.debug(domains);
    core.endGroup();

    isDomainExist = domains.includes(url);
    core.info(`surge domain exist? ${isDomainExist}`);
  }
  core.setOutput('domain-exist', isDomainExist);

  const canRunSurgeCommand = isSurgeTokenValid && (payload.action !== 'closed' || (payload.action === 'closed' && isDomainExist));
  core.info(`can run surge command? ${canRunSurgeCommand}`)
  core.setOutput("can-run-surge-command", canRunSurgeCommand);
} catch (error) {
  core.setFailed(error.message);
}

