// The following is adapted from https://github.com/adrianjost/actions-surge.sh-teardown/blob/fc7c144291330755517b28a873139fcc11327cd8/index.js#L17
// released under the MIT license
import stripAnsi from "strip-ansi";
import {execSync} from 'node:child_process'

const surgeCli = 'npx surge';

const executeCmd = command => {
  const result = execSync(command);
  return stripAnsi(result.toString()).trim();
};

export const checkLogin = (surgeToken) => {
  try {
    executeCmd(`${surgeCli} list --token ${surgeToken}`);
    return true;
  } catch (e) {
    return false;
  }
};

// Adapted here to pass the surge token
export const getDeploys = surgeToken => {
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
};

