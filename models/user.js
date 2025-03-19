import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(userIputValues) {
  await validadeUniqueEmail(userIputValues.email);
  const newUser = await runInsertQuery(userIputValues);
  return newUser;
}
async function validadeUniqueEmail(email) {
  const results = await database.query({
    text: `
      SELECT 
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado",
      action: "Ultilize outo email para realizar o cadastro",
    });
  }
}

async function runInsertQuery(userIputValues) {
  const results = await database.query({
    text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      `,
    values: [
      userIputValues.username,
      userIputValues.email,
      userIputValues.password,
    ],
  });
  return results.rows[0];
}

const user = {
  create,
};

export default user;
