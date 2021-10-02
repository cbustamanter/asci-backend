import { Answer } from "../entities/Answer";
import { Course } from "../entities/Course";
import { CourseDetail } from "../entities/CourseDetail";
import { CourseSession } from "../entities/CourseSession";
import { PerformedQuizz } from "../entities/PerformedQuizz";
import { Question } from "../entities/Question";
import { Quizz } from "../entities/Quizz";
import { QuizzDetail } from "../entities/QuizzDetail";
import { SessionFile } from "../entities/SessionFile";
import { SolvedQuizz } from "../entities/SolvedQuizz";
import { User } from "../entities/User";
import { UserCertificate } from "../entities/UserCertificate";

export const Entities = [
  User,
  Course,
  CourseDetail,
  CourseSession,
  SessionFile,
  Quizz,
  QuizzDetail,
  Question,
  Answer,
  PerformedQuizz,
  SolvedQuizz,
  UserCertificate,
];
