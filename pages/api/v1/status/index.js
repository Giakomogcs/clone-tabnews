import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  // Consulta para obter informações do PostgreSQL
  const postgresInfoQuery =
    "SELECT version() as version, setting as max_connections FROM pg_settings WHERE name = 'max_connections'";
  const postgresInfoResult = await database.query(postgresInfoQuery);

  // Extrai informações do resultado da consulta
  const fullPostgresVersion = postgresInfoResult.rows[0].version;
  const versionMatches = fullPostgresVersion.match(/(\d+\.\d+\.\d+)/);
  const postgresVersion = versionMatches
    ? versionMatches[0]
    : "Versão não encontrada";

  const maxConnections = postgresInfoResult.rows[0].max_connections;

  // Consulta para obter o número de conexões atuais
  const currentConnectionsQuery =
    "SELECT COUNT(*) as current_connections FROM pg_stat_activity";
  const currentConnectionsResult = await database.query(
    currentConnectionsQuery,
  );
  const currentConnections =
    currentConnectionsResult.rows[0].current_connections;

  const queries = {
    updated_at: updatedAt,
    postgres_version: postgresVersion,
    max_connections: maxConnections,
    current_connections: currentConnections,
    // Adicione mais informações conforme necessário
  };

  response.status(200).json(queries);
}

export default status;
