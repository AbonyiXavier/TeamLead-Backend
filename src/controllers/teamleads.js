import dbConnection from "../db/db";
import teamLeadsValidation from "../Models/Teamleads";
var cloudinary = require("cloudinary").v2;

export default class TeamLeadsController {
  static async addTeamLeads(req, res) {
    // console.log(req.body);
    try {
      if (!req.files) {
        res.status(400).send({
          message: "No files were uploaded"
        });
      }
      let first_name = req.body.first_name;
      let last_name = req.body.last_name;
      let email = req.body.email;
      let phone_number = req.body.phone_number;
      let uploadedFile = req.files.image;
      console.log("uploadedFile", uploadedFile);

      const { error } = teamLeadsValidation(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      cloudinary.uploader.upload(uploadedFile.tempFilePath, function(
        err,
        result
      ) {
        const image = result.url;
        const public_id = result.public_id;
        const emailExist =
          "SELECT * FROM team_lead WHERE email = '" + email + "'";

        dbConnection.query(emailExist, (error, result, fields) => {
          if (error) {
            res.send(error);
          } else {
            if (result.length > 0) {
              res.status(400).json({
                message: "Email Already Exist"
              });
            }

            const variable = {
              first_name,
              last_name,
              email,
              phone_number,
              image,
              public_id
            };
            console.log("output variable", variable);

            const newTeamLead = "INSERT INTO team_lead SET ?";

            dbConnection.query(
              newTeamLead,
              variable,
              (error, results, field) => {
                if (error) {
                  console.log(`debug me sir ${error}`);
                } else {
                  res.status(201).json({
                    status: "Success",
                    message: "Details added successfully"
                    // results: results.affectedRows
                  });
                }
              }
            );
          }
        });
      }); // cloudinary closes here
    } catch (error) {
      console.log(error);
    }
  }

  static async getAllTeamLeads(req, res) {
    try {
      const getAll = "SELECT * FROM team_lead";
      let results = await dbConnection.query(getAll);
      console.log(results);
      return res.status(201).json({
        status: "success",
        message: "view all information",
        results: results
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async updateTeamLead(req, res) {
    try {
      const memberId = req.params.id;
      const { first_name, last_name, email, phone_number } = req.body;
      const user = {
        first_name,
        last_name,
        email,
        phone_number
      };

      const updateQuery = "UPDATE team_lead SET ? WHERE id = ?";
      await dbConnection.query(updateQuery, [user, memberId]);
      return res.status(201).json({
        status: "success",
        message: "Details updated successfully"
        // results: result[0]
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteTeamLead(req, res) {
    try {
      const { id } = req.params;
      const getImageQuery =
        "SELECT image, public_id FROM team_lead WHERE id = ?";
      const deleteQuery = "DELETE FROM team_lead WHERE id = ?";
      let result = await dbConnection.query(getImageQuery, id);
      // console.log("result", result);
      if (result == 0) {
        res.send({
          status: "error",
          message: "no team member"
        });
      }
      // console.log("come out", result[0].public_id);
      await cloudinary.uploader.destroy(
        result[0].public_id,
        (error, result) => {
          console.log("delete from image path", result);
          console.log("Error from image path", error);
        }
      );
      let results = await dbConnection.query(deleteQuery, id);
      return res.status(201).json({
        message: "success",
        results: results[0]
      });
    } catch (error) {
      console.log(error);
    }
  }
}
