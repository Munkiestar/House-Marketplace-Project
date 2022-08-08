import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuid } from "uuid";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

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

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;
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

  // handle Form submit
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (discountedPrice >= regularPrice) {
      setIsLoading(false);
      toast.error("Discounted price must be less than regular price");
      return;
    }

    if (images.length > 6) {
      setIsLoading(false);
      toast.error("Please put max of 6 images");
      return;
    }

    // geocoding
    let geoLocation = {};
    let location;

    if (geoLocationEnabled) {
      var requestOptions = {
        method: "GET",
      };

      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${process.env.REACT_APP_GEOCODE_API_KEY}`,
        requestOptions
      );
      const data = await res.json();

      geoLocation.lat = data.features[0]?.properties.lat ?? 0;
      geoLocation.lng = data.features[0]?.properties.lon ?? 0;

      location =
        data.statusCode === "400" || data.statusCode === "401"
          ? undefined
          : data.features[0]?.properties.formatted;

      if (location === undefined || location.includes("undefined")) {
        setIsLoading(false);
        toast.error("Please enter a correct address");
        return;
      }
    } else {
      geoLocation.lat = latitude;
      geoLocation.lng = longitude;
    }

    // store image in firebase
    const storeImage = async (image) => {
      return new Promise((res, rej) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuid()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            rej(error);
            toast.error("unsuccessful uploads");
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              res(downloadURL);
            });
          }
        );
      });
    };

    // call storeImage for all images
    const imgUrls = await Promise.all(
      [...images].map((img) => storeImage(img))
    ).catch(() => {
      setIsLoading(false);
      toast.error("Images are not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geoLocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;

    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    setIsLoading(false);

    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  // handle onClick btn
  const onInputFieldChange = (e) => {
    let boolean = null;

    // for booleans
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // for files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // text / booleans / numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: boolean ?? e.target.value,
      }));
    }
  };

  {
    isLoading && <Loader />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>

      <main>
        {/* name or id always should match what's in state  */}
        <form onSubmit={handleSubmitForm}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              name="type"
              id="type"
              value="sale"
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              onClick={onInputFieldChange}
            >
              Sell
            </button>
            <button
              name="type"
              id="type"
              value="rent"
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              onClick={onInputFieldChange}
            >
              Rent
            </button>
          </div>
          <label htmlFor="" className="formLabel">
            Name
          </label>
          <input
            name="name"
            id="name"
            value={name}
            type="text"
            onChange={onInputFieldChange}
            maxLength="32"
            minLength="10"
            required
            className="formInputName"
          />
          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                name="bedrooms"
                id="bedrooms"
                value={bedrooms}
                type="number"
                onChange={onInputFieldChange}
                min="1"
                max="50"
                required
                className="formInputSmall"
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                name="bathrooms"
                id="bathrooms"
                value={bathrooms}
                type="number"
                onChange={onInputFieldChange}
                min="1"
                max="50"
                required
                className="formInputSmall"
              />
            </div>
          </div>
          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              name="parking"
              id="parking"
              value={true}
              onClick={onInputFieldChange}
              type="button"
              className={parking ? "formButtonActive" : "formButton"}
            >
              Yes
            </button>
            <button
              name="parking"
              id="parking"
              value={false}
              type="button"
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
            >
              No
            </button>
          </div>
          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              name="furnished"
              id="furnished "
              value={true}
              type="button"
              className={furnished ? "formButtonActive" : "formButton"}
            >
              Yes
            </button>{" "}
            <button
              name="furnished"
              id="furnished "
              value={false}
              type="button"
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
            >
              No
            </button>
          </div>
          <label className="formLabel">Address</label>
          <textarea
            name="address"
            id="address"
            value={address}
            onChange={onInputFieldChange}
            className="formInputAddress"
          />
          {!geoLocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  name="latitude"
                  id="latitude"
                  value={latitude}
                  onChange={onInputFieldChange}
                  required
                  type="number"
                  className="formInputSmall"
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  name="longitude"
                  id="longitude"
                  value={longitude}
                  onChange={onInputFieldChange}
                  required
                  type="number"
                  className="formInputSmall"
                />
              </div>
            </div>
          )}
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              name="offer"
              id="offer"
              value={true}
              type="button"
              onClick={onInputFieldChange}
              className={offer ? "formButtonActive" : "formButton"}
            >
              Yes
            </button>
            <button
              name="offer"
              id="offer"
              value={false}
              type="button"
              onClick={onInputFieldChange}
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
            >
              No
            </button>
          </div>
          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              name="regularPrice"
              id="regularPrice"
              value={regularPrice}
              type="number"
              onChange={onInputFieldChange}
              min="50"
              max="750000000"
              required
              className="formInputSmall"
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>
          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                name="discountedPrice"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onInputFieldChange}
                min="50"
                max="750000000"
                required={offer}
                type="number"
                className="formInputSmall"
              />
            </>
          )}
          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            name="images"
            id="images"
            onChange={onInputFieldChange}
            max="6"
            type="file"
            className="formInputFile"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
