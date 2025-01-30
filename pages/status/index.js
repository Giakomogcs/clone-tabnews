import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <UpdatedAt />
      <Database />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    const updated_at = data.updated_at;

    updatedAtText = new Date(updated_at).toLocaleString("pt-BR");
  }

  return (
    <div>
      <h1>Status</h1>
      <p>Ultima atualização: {updatedAtText}</p>
    </div>
  );
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let database = "";

  if (!isLoading && data) {
    database = data.dependencies.database;
  }

  return (
    <>
      <h1>Database</h1>
      <ul>
        <li>Versão: {database.version}</li>
        <li>Conexões abertas: {database.opened_connections}</li>
        <li>Conexões permitidas: {database.max_connections}</li>
      </ul>
    </>
  );
}
