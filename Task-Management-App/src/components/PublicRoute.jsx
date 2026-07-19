import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

function PublicRoute({ children }) {

    const [user, setUser] = useState(undefined);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            setUser(currentUser);

        });

        return () => unsubscribe();

    }, []);

    if (user === undefined) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold">
                    Loading...
                </p>
            </div>
        );

    }

    if (user) {

        return <Navigate to="/dashboard" />;

    }

    return children;

}

export default PublicRoute;