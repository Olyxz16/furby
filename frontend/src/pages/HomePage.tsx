import { Card } from "../components/ui/Card";

export function HomePage() {
  return (
    <Card title="Home">
      <p>
        Clean, modular TypeScript + React starter with a top bar and left sidebar.
        Ready to connect to a database later via the <code>services/</code> layer.
      </p>
      <p style={{ marginTop: 10 }}>
        Go to <b>Planning</b> to see a student selector + table fed from mock services.
      </p>
    </Card>
  );
}
