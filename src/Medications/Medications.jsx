import { useEffect, useState } from "react";
import axios from "axios";

export default function Medications() {

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

    <div>

      <h1>Medicines</h1>

      {medications.map((medicine) => (

        <div key={medicine.medication_id}>

          <h3>{medicine.medication_name}</h3>

        </div>

      ))}

    </div>

  );

}