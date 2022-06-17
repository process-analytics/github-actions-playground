const core = require('@actions/core');
const github = require('@actions/github');

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
    const deploys = getDeploys(surgeToken);
    const domains = deploys.map(deploy => deploy.domain);
    core.startGroup('List Surge domains');
    core.info(`Number of domains: ${domains.length}`);
    core.debug(domains);
    core.endGroup();

    const isDomainExist = domains.find(domain => domain === url);
    core.info(`Domain exist? ${isDomainExist}`);
  }
} catch (error) {
  core.setFailed(error.message);
}

// The following is taken from https://github.com/adrianjost/actions-surge.sh-teardown/blob/fc7c144291330755517b28a873139fcc11327cd8/index.js#L17
// released under the MIT license
// TODO move to a dedicated file

const stripAnsi = require("strip-ansi");
// const { exec } = require("child_process");
const { execSync } = require("child_process");

function executeCmd(command) {
  // return new Promise((resolve, reject) => {
  //   exec(command, function(error, stdout) {
  //     error
  //       ? reject(error)
  //       : resolve(stripAnsi(stdout).trim());
  //   });
  // });
    const result = execSync(command);
    return stripAnsi(result.stdout).trim()
}

// Adapted here to pass the surge token
function getDeploys(surgeToken) {
  const surgeListOutput = executeCmd(`npx surge list --token ${surgeToken}`);
  const lines = stripAnsi(surgeListOutput)
    .trim()
    .split("\n")
    .map(l => l.trim().replace(/ {3,}/g, "  "));
  return lines.map(line => {
    const deploy = line.split("  ").map(a => a.trim());
    const [id, domain] = deploy[0].split(" ");
    const [, timestamp, provider, host, plan] = deploy;
    return {
      id,
      domain,
      timestamp,
      provider,
      host,
      plan,
      line
    };
  });
}
