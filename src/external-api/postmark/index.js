import dotenv from "dotenv";
dotenv.config();

import postmark from 'postmark'

const settings = {
    From: "support@schedoule.com"
}

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN)

export const sendWelcomeBusinessOwnerEmail = async ({recipientEmail, recipientName, businessCode, username}) => {
    await client.sendEmailWithTemplate({
        From: settings.From,
        To: recipientEmail,
        TemplateAlias: 'welcome',
        TemplateModel: {
            'product_name': process.env.CLIENT_APP_NAME,
            'product_url' : process.env.CLIENT_APP_URL,
            'login_url': `${process.env.CLIENT_APP_URL}/sign-in`,
            'support_email': process.env.CLIENT_EMAIL,

            'name': recipientName,
            'business_code': businessCode,
            'username': username,
            
        }
    })
}

export const sendWelcomeEmployeeEmail = async ({recipientEmail, recipientName, businessCode, businessName, username, password}) => {
    await client.sendEmailWithTemplate({
        From: settings.From,
        To: recipientEmail,
        TemplateAlias: 'employee-welcome',
        TemplateModel: {
            'product_name': process.env.CLIENT_APP_NAME,
            'product_url' : process.env.CLIENT_APP_URL,
            'login_url': `${process.env.CLIENT_APP_URL}/sign-in`,
            'support_email': process.env.CLIENT_EMAIL,
            
            'name': recipientName,
            'business_code': businessCode,
            'business_name' : businessName,
            'username': username,
            'temp_password': password, 
        }
    })
}