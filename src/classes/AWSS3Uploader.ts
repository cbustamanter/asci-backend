import AWS from "aws-sdk";
import { FileUpload } from "graphql-upload";
import stream from "stream";
import { v4 } from "uuid";
import { IUploader } from "../interfaces/IUploader";
import { UploadedFileResponse } from "../utils/types/UploadedFileResponse";

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader implements IUploader {
  private s3: AWS.S3;
  public destinationBucketName: string;

  constructor(destinationBucketName: string) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: process.env.region || "us-east-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    this.s3 = new AWS.S3();
    this.destinationBucketName = destinationBucketName;
  }

  private createUploadStream(key: string, mimetype: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.destinationBucketName,
          Key: key,
          Body: pass,
          ContentType: mimetype,
          ACL: "public-read",
        })
        .promise(),
    };
  }

  private createDestinationFilePath(fileName: string): string {
    return `${v4()}-${fileName}`;
  }

  async singleUpload(file: Promise<FileUpload>): Promise<UploadedFileResponse> {
    const { createReadStream, encoding, filename, mimetype } = await file;
    const filePath = this.createDestinationFilePath(filename);
    const uploadStream = this.createUploadStream(filePath, mimetype);
    createReadStream().pipe(uploadStream.writeStream);
    const result = await uploadStream.promise;
    const link = result.Location;
    return {
      filename: filePath,
      name: filename,
      mimetype,
      encoding,
      url: link,
    };
  }

  async multipleUpload(
    files: [Promise<FileUpload>]
  ): Promise<UploadedFileResponse[]> {
    const response: UploadedFileResponse[] = [];
    await Promise.all(
      files.map(async (file) => {
        const upload = await this.singleUpload(file);
        response.push(upload);
      })
    );
    return response;
  }
}
