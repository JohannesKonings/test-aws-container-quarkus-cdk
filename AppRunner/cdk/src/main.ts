import path from 'path';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
import {
  App, Stack, StackProps, Tags,
  aws_ec2 as ec2,
  aws_apigateway as apigateway,
  // Aspects,
} from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
// import { AwsSolutionsChecks } from 'cdk-nag';

export class QuarkusAppRunner extends Stack {
  constructor(scope: Construct, id: string, name: string, props: StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.1.0.0/16')
    });
    
    const vpcConnector = new apprunner.VpcConnector(this, 'VpcConnector', {
      vpc,
      vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
      vpcConnectorName: `${name}-vpc-connector`,
    });

    const imageAsset = new assets.DockerImageAsset(this, 'ImageAssets', {
      directory: path.join(__dirname, './../../quarkus/src/main/docker'),
      file: 'Dockerfile.jvm',
    });

    const apprunnerService = new apprunner.Service(this, 'quarkus-app-runner', {
      source: apprunner.Source.fromAsset({
        imageConfiguration: { port: 8080 },
        asset: imageAsset,
      }),
      vpcConnector: vpcConnector,
    });
    console.log(`App Runner service url ${apprunnerService.serviceUrl}`);

    const api = new apigateway.RestApi(this, 'api', {
      restApiName: name,
    });
    const apiResourceHello = api.root.addResource('hello');
    apiResourceHello.addMethod('GET', new apigateway.HttpIntegration(`https://${apprunnerService.serviceId}.${Stack.of(this).region}.awsapprunner.com/hello`));
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();
const name = 'quarkus-app-runner';

new QuarkusAppRunner(app, 'quarkus-app-runner', name, { env: devEnv });

// Aspects.of(app).add(new AwsSolutionsChecks());
Tags.of(app).add('project', name);

app.synth();