import { useEffect, useState } from "react";
import axios from "axios";
import "./ExchangeRequest.css";

export default function ExchangeRequest() {
  const [requests, setRequests] = useState([]);
  const [medications, setMedications] = useState({});
  const [pharmacies, setPharmacies] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");

  const pharmacyId = localStorage.getItem("userId");

  useEffect(() => {
    getRequests();
  }, []);

  async function getRequests() {
    try {
      const { data } = await axios.get(
        "https://pharmalink-back-end.onrender.com/exchange-pharm"
      );

      const filteredRequests = data.filter(
        (item) =>
          String(item.to_pharm_id) === String(pharmacyId) &&
          (item.status === "Pending" ||
            item.status === "Approved")
      );

      setRequests(filteredRequests);

      filteredRequests.forEach((request) => {
        getMedicine(request.medication_id);
        getPharmacy(request.from_pharm_id);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getMedicine(id) {
    try {
      if (medications[id]) return;

      const { data } = await axios.get(
        `https://pharmalink-back-end.onrender.com/medications/${id}`
      );

      setMedications((prev) => ({
        ...prev,
        [id]: data,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async function getPharmacy(id) {
    try {
      if (pharmacies[id]) return;

      const { data } = await axios.get(
        `https://pharmalink-back-end.onrender.com/pharm-info/${id}`
      );

      setPharmacies((prev) => ({
        ...prev,
        [id]: data,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  const displayedRequests = requests.filter((request) => {
    if (filterStatus === "all") return true;

    return request.status === filterStatus;
  });

  if (requests.length === 0) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <div className="filter-buttons">
        <button onClick={() => setFilterStatus("all")}>
          All
        </button>

        <button
          onClick={() => setFilterStatus("Pending")}
        >
          Pending
        </button>

        <button
          onClick={() => setFilterStatus("Approved")}
        >
          Approved
        </button>
      </div>

      {displayedRequests.map((request) => (
        <div
          className="request-card"
          key={request.request_id}
        >
          <div className="request-info">
            <h2>
              {
                pharmacies[
                  request.from_pharm_id
                ]?.pharm_name
              }
            </h2>

            <p>
              <strong>Medicine:</strong>{" "}
              {
                medications[
                  request.medication_id
                ]?.medication_name
              }
            </p>

            <p>
              <strong>Quantity:</strong>{" "}
              {request.quantity_requested}
            </p>
          </div>

          <div className="request-actions">
            {request.status === "Pending" && (
              <>
                <button
                  className="approve-btn"
                  onClick={() => {
                    setRequests((prev) =>
                      prev.map((item) =>
                        item.request_id ===
                        request.request_id
                          ? {
                              ...item,
                              status: "Approved",
                            }
                          : item
                      )
                    );
                  }}
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() => {
                    setRequests((prev) =>
                      prev.map((item) =>
                        item.request_id ===
                        request.request_id
                          ? {
                              ...item,
                              status: "Rejected",
                            }
                          : item
                      )
                    );
                  }}
                >
                  Reject
                </button>
              </>
            )}

            {request.status === "Approved" && (
              <span className="approved-status">
                ✓ Approved
              </span>
            )}

            {request.status === "Rejected" && (
              <span className="rejected-status">
                ✕ Rejected
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}