import sgMail from "@sendgrid/mail";
import { EmailService } from "../../../services/intranet/mail/EmailService";

export class EmailController implements EmailService {
  async sendEmail(msg: sgMail.MailDataRequired): Promise<boolean> {
    await sgMail.send(msg);
    return true;
  }
}
