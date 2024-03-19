const { convert } = require("html-to-text");
const nodemailer = require("nodemailer");
const pug = require("pug");

class Email {
	userName;
	to;
	from;
	// url;

	constructor(user) {
		this.userName = user.userName;
		this.to = user.email;
		this.from = process.env.MAIL_USER;
		// this.url = url;
	}

	newTransport() {
		console.log("process.env.process.env.MAIL_HOST", process.env.MAIL_HOST);
		return nodemailer.createTransport({
			service: process.env.MAIL_SERVICE,
			// host: process.env.MAIL_HOST,
			prot: process.env.MAIL_PORT,
			secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});
	}

	async send(template, subject, code) {
		const html = pug.renderFile(
			`${__dirname}/../views/email/${template}.pug`,
			{
				userName: this.userName,
				subject,
				// url: this.url,
				code: code,
			}
		);

		//Create mailOptions
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			text: convert(html),
			html,
		};

		const info = await this.newTransport().sendMail(mailOptions);
		console.log(nodemailer.getTestMessageUrl(info));
	}

	async sendOtp(code) {
		await this.send("otp", "Your Otp is", code);
	}

	async sendVerificationCode(code) {
		await this.send(
			"verificationCode",
			"Your account verification code",
			code
		);
	}

	async sendPasswordResetToken(code) {
		await this.send(
			"resetPassword",
			"Your password reset token (valid for only 10 minutes)",
			code
		);
	}
}

module.exports = Email;
