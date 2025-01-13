    import nodemailer from "nodemailer";
    import { EMAIL_APP_PASSWORD, EMAIL_SENDER } from "../constants/env";
    type Params = {
        to:string,
        text:string,
        subject:string
        html:string,
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL_SENDER,
          pass: EMAIL_APP_PASSWORD,
        },
      });
      
        export const sendMail = async ({text, to, subject, html}: Params) =>
            await transporter.sendMail({
                from: EMAIL_SENDER,
                to: to,
                subject,
                text,
                html
            })
        
    