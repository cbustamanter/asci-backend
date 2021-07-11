import { FileUpload } from "graphql-upload";
import { UploadedFileResponse } from "../utils/types/UploadedFileResponse";

export interface IUploader {
  singleUpload: (file: Promise<FileUpload>) => Promise<UploadedFileResponse>;
  multipleUpload: (
    files: [Promise<FileUpload>]
  ) => Promise<UploadedFileResponse[]>;
}
