/*

CLOUDFORMATION STACK UPDATER HELPER

Async functino which updates or creates a stack, and waits for completion

Takes stack name, template (as a JS object) and input parameters

The performUpdate.USE_PREVIOUS is a magic sumbol which says to use
the previous value already in the template.

*/

const AWS = require('aws-sdk');
const CF = new AWS.CloudFormation();
const { yamlDump } = require('yaml-cfn');

const USE_PREVIOUS = Symbol();

const watchStack = require('./watchStack');

async function performUpdate(stackName, template, params) {
  let stack;
  try {
    stack = await CF.describeStacks({ StackName: stackName }).promise();
  } catch (e) {
    stack = null;
  }

  if (stack) {
    if ([
      'CREATE_IN_PROGRESS',
      'CREATE_FAILED',
      // "CREATE_COMPLETE",
      'ROLLBACK_IN_PROGRESS',
      'ROLLBACK_FAILED',
      'ROLLBACK_COMPLETE',
      'DELETE_IN_PROGRESS',
      'DELETE_FAILED',
      'DELETE_COMPLETE',
      'UPDATE_IN_PROGRESS',
      'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
      // "UPDATE_COMPLETE",
      'UPDATE_ROLLBACK_IN_PROGRESS',
      'UPDATE_ROLLBACK_FAILED',
      'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
      // "UPDATE_ROLLBACK_COMPLETE",
      'REVIEW_IN_PROGRESS'
    ].includes(stack.StackStatus)) {
      console.log('Stack status is %s. Not doing anything', stack.StackStatus);
      throw 'Stuk';
    }
  }

  const operation = stack ? 'updateStack' : 'createStack';

  console.log(stack ? 'Updating...' : 'Creating...');

  const parameters = Object.entries(params).map(([ key, value ]) => {
    if (value === USE_PREVIOUS) {
      return { ParameterKey: key, UsePreviousValue: true };
    }
    return { ParameterKey: key, ParameterValue: value };
  });

  do {
    try {
      await CF[operation]({
        StackName: stackName,
        TemplateBody: yamlDump(template),
        Capabilities: [ 'CAPABILITY_IAM' ],
        Parameters: parameters
      }).promise();
    } catch (e) {
      if (/No updates are to be performed/.test(e.message)) {
        console.log('Nothing to do!');
        break;
      }
      throw e;
    }

    await watchStack(stackName);
  } while (false);

  const finalState = await CF.describeStacks({ StackName: stackName }).promise();

  console.log('Outputs:');
  const outputs = {};
  finalState.Stacks[0].Outputs.forEach(({ OutputKey, OutputValue }) => {
    console.log('%s: %s', OutputKey, OutputValue);
    outputs[OutputKey] = OutputValue;
  });

  return outputs;
}

performUpdate.USE_PREVIOUS = USE_PREVIOUS;
module.exports = performUpdate;
