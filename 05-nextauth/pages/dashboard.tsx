import { useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";

import { withSSRAuth } from "../utils/withSSRAuth";

import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");

  console.log(response.data);

  return {
    props: {},
  };
});
