const { execSync } = require("child_process");
const fs = require("fs");

try {
  // Obtém a lista de arquivos staged
  const stagedFiles = execSync(
    'git diff --cached --name-only -- "*.js" "*.ts" "*.json" "*.env" | grep -v ".env.example"',
    { encoding: "utf-8" },
  )
    .split("\n")
    .filter((file) => file.trim() !== ""); // Remove linhas vazias

  if (stagedFiles.length === 0) {
    console.log("✅ Nenhum arquivo relevante para verificar.");
    process.exit(0);
  }

  let sensitiveDataFound = false;

  // Padrões gerais para detectar dados sensíveis
  const sensitivePatterns = [
    /\bAPI_KEY\s*=\s*['"]?.+['"]?/, // Captura API_KEY com ou sem espaços
    /\bSECRET\s*=\s*['"]?.+['"]?/, // Captura SECRET com ou sem espaços
    /\bPASSWORD\s*=\s*['"]?.+['"]?/, // Captura PASSWORD com ou sem espaços
    /\bTOKEN\s*=\s*['"]?.+['"]?/, // Captura TOKEN com ou sem espaços
    /PRIVATE_KEY\s*=\s*['"]?.+['"]?/, // Captura PRIVATE_KEY com ou sem espaços
    /\bAWS_ACCESS_KEY_ID\s*=\s*['"]?.+['"]?/, // Captura AWS Access Key
    /\bAWS_SECRET_ACCESS_KEY\s*=\s*['"]?.+['"]?/, // Captura AWS Secret Key
    /Authorization:\s*['"]?Bearer\s+\w+/i, // Captura Authorization com Bearer Token
    /https?:\/\/.*[?&](api_key|token)=/, // Captura URLs com API_KEY ou token na query string
    /console\.log\(.*(password|secret|token|key|api)/i, // Captura console.log sensíveis
    /fetch\(.*\b(token|password|secret|key)\b.*\)/i, // Captura fetch com dados sensíveis (melhorado)
  ];

  // Regras específicas para o arquivo de teste
  const testFilePatterns = [
    /\bAPI_KEY\s*=\s*['"]?.+['"]?/, // Captura API_KEY
    /console\.log\(.*(password|key|api)/i, // Captura console.log sensíveis
    /fetch\(.*\b(token|password|secret|key)\b.*\)/i, // Captura fetch com informações sensíveis (melhorado)
  ];

  // Verifica cada arquivo staged
  stagedFiles.forEach((file) => {
    const fileContent = fs.readFileSync(file, "utf-8");
    const lines = fileContent.split("\n"); // Divide o conteúdo do arquivo em linhas

    lines.forEach((line, index) => {
      const patterns = file.includes(
        "tests/integration/api/v1/migrations/get.test.js",
      )
        ? testFilePatterns // Use padrões específicos para o arquivo de teste
        : sensitivePatterns; // Use padrões gerais para os outros arquivos

      patterns.forEach((pattern) => {
        if (pattern.test(line)) {
          sensitiveDataFound = true;
          console.error(`❌ Dados sensíveis detectados no arquivo: ${file}`);
          console.error(`   ➡️   Linha ${index + 1}: ${line.trim()}`);
        }
      });
    });
  });

  if (sensitiveDataFound) {
    console.error(
      "❌ Commit bloqueado: Remova os dados sensíveis antes de prosseguir.",
    );
    process.exit(1);
  }

  console.log("✅ Nenhum dado sensível encontrado. Commit permitido.");
  process.exit(0);
} catch (err) {
  console.error(
    "Erro ao executar a verificação de dados sensíveis:",
    err.message,
  );
  process.exit(1);
}
