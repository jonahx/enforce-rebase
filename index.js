const core = require('@actions/core')
const exec = require('@actions/exec')
const { exec } = require('child_process')


const run = async () => {
  const failureMsg = "Pull requests must be rebased on master, and cannot " +
    "contain any merge commits."

  const bashCmd = 
  `[[ -z $(git log --oneline origin/master...HEAD --merges) ]] &&
     [[ "$(git merge-base origin/master HEAD)" = \
     "$(git rev-parse origin/master)" ]]`

  try {
    // const exitCode = await exec.exec('./is_rebased')
    exec(bashCmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`${failureMsg}: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`${failureMsg}: ${stderr}`)
        return
      }
      console.log(`${stdout}`)
    })

    // if (exitCode != 0) {
    //   core.setFailed(failureMsg)
    // }
  } catch (error) {
    core.setFailed(failureMsg + ": " + error)
  }
}

run()
