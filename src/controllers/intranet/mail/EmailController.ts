import sgMail from "@sendgrid/mail";
import { EmailService } from "../../../services/intranet/mainl/EmailService";

export class EmailController implements EmailService {
  async sendEmail(msg: sgMail.MailDataRequired): Promise<boolean> {
    await sgMail.send(msg);
    return true;
  }
}
