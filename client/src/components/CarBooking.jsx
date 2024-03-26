import React, { useState, useRef, useEffect } from "react";
import "./CarBooking.css"; 
const CarBooking = () => {
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [distance, setDistance] = useState(null);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [userName, setUserName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const carOptionsRef = useRef(null);
  const bookNowRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    scrollSmoothly(carOptionsRef);
    calculateDistance();
    fetchCarOptions();
    
  };
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setShowPopup(false);
  };
  const fetchCoordinates = () => {
    const requestBody = {
      pickup_address: pickupAddress,
      dropoff_address: dropoffAddress,
    };
    fetch("http://localhost:5050/api/coordinates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Coordinates:", data);
        const { pickup_coordinates, dropoff_coordinates } = data;
        setPickupCoordinates(pickup_coordinates);
        setDropoffCoordinates(dropoff_coordinates);
        calculateDistance(pickup_coordinates, dropoff_coordinates);
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
      });
  };

  const calculateDistance = (pickupCoordinates, dropoffCoordinates) => {
    if (pickupCoordinates && dropoffCoordinates) {
      const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoordinates.longitude},${pickupCoordinates.latitude};${dropoffCoordinates.longitude},${dropoffCoordinates.latitude}?overview=false`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Process distance data
          console.log("Distance data:", data);
          // Update the distance state based on the received data
          setDistance(data.routes[0].distance);
        })
        .catch((error) => {
          console.error("Error calculating distance:", error);
        });
    } else {
      console.error("Coordinates are not available.");
    }
  };

  const fetchCarOptions = () => {
    // For simplicity, let's assume car options are fetched based on dummy data
    const dummyCars = [
      {
        name: "UberX",
        price: "$20",
        imageUrl: "https://via.placeholder.com/100",
      },
      {
        name: "UberXL",
        price: "$30",
        imageUrl: "https://via.placeholder.com/100",
      },
      {
        name: "Uber Black",
        price: "$40",
        imageUrl: "https://via.placeholder.com/100",
      },
      {
        name: "Uber Lux",
        price: "$50",
        imageUrl: "https://via.placeholder.com/100",
      },
      {
        name: "Uber Pool",
        price: "$15",
        imageUrl: "https://via.placeholder.com/100",
      },
    ];
    setCars(dummyCars);
  };

  // Function to handle car selection
  const handleCarSelection = (car) => {
    setSelectedCar(car);
    scrollSmoothly(bookNowRef);
    setShowPopup(true);
  };

  // Function to confirm booking
  const confirmBooking = () => {
    setIsBookingConfirmed(true);
    createBooking();
  };
  const createBooking = () => {
    const requestBody = {
      pickup_address: pickupAddress,
      dropoff_address: dropoffAddress,
      user: userName,
    };

    fetch("http://localhost:5050/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Booking created:", data);
      })
      .catch((error) => {
        console.error("Error creating booking:", error);
      });
  };

  // Function to smoothly scroll to a specific reference
  const scrollSmoothly = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Reset form and states
  const resetForm = () => {
    setPickupAddress("");
    setDropoffAddress("");
    setDistance(null);
    setCars([]);
    setSelectedCar(null);
    setIsBookingConfirmed(false);
  };

  // Render confirmation page if booking is confirmed
  if (isBookingConfirmed) {
    return (
      <div className="car-booking-container">
        <h1 className="title">Booking Confirmed!</h1>
        <p>Your ride with {selectedCar.name} has been successfully booked.</p>
      </div>
    );
  }

  return (
    <div className="car-booking-container">
      <h1 className="navbar-title">Go4Drive</h1> 
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="label">Pickup Location</label>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            className="form-control input"
            placeholder="Enter pickup location"
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Dropoff Location</label>
          <input
            type="text"
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            className="form-control input"
            placeholder="Enter dropoff location"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary submit-button"
          onClick={fetchCoordinates}
        >
          Find a Ride
        </button>
      </form>
      {distance !== null && (
        <div>
          {cars.length > 0 && (
            <div ref={carOptionsRef} className="car-options">
              <p className="distance-info">
                Estimated Distance: {(distance / 1000).toFixed(2)} Kilometer
              </p>

              <h2 className="options-title">Available Cars</h2>
              <ul className="list-group options-list">
                {cars.map((car, index) => (
                  <li
                    key={index}
                    className="list-group-item car-option"
                    onClick={() => handleCarSelection(car)}
                  >
                    <img
                      src={car.imageUrl}
                      alt={car.name}
                      className="car-image"
                    />
                    <div className="car-details">
                      <h3 className="car-name">{car.name}</h3>
                      <p className="car-price">{car.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {selectedCar && (
        <div ref={bookNowRef} className="confirmation-container">
          <h2>Confirm Booking</h2>
          <p>Selected Car: {selectedCar.name}</p>
          <p>Price: {selectedCar.price}</p>
          <button
            onClick={confirmBooking}
            className="btn btn-success confirm-button"
          >
            Book Now
          </button>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <h2>Enter Your Name</h2>
          <form onSubmit={handleConfirmBooking}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <button type="submit" className="btn btn-primary">
              Confirm Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CarBooking;
