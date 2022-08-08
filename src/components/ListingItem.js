import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

function ListingItem({ listing, id, onDelete }) {
  const {
    name,
    offer,
    imgUrls,
    location,
    discountedPrice,
    regularPrice,
    type,
    bedrooms,
    bathrooms,
  } = listing;

  return (
    <li key={id} className="categoryListing">
      <Link to={`/category/${type}/${id}`} className="categoryListingLink">
        <img src={imgUrls[0]} alt={name} className="categoryListingImg" />

        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{location}</p>
          <p className="categoryListingName">{name}</p>
          <p className="categoryListingPrice">
            $
            {offer
              ? discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {type === "rent" && " / Month"}
          </p>

          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {bedrooms > 1 ? `${bedrooms} Bedrooms` : `${bedrooms} Bedroom`}
            </p>

            <img src={bathtubIcon} alt="bath" />
            <p className="categoryListingInfoText">
              {bathrooms > 1
                ? `${bathrooms} Bathrooms`
                : `${bathrooms} Bathroom`}
            </p>
          </div>
        </div>
        {onDelete && (
          <DeleteIcon
            onClick={() => onDelete(id, name)}
            className="removeIcon"
            fill="rgb(231,76,60)"
          />
        )}
      </Link>
    </li>
  );
}

export default ListingItem;
