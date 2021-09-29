import { TO_EMAIL, TO_NAME } from "../../constants";

export const MailTmpl = (to: string, subject: string, body: string) => {
  return {
    to,
    from: {
      email: TO_EMAIL,
      name: TO_NAME,
    },
    subject,
    html: `
    	<!doctype html>	    
		<body>
		${body}
		</body>
	</html>`,
  };
};
