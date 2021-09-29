import sgMail from "@sendgrid/mail";
export interface EmailService {
  sendEmail: (msg: sgMail.MailDataRequired) => Promise<boolean>;
}
