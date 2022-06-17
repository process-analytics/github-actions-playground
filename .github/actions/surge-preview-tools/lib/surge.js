// The following is adapted from https://github.com/adrianjost/actions-surge.sh-teardown/blob/fc7c144291330755517b28a873139fcc11327cd8/index.js#L17
// released under the MIT license

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

module.exports = getDeploys;
