import {
  S3Client,
  PutBucketVersioningCommand,
  ListObjectVersionsCommand,
  DeleteObjectsCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import * as readlineSync from "readline-sync";

type Tag = {
  Key: string;
  Value: string;
};

export class ServerlessRunningStages {}
