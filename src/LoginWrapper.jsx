import Center from "./Center";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  getRedirectResult,
} from "./timeline/firebase";
import { Toast } from "primereact/toast";
import { cloneElement, useEffect, useRef, useState } from "react";

const ALLOW_USER = "uriportnoy@gmail.com";

const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};
function AppWithLogin({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const toastCenter = useRef(null);

  const showMessage = (label, severity) => {
    toastCenter.current.show({
      severity: severity,
      summary: severity === "error" ? "Error" : "Success",
      detail: label,
      life: 8000,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setHasAccess(currentUser.email === ALLOW_USER);
      }
    });
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult();
        if (result) {
          const currentUser = result.user;
          setUser(currentUser);
          const userHasAccess = currentUser.email === ALLOW_USER;
          setHasAccess(userHasAccess);
          if (!userHasAccess) {
            showMessage("Access denied", "error");
          }
        }
      } catch (error) {
        showMessage("Error handling redirect result:" + error, "error");
      } finally {
        setIsLoaded(true);
      }
    };
    handleRedirectResult();
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      let result;
      if (isMobile()) {
        result = await signInWithRedirect();
      } else {
        result = await signInWithPopup();
      }
      const currentUser = result.user;
      setUser(currentUser);
      setHasAccess(currentUser.email === ALLOW_USER);
    } catch (error) {
      showMessage("Error signing in: " + error.message, "error");
    }
  };

  const logout = () => {
    signOut();
    setUser(null);
  };
  if (!isLoaded) {
    return <Center>Loading...</Center>;
  }
  return (
    <div>
      {user && hasAccess && cloneElement(children, { logout })}
      {(!user || !hasAccess) && (
        <Center>
          {user && !hasAccess && <div>Access denied</div>}
          <button onClick={signIn}>Sign in with Google</button>
        </Center>
      )}
      <Toast ref={toastCenter} position="center" />
    </div>
  );
}

export default AppWithLogin;
