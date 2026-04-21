import { ReplykeProvider, useSignTestingJwt } from "@replyke/react-js";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth-provider";
import HomePage from "./pages/home-page";
import ProfilePage from "./pages/profile-page";
import EntityPage from "./pages/entity-page";
import { useAuth } from "./context/use-auth";
import DEMO_CREDENTIALS from "./config/credentials";

function AppInner() {
  const { user } = useAuth();
  const signTestingJwt = useSignTestingJwt();

  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    if (!user) return;

    signTestingJwt({
      projectId: DEMO_CREDENTIALS.PROJECT_ID,
      privateKey: DEMO_CREDENTIALS.PRIVATE_KEY,
      userData: {
        id: user.username,
        username: user.username,
      },
    }).then((receivedToken) => setToken(receivedToken));
  }, [user]);

  return (
    <ReplykeProvider
      projectId={DEMO_CREDENTIALS.PROJECT_ID}
      signedToken={token}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/u/:userId" element={<ProfilePage />} />
        <Route path="/e/:shortId" element={<EntityPage />} />
      </Routes>
    </ReplykeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
