export interface CertificateService {
  generate: (performedQuizz: string) => Promise<string>;
}
