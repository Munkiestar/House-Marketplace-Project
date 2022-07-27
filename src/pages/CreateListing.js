import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from "../components/Loader";

function CreateListing() {
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: false,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // userRef is 'currently logged-in' user's id
          setFormData({ ...formData, userRef: user.uid });
          setIsLoading(false);
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => (isMounted.current = false);
  }, [isMounted]);

  {
    isLoading && <Loader />;
  }
  return <div>create</div>;
}

export default CreateListing;
