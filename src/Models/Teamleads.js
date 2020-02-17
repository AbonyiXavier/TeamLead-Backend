import Joi from "joi";

const teamLeadsValidation = data => {
  const schema = {
    first_name: Joi.string()
      .min(4)
      .max(50)
      .trim()
      .required(),
    last_name: Joi.string()
      .trim()
      .min(4)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .min(5)
      .max(150)
      .trim()
      .required(),
    phone_number: Joi.string()
      .trim()
      .regex(/^[0-9]{6,20}$/)
      .required()
    // position: Joi.string()
    //   .min(6)
    //   .max(150)
    //   .trim()
    //   .required(),
    // duration: Joi.string()
    //   .min(6)
    //   .max(150)
    //   .trim()
    //   .required()
  };
  return Joi.validate(data, schema);
};

export default teamLeadsValidation;
