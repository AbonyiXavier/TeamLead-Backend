import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnection from "../db/db";
import signupValidation from "../Models/Signup";

const signup = (req, res) => {
  try {
    console.log("show me body", req.body);
    const { first_name, last_name, email, password, is_admin } = req.body;
    const user = {
      first_name,
      last_name,
      email,
      password,
      is_admin
    };
    const { error } = signupValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const emailExist = "SELECT  COUNT( * ) AS count FROM users WHERE email = ?";
    dbConnection.query(emailExist, [email], (err, data, fields) => {
      // console.log(`i am error ${err}`);
      if (err) {
        res.send(err);
      } else {
        if (data[0].count > 0) {
          res.status(400).send({
            message: "Email Already Exist"
          });
        } else {
          bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) {
              console.log(err);
            } else {
              user.password = hash;
              const saveNewUser = "INSERT INTO users SET ?";
              dbConnection.query(
                saveNewUser,
                user,
                (error, results, fields) => {
                  if (error) {
                    // console.log(`i am error ${error}`);
                    return res.send(error);
                  } else {
                    // console.log(id);
                    const token = jwt.sign(user, process.env.TOKEN_SECRET, {
                      // expiresIn: "3600s" // 1min
                    });
                    res
                      .header("auth-token", token)
                      .status(201)
                      .json({
                        token,
                        message: "Signup Successful"
                        // user
                      });
                  }
                  //   console.log(results);
                }
              );
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export default signup;
