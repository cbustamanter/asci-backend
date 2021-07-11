import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Arg, Mutation, Resolver } from "type-graphql";
import { AWSS3Uploader } from "../classes/AWSS3Uploader";
import { UploadedFileResponse } from "../utils/types/UploadedFileResponse";

@Resolver()
export class UploadResolver {
  @Mutation(() => UploadedFileResponse)
  async singleUpload(
    @Arg("file", () => GraphQLUpload) file: Promise<FileUpload>
  ): Promise<UploadedFileResponse> {
    const uploader = new AWSS3Uploader(process.env.COURSE_SESSION_BUCKETNAME);
    return uploader.singleUpload(file);
  }
}
