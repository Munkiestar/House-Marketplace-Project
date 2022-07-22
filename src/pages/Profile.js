import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

function Profile(props) {
  const [user, setUser] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    setUser(auth.currentUser);
    console.log("auth", auth.currentUser);
  }, []);

  return user ? (
    <h2>{user.displayName}</h2>
  ) : (
    <h2>There is no user logged in</h2>
  );
}

export default Profile;
