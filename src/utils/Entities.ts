import { Answer } from "../entities/Answer";
import { Course } from "../entities/Course";
import { CourseDetail } from "../entities/CourseDetail";
import { CourseSession } from "../entities/CourseSession";
import { Question } from "../entities/Question";
import { Quizz } from "../entities/Quizz";
import { QuizzDetail } from "../entities/QuizzDetail";
import { SessionFile } from "../entities/SessionFile";
import { User } from "../entities/User";

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
];
