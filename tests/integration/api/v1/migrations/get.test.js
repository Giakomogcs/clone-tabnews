import database from "infra/database";

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);

  expect(Array.isArray(responseBody)).toBe(true);
  //expect(responseBody.length).toBeGreaterThan(0);

  console.log(process.env.NODE_ENV); //provando que as variáveis de ambiente são .env.test

  expect(process.env.POSTGRES_HOST).toBe("localhost");
});
