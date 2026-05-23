import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

function App() {

  const [medications, setMedications] = useState([]);

  useEffect(() => {

    axios
      .get("https://pharmalink-back-end-2.onrender.com/getmedications")

      .then((response) => {

        setMedications(response.data.slice(0, 8));

      })

      .catch((error) => {

        console.log(error);

      });

  }, []);

  return (

    <div style={{ padding: "40px" }}>

      <h1>Trending Medicines</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >

        {medications.map((medicine) => (

          <div
            key={medicine.medication_id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
            }}
          >

            <h3>{medicine.medication_name}</h3>

            <p>{medicine.medication_type}</p>

            <p>{medicine.category}</p>

          </div>

        ))}

      </div>

    </div>

  );
}

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    <App />

  </React.StrictMode>

);