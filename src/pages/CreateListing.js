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
  const handleSubmitForm = (e) => {
    e.preventDefault();
  };

  // handle onClick btn
  const onMutate = (e) => {
    e.preventDefault();
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
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              value="type"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              name="type"
              id="type"
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              value="rent"
              onClick={onMutate}
            >
              Sell
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
            onChange={onMutate}
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
                onChange={onMutate}
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
                onChange={onMutate}
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
              onClick={onMutate}
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
            onChange={onMutate}
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
                  onChange={onMutate}
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
                  onChange={onMutate}
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
              onClick={onMutate}
              className={offer ? "formButtonActive" : "formButton"}
            >
              Yes
            </button>
            <button
              name="offer"
              id="offer"
              value={false}
              type="button"
              onClick={onMutate}
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
              onChange={onMutate}
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
                onChange={onMutate}
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
            onChange={onMutate}
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
