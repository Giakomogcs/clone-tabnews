class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function salvarUsusario(input) {
  if (!input) {
    throw new ReferenceError("É necessário enviar o 'input'");
  }

  if (!input.name) {
    throw new ValidationError("Preencha o seu nome completo");
  }

  if (!input.username) {
    throw new ValidationError("Preencha o seu apelido");
  }

  if (!input.age) {
    throw new ValidationError("Preencha a idade");
  }
}

try {
  salvarUsusario({});
  console.log(error);
} catch (error) {
  if (error instanceof ReferenceError) {
    throw error;
  }

  if (error instanceof ValidationError) {
    throw error;
  }

  throw error;
}
