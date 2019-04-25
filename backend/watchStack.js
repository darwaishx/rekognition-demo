/*

STACK WATCHER UTILITY SCRIPT

After submitting a createStack / updateStack, use this function
to watch the operation until it completes. Logs output nicely
to the console and returns once the update/create is complete.

*/

const AWS = require('aws-sdk');
const CF = new AWS.CloudFormation();

module.exports = async function watchUntilCompletion(stackName) {
  process.stdout.write('\x1b[?1049h');

  function reset() {
    process.stdout.write('\x1b[?1049l');
  }

  try {
    await new Promise((resolve, reject) => {
      async function check() {
        let stack;
        try {
          stack = await CF.describeStacks({ StackName: stackName }).promise();
        } catch (e) {
          setTimeout(check, 1000);
          return;
        }

        const status = stack.Stacks[0].StackStatus;
        // console.log(status);

        if (/IN_PROGRESS/.test(status)) {
          const resources = await CF.describeStackResources({ StackName: stackName }).promise();
          process.stdout.write('\x1b[1;1H\x1b[J');

          const res = resources.StackResources;

          const longestName = Math.max(...res.map(r => r.LogicalResourceId.length));
          function pad(x, len) {
            return x + ' '.repeat(len - x.length);
          }

          const colours = {
            CREATE_IN_PROGRESS: '33',
            CREATE_FAILED: '31;1',
            CREATE_COMPLETE: '32',
            DELETE_IN_PROGRESS: '33',
            DELETE_FAILED: '31;1',
            DELETE_COMPLETE: '31',
            DELETE_SKIPPED: '36',
            UPDATE_IN_PROGRESS: '33',
            UPDATE_FAILED: '31;1',
            UPDATE_COMPLETE: '32'
          };

          function colour(x) {
            return `\x1b[${colours[x]}m${x}\x1b[0m`;
          }

          process.stdout.write(res.map(r => {
            return pad(r.LogicalResourceId, longestName) + '  ' + colour(r.ResourceStatus);
          }).join('\n') + '\n\n' + status);


          setTimeout(check, 1000);
          return;
        }

        if ([ 'UPDATE_COMPLETE', 'CREATE_COMPLETE' ].includes(status)) {
          resolve();
        } else {
          reject(status);
        }
      }
      check();
    });
  } catch (e) {
    reset();
    throw e;
  }

  reset();
};
