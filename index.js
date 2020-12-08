const core = require('@actions/core');
const { exec } = require('child_process');

const runShellCmd = async (command, failureMessage) => {
    return exec(command, (error, stdout, stderr) => {
      let errorMessage = '';
      if (error)
        errorMessage += `${failureMessage}: ${error.message}`;
      if (stderr)
        errorMessage += `\nStandard Error: ${stderr}`;
      if (error || errorMessage)
        core.setFailed(errorMessage);
      core.debug(stdout);
    });
}

const run = async () => {
  const BRANCH = core.getInput('default-branch');
  const MERGES_FAILURE = "Pull requests have no merge commits";
  const BASE_FAILURE = `Pull request must be rebased on ${BRANCH}`;


  let noMergesCmd =
    `output=$(git log --oneline origin/${BRANCH}...HEAD --merges) && [ -z "$output" ] || echo $output`;
  let correctBaseCmd =
    `[ "$(git merge-base origin/${BRANCH} HEAD)" = "$(git rev-parse origin/${BRANCH})" ]`;

  try {
    let results = Array();
    results.push(await runShellCmd(noMergesCmd, MERGES_FAILURE));
    results.push(await runShellCmd(correctBaseCmd, BASE_FAILURE));

    results.forEach(result => {
      result.on('exit', code => {
        if (code != 0)
          core.setFailed('Invalid return code for message');
      });
    });
  } catch (error) {
    core.setFailed(error)
  }
}

run()
