import AppProviders from "@/app/providers/AppProviders";
import { AppRouter } from "@/app/router";
import MobileFrame from "@/widgets/app-shell/mobile-frame";

const App = () => {
  return (
    <AppProviders>
      <MobileFrame>
        <AppRouter />
      </MobileFrame>
    </AppProviders>
  );
};

export default App;
