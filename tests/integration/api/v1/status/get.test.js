test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  // Lê o corpo da resposta como texto
  const responseBodyString = await response.text();
  console.log(JSON.stringify(JSON.parse(responseBodyString), null, 2));

  // Utiliza o corpo da resposta como JSON
  const responseBody = JSON.parse(responseBodyString);

  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
});
