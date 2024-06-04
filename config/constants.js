require("dotenv").config();
module.exports = Object.freeze({
  CONST_USER_ROLE: "1",
  CONST_ADMIN_ROLE: "2",
  CONST_USER_VERIFIED_TRUE:true,
  CONST_USER_VERIFIED_FALSE:false,
  CONST_DB_STATUS_ACTIVE: 'Active',
  CONST_DB_STATUS_INACTIVE: 'Inactive',
  CONST_PRODUCT_IN_STOCK: 'InStock',
  CONST_PRODUCT_OUT_OFF_STOCK: 'OutOfStock',
  CONST_VALIDATE_SESSION_EXPIRE:'24h',

  CONST_APP_URL:'http://localhost:3000',

  // send mail constants 
  SMTP_HOST: process.env.SMTP_HOST,
	SMTP_PORT: process.env.SMTP_PORT,
	SMTP_USERNAME: process.env.SMTP_USERNAME,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,
	MAIL_SEND_FROM: process.env.MAIL_SEND_FROM,
});
