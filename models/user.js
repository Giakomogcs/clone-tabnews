import database from "infra/database";

async function create(userIputValues) {
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
