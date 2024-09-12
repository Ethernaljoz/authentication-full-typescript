import { Resend } from "resend";
import { EMAIL_SENDER, NODE_ENV, RESEND_API_KEY } from "../constants/env";

type Params = {
    to:string,
    text:string,
    subject:string
    html:string,
}

const getFromEmail = () => NODE_ENV === "developement" ? "onboarding@resend.dev" : EMAIL_SENDER
const getToEmail = (to: string) => NODE_ENV === "developement" ? "delivered@resend.dev" : to;

const resend = new Resend(RESEND_API_KEY)

export const sendMail = async ({text, to, subject, html}: Params) =>
    await resend.emails.send({
        from: getFromEmail(),
        to: getToEmail(to),
        subject,
        text,
        html
    })
