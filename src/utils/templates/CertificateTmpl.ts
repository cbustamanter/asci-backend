import moment from "moment";
import { S3_PUBLIC, S3_URL } from "../../constants";

interface CertificateContent {
  studentName: string;
  courseName: string;
  courseStartDate: Date;
  courseEndDate: Date;
  totalSessions: number;
}

export const CertificateTmpl = (content: CertificateContent): string => {
  const startDate = moment(content.courseStartDate).format("LL");
  const endDate = moment(content.courseEndDate).format("LL");
  const now = moment().format("LL");
  return `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div style="position:relative;">
          <img src="${S3_URL}${S3_PUBLIC}/cert-1.jpeg">        
          <div style="position:absolute;top:23%;left:23%">
            <h3 style="font-family: Arial, Helvetica, sans-serif; font-weight:300;">Otorgado a:</h3>    
          </div>
          <div style="position:absolute;top:28%;left:30%;text-align:center;max-width:80%;height:110px;">
            <h1 style="font-family: Helvetica,sans-serif; font-size:40px; font-weight:800;">${content.studentName}</h1>
          </div>  
          <div style="position:absolute;top:40%;left:23%">
            <h3 style="font-family: Arial, Helvetica, sans-serif; font-weight:300;">Por haber participado en el Curso de Especialización Profesional:</h3>    
          </div>
          <div style="position:absolute;top:46%;left:27%;max-width:60%;text-align:center;height:130px;">
            <h1 style="font-family: 'Lucida Console',monospace; font-weight:bolder;">"${content.courseName}"</h1>    
          </div>
          <div style="position:absolute;top:60%;left:23%;max-width:70%">
            <h3 style="font-family: Arial, Helvetica, sans-serif; font-weight:300;">En honor a su parcipación con distinción en el curso, organizado por ASCI Perú y realizado durante ${startDate} y ${endDate} (${content.totalSessions} clase(s) en total).</h3>
          </div>
          <div style="position:absolute;top:67%;left:70%">
            <h3 style="font-family: Arial, Helvetica, sans-serif; font-weight:300;">Piura, ${now}</h3>
          </div>
        </div>
      </body>
    </html>     
    `;
};
