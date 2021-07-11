import {
  Arg,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { AWSS3Uploader } from "../classes/AWSS3Uploader";
import { S3_BUCKET, S3_COVER_PATH, S3_SESSION_PATH } from "../constants";
import { Course } from "../entities/Course";
import {
  InputCourseSession,
  SessionFile,
} from "../utils/types/InputCourseSession";
import { InputCourseDetail } from "../utils/types/InputCourseDetail";
import { PaginatedCourses } from "../utils/types/PaginatedCourses";
import { getRepository } from "typeorm";

//TODO: IMPROVE THIS CODERINO
@Resolver(Course)
export class CourseResolver {
  @FieldResolver(() => Int)
  totalUsers(@Root() course: Course) {
    return course.users?.length || 0;
  }

  @FieldResolver(() => String)
  statusText(@Root() course: Course) {
    switch (course.status) {
      case 1:
        return "Activo";
      case 2:
        return "Inactivo";
      case 3:
        return "Por iniciar";
      default:
        return "Activo";
    }
  }

  @FieldResolver(() => String)
  hasTestText(@Root() course: Course) {
    return course.hasTest ? "Si" : "No";
  }

  private repo = getRepository(Course);
  @Mutation(() => Course)
  async createCourse(
    @Arg("courseDetail") courseDetail: InputCourseDetail,
    @Arg("courseSessions", () => [InputCourseSession])
    courseSessions: [InputCourseSession]
  ): Promise<Course> {
    const coverUploader = new AWSS3Uploader(`${S3_BUCKET}${S3_COVER_PATH}`);
    const sessionUploader = new AWSS3Uploader(`${S3_BUCKET}${S3_SESSION_PATH}`);
    const { filename } = await coverUploader.singleUpload(
      courseDetail.coverPhoto
    );
    if (courseSessions.length) {
      await Promise.all(
        courseSessions.map(async (session, idx) => {
          if (session.files?.length) {
            const uploadedFiles = await sessionUploader.multipleUpload(
              session.files
            );
            const sessionFiles: SessionFile[] = uploadedFiles.map((file) => {
              return { filename: `${S3_SESSION_PATH}/${file.filename}` };
            });
            courseSessions[idx]["sessionFiles"] = sessionFiles;
          }
        })
      );
    }

    return Course.create({
      hasTest: courseDetail.hasTest,
      courseDetail: {
        ...courseDetail,
        coverPhoto: `${S3_COVER_PATH}/${filename}`,
        courseSessions,
      },
    }).save();
  }

  @Query(() => PaginatedCourses)
  async courses(
    @Arg("page", () => Int) page: number,
    @Arg("per_page", () => Int, { nullable: true }) per_page: number
  ): Promise<PaginatedCourses> {
    const take = per_page || 10;
    const skip = (page - 1) * take;
    const [data, total] = await this.repo.findAndCount({
      take,
      skip,
      relations: [
        "courseDetail",
        "courseDetail.courseSessions",
        "courseDetail.courseSessions.sessionFiles",
      ],
    });
    return {
      prev: page > 1 ? page - 1 : null,
      data,
      totalPages: Math.ceil(total / take),
    };
  }
}
