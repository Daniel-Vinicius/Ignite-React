import { useAuth } from "../contexts/AuthContext";

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>{user?.email}</h2>
    </div>
  );
}
