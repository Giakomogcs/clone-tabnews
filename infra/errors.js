export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu.");
    this.cause = cause; // Atribuição manual do cause
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}
