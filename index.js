const core = require('@actions/core')
const { exec } = require('child_process')

const run = async () => {
  const failureMsg = 
    "Pull requests must be rebased on master, and have no merge commits"

  const shCmd = 
  `[ -z "$(git log --oneline origin/master...HEAD --merges)" ] &&
     [ "$(git merge-base origin/master HEAD)" = "$(git rev-parse origin/master)" ]`

  try {
    const cmd = exec(shCmd, (error, stdout, stderr) => {
      if (error)
        core.setFailed(`${failureMsg}: ${error.message}`)
      if (stderr)
        core.setFailed(`${failureMsg}: ${stderr}`)
    })

    // This is probably not needed, but just in case...
    cmd.on('exit', (code) => {
      if (code == 0) return
      core.setFailed(failureMsg)
    })

  } catch (error) {
    core.setFailed(failureMsg + ": " + error)
  }
}

run()
