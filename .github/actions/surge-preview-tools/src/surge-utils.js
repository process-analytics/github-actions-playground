// The following is adapted from https://github.com/adrianjost/actions-surge.sh-teardown/blob/fc7c144291330755517b28a873139fcc11327cd8/index.js#L17
// released under the MIT license
// TODO use stripAnsi 7 move to ESM https://github.com/chalk/strip-ansi/releases/tag/v7.0.0
const stripAnsi = require("strip-ansi");
const { execSync } = require("child_process");

const surgeCli = 'npx surge';

function executeCmd(command) {
  const result = execSync(command);
  return stripAnsi(result.toString()).trim();
}

const checkLogin = (surgeToken) => {
  try {
  const surgeLoginOutput = executeCmd(`${surgeCli} list --token ${surgeToken}`);
  console.info('surge login:', surgeLoginOutput);
  return true;
  } catch (e) {
    console.info(e.message);
    return false;
  }
}

// Adapted here to pass the surge token
function getDeploys(surgeToken) {
  const surgeListOutput = executeCmd(`${surgeCli} list --token ${surgeToken}`);
  const lines =
    surgeListOutput
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

exports.getDeploys = getDeploys;
exports.checkLogin = checkLogin;
