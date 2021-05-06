import { useEffect } from "react";

import { useCan } from "../hooks/useCan";
import { useAuth } from "../contexts/AuthContext";

import { withSSRAuth } from "../utils/withSSRAuth";

import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();

  const userCanSeeMetrics = useCan({
    permissions: ["metrics.list"],
    roles: ["administrator", "editor"],
  });

  useEffect(() => {
    api.get("/me").then((response) => console.log(response));
  }, []);

  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>

      {userCanSeeMetrics && <h1>Métricas</h1>}
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");

  // console.log(response.data);

  return {
    props: {},
  };
});
