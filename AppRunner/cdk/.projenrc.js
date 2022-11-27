const { awscdk, github } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.51.1',
  defaultReleaseBranch: 'main',
  name: 'cdk',

  deps: [
    'cdk-nag',
    '@aws-cdk/aws-apprunner-alpha',
  ],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],
  // packageName: undefined,  /* The "name" in package.json. */
  mergify: false,
  github: false,
});
project.synth();