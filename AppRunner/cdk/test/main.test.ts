import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { QuarkusAppRunner } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new QuarkusAppRunner(app, 'name', 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});