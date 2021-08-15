package org.sid.projetservice.config;


import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailConfig extends Thread{

    private String subject;
    private String dest;
    private String msg;

    public EmailConfig(String subject, String dest, String msg) {
        this.subject = subject;
        this.dest = dest;
        this.msg = msg;
    }

    public void send() {
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "465");

        Session session = Session.getDefaultInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication("um5.collaboration@gmail.com", "um5.wcp.2020");
                    }
                });
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(dest));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(dest));
            message.setSubject(subject);

            message.setText(msg,"utf-8", "html");

            Transport.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    public void run(){
        this.send();
    }

    /*public static void main(String[] args){
        EmailConfig sm = new EmailConfig("test send mail","mohamedamine_elyoussr@um5.ac.ma","hello world !");
        sm.send();
    }*/
}
