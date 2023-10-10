function status(request, response) {
  response.status(200).json({ chave: "Você é uma pessoa acima da média" });
}

export default status;
