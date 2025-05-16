import nodemailer from "nodemailer";

export const sendEmail=async(to,subject,html,attachments)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user:process.env.EMAIL,
          pass:process.env.PASSWORD,
        },
      });
      
        const info = await transporter.sendMail({
          from: `"heba 👻" <${process.env.EMAIL}>`, 
          to: to ? to : "hebatollahamr14@gmail.com", 
          subject: subject ? subject:"Hello ✔", 
          text: "Hello world?", 
          html: html?html:"<b>Hello world?</b>",
          attachments: attachments ? attachments : []
        });

        if(info.accepted.length){
            return true
        }else{
            return false
        }
          
           
}
  