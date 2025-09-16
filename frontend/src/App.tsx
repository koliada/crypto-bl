import { useState, useEffect } from "react";
import { Container, Header, Main, StatusIndicator } from "./components/UI";
import CurrencySelector from "./components/CurrencySelector";
import type { ServerStatus } from "./types";
import { API_URL } from "./const";

function App() {
  const [backendStatus, setBackendStatus] = useState<ServerStatus>("checking");

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      if (response.ok) {
        setBackendStatus("connected");
      } else {
        setBackendStatus("error");
      }
    } catch (error) {
      console.error("Backend health check failed:", error);
      setBackendStatus("error");
    }
  };

  return (
    <Container>
      <Header>
        <h1>Black Labz Crypto Exchange</h1>
        <StatusIndicator status={backendStatus}>
          Backend: {backendStatus}
        </StatusIndicator>
      </Header>

      <Main>
        <CurrencySelector />
      </Main>
    </Container>
  );
}

export default App;
