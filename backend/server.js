const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "mohamed19982023@gmail.com",
    pass: "jzdf mxqh hkyt iglm",
  },
});

app.post("/send-email", async (req, res) => {

  const { name, email } = req.body;

  try {

    await transporter.sendMail({
      from: "YOUR_GMAIL@gmail.com",

      to: email,

      subject: "Welcome To Pharma Link",

      html: `
        <h2>Hello ${name}</h2>

        <p>
          Welcome to Pharma Link ❤️
        </p>

        <p>
          Your account has been created successfully.
        </p>
      `,
    });

    res.json({
      message: "Email Sent Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed To Send Email",
    });
  }
});

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});