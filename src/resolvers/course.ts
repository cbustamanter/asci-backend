import { FileUpload } from "graphql-upload";
import {
  Arg,
  Authorized,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getRepository } from "typeorm";
import { AWSS3Uploader } from "../classes/AWSS3Uploader";
import { S3_BUCKET, S3_COVER_PATH, S3_SESSION_PATH } from "../constants";
import { Course } from "../entities/Course";
import { CourseDetail } from "../entities/CourseDetail";
import { CourseSession } from "../entities/CourseSession";
import { Quizz } from "../entities/Quizz";
import { SessionFile as EntitySessionFile } from "../entities/SessionFile";
import { isAuth } from "../middlewares/isAuth";
import { InputCourseDetail } from "../utils/types/InputCourseDetail";
import { InputCourseSession } from "../utils/types/InputCourseSession";
import { InputCourseSessionUpdate } from "../utils/types/InputCourseSessionUpdate";
import { PaginatedArgs } from "../utils/types/PaginatedArgs";
import { PaginatedCourses } from "../utils/types/PaginatedCourses";

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
  statusAction(@Root() course: Course) {
    return course.status === 2 ? "Activar" : "Desactivar";
  }

  @FieldResolver(() => String)
  hasTestText(@Root() course: Course) {
    return course.courseDetail.hasTest ? "Si" : "No";
  }

  private repo = getRepository(Course);
  private courseDetailRepo = getRepository(CourseDetail);
  private sessionFileRepo = getRepository(EntitySessionFile);
  private courseSessionRepo = getRepository(CourseSession);
  private quizRepo = getRepository(Quizz);

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => Boolean)
  async createCourse(
    @Arg("courseDetail") courseDetail: InputCourseDetail,
    @Arg("courseSessions", () => [InputCourseSession], {
      nullable: "itemsAndList",
    })
    courseSessions: [InputCourseSession]
  ): Promise<boolean> {
    const sessionUploader = new AWSS3Uploader(`${S3_BUCKET}${S3_SESSION_PATH}`);
    let coverPhoto;
    if (courseDetail.coverPhoto) {
      coverPhoto = await this.uploadCoverPhoto(courseDetail.coverPhoto);
    }

    const course = await this.repo
      .create({ courseDetail: { ...courseDetail, coverPhoto } })
      .save();

    if (courseDetail.hasTest) {
      await this.createQuiz(course.id);
    }

    if (courseSessions.length) {
      await Promise.all(
        courseSessions.map(async (s) => {
          let uploadedFiles;
          if (s.files?.length) {
            uploadedFiles = await sessionUploader.multipleUpload(s.files);
          }
          this.courseSessionRepo
            .create({
              ...s,
              courseDetail: { id: course.courseDetail.id },
              courseSessionFiles: uploadedFiles,
            })
            .save();
        })
      );
    }
    return true;
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => Boolean)
  async updateCourse(
    @Arg("id") id: string,
    @Arg("courseDetail", () => InputCourseDetail, { nullable: true })
    courseDetail: InputCourseDetail,
    @Arg("courseSessions", () => [InputCourseSessionUpdate], {
      nullable: "itemsAndList",
    })
    courseSessions: [InputCourseSessionUpdate]
  ): Promise<Boolean> {
    let coverPhoto;
    const repo = this.repoWithRelations();
    const course = await repo.where("c.id = :id", { id }).getOneOrFail();

    if (courseDetail.coverPhoto) {
      coverPhoto = await this.uploadCoverPhoto(courseDetail.coverPhoto);
    }

    if (courseDetail) {
      await this.courseDetailRepo.save({
        ...course.courseDetail,
        ...courseDetail,
        coverPhoto,
      });
      const quizz = await this.quizRepo.findOne({ course: { id: id } });
      if (quizz) {
        await this.quizRepo.save({
          ...quizz,
          status: courseDetail.hasTest ? 1 : 2,
        });
      } else {
        if (courseDetail.hasTest) {
          await this.createQuiz(id);
        }
      }
    }
    if (courseSessions) {
      await Promise.all(
        courseSessions.map(async (session) => {
          if (session.id) {
            // If session already exists Update it
            await this.courseSessionRepo.save({
              ...course.courseDetail.courseSessions,
              ...session,
            });
            if (session.files) {
              await this.createSessionFiles(session.files, session.id);
            }
          } else {
            // If doesn't exist, create it
            const createdSession = await this.courseSessionRepo
              .create({
                ...session,
                courseDetail: { id: course.courseDetail.id },
              })
              .save();
            if (session.files) {
              await this.createSessionFiles(session.files, createdSession.id);
            }
          }
        })
      );
    }
    return true;
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => Boolean)
  async deleteSession(@Arg("id") id: string): Promise<boolean> {
    await this.courseSessionRepo.delete({ id });
    return true;
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => Boolean)
  async changeCourseStatus(
    @Arg("id") id: string,
    @Arg("status", () => Int) status: number
  ): Promise<boolean> {
    await this.repo.update({ id }, { status });
    return true;
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Query(() => PaginatedCourses)
  async courses(
    @Arg("args", () => PaginatedArgs) args: PaginatedArgs
  ): Promise<PaginatedCourses> {
    const repo = this.repoWithRelations();
    const take = args.per_page || 10;
    const skip = (args.page - 1) * take;
    const qb = repo.orderBy("c.createdAt", "DESC").take(take).skip(skip);
    if (args.status && args.status !== 0) {
      qb.andWhere("c.status = :status", { status: args.status });
    }
    if (args.search) {
      qb.andWhere("LOWER(cd.name) like :search", {
        search: `%${args.search}%`,
      });
    }
    const [data, total] = await qb.getManyAndCount();
    return {
      prev: args.page > 1 ? args.page - 1 : null,
      data: data,
      totalPages: Math.ceil(total / take),
    };
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Query(() => Course, { nullable: true })
  async course(@Arg("id") id: string): Promise<Course | undefined> {
    const repo = this.repoWithRelations();
    return repo
      .where("c.id = :id", { id })
      .orderBy("cs.createdAt", "ASC")
      .getOne();
  }

  repoWithRelations() {
    return this.repo
      .createQueryBuilder("c")
      .leftJoinAndSelect("c.users", "u")
      .leftJoinAndSelect("c.courseDetail", "cd")
      .leftJoinAndSelect("cd.courseSessions", "cs")
      .leftJoinAndSelect("cs.courseSessionFiles", "f");
  }

  async createSessionFiles(
    files: [Promise<FileUpload>],
    courseSessionId: string
  ) {
    const sessionUploader = new AWSS3Uploader(`${S3_BUCKET}${S3_SESSION_PATH}`);
    const uploadedFiles = await sessionUploader.multipleUpload(files);
    uploadedFiles.map(async (ufile) => {
      await this.sessionFileRepo
        .create({ courseSession: { id: courseSessionId }, ...ufile })
        .save();
    });
  }

  async uploadCoverPhoto(file: Promise<FileUpload>) {
    const coverUploader = new AWSS3Uploader(`${S3_BUCKET}${S3_COVER_PATH}`);
    const { filename } = await coverUploader.singleUpload(file);
    return filename;
  }

  async createQuiz(courseId: string) {
    await this.quizRepo.create({ course: { id: courseId } }).save();
  }
}
