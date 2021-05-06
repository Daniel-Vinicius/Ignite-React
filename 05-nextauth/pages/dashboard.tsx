import { useAuth } from "../contexts/AuthContext";

import { withSSRAuth } from "../utils/withSSRAuth";

import { setupAPIClient } from "../services/api";
import { Can } from "../components/Can";

export default function Dashboard(): JSX.Element {
  const { user, signOut } = useAuth();

  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>

      <button onClick={signOut}>Sign Out</button>

      <Can permissions={["metrics.list"]} roles={["administrator", "editor"]}>
        <h1>Métricas</h1>
      </Can>
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
