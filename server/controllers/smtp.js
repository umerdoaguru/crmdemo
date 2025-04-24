 // smtp code 
  // const user_data = async (req, res) => {
  //   const { name, email, mobile_no, subject, message } = req.body;
  
  //   const sql = `INSERT INTO contact (name, email, mobile_no, subject, message) VALUES (?, ?, ?, ?, ?)`;
  //   db.query(sql, [name, email, mobile_no, subject, message], (err, results) => {
  //     if (err) {
  //       return res.status(500).json({ error: "Error of Data" });
  //     }
  
  //     res.status(201).json({
  //       success: true,
  //       message: "Thank you for submitting the form! Our team will connect with you as soon as possible.",
  //     });
  
  //     const transporter = nodemailer.createTransport({
  //       host: 'mail.one-realty.in',
  //       port: 465,
  //       secure: true, // Use SSL
  //       auth: {
  //         user: 'info@one-realty.in',
  //         pass: 'onerealty@123',
  //       },
  //     });
  
  //     const mailOptions = {
  //       from: 'info@one-realty.in',
  //       to: 'umerqureshi786786@gmail.com',
  //       subject: 'One Realty Website Query/Contact Detailed From one-realty.in',
  //       text: `Name: ${name}\nEmail: ${email}\nMobile No.: ${mobile_no}\nSubject: ${subject}\nMessage: ${message}`,
  //     };
  
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log('Email sent: ' + info.response);
  //       }
  //     });
  //   });
  // };
  const sendOtpEmployee = (req, res) => {
    const { email } = req.body;
  
    const selectQuery = "SELECT * FROM employee WHERE email = ?";
  
    db.query(selectQuery, email, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      } else {
        if (!result || result.length === 0) {
          return res.status(404).json({ success: false, message: "Email not found" });
          
        } 
        else {
          
          
          
          // Random OTP generation
          function generateOTP(length) {
            const chars = "0123456789";
            let otp = "";
  
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * chars.length);
              otp += chars[randomIndex];
            }
  
            return otp;
          }
  
          const OTP = generateOTP(6);
  
          try {
              
          const transporter = nodemailer.createTransport({
           host: 'mail.one-realty.in',
           port: 465,
           secure: true, // Use SSL
           auth: {
                user: 'info@one-realty.in',
                 pass: 'onerealty@123',
           },
         });
            
  
            const mailOptions = {
              from: 'info@one-realty.in',
              to: email,
              subject: "Employee Password Reset OTP",
              text: `Your OTP for password reset is: ${OTP}`,
            };
  
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error(error);
                return res.status(500).json("An error occurred while sending the email.");
              } else {
                console.log("OTP sent:", info.response);
  
                const updateQuery = "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)";
                db.query(updateQuery, [email, OTP], (upErr, upResult) => {
                  if (upErr) {
                    return res.status(400).json({ success: false, message: upErr.message });
                  }
                  return res.status(200).json({ message: "OTP sent successfully" });
                });
              }
            });
          } catch (error) {
            console.log(error);
            return res.status(500).json("An error occurred.");
          }
       
      }
      }
    });
  };
  