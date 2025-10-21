import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/router";
import { setCookie, destroyCookie } from "nookies";
import toast from "react-hot-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        console.log(
          "AuthContext: User logged in, ID Token obtained. UID:",
          firebaseUser.uid
        );
        console.log("AuthContext: Setting __session cookie.");

        setCookie(null, "__session", idToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          httpOnly: false,
          sameSite: "Lax",
        });

        setCurrentUser(firebaseUser);
        setLoading(false);
      } else {
        console.log(
          "AuthContext: No user logged in. Destroying __session cookie."
        );
        destroyCookie(null, "__session", { path: "/" });
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Firebase logout error:", error);
      toast.error(`Failed to log out: ${error.message || "Unknown error"}`);
    }
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user: currentUser, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
