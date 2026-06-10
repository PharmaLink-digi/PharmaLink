import { useEffect, useState } from "react";
import axios from "axios";
import "./Order.css";

export default function Order() {
    const [orderId, setOrderId] = useState(84691);

    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getOrder = async () => {
            try {
                const { data } = await axios.get(
                    "https://pharmalink-back-end.onrender.com/order-details"
                );

                const filteredOrder = data.filter(
                    (item) => item.order_id === Number(orderId)
                );

                setOrderItems(filteredOrder);
            } catch (err) {
                setError("Failed to load order details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (orderItems.length === 0) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    Order Not Found
                </div>
            </div>
        );
    }

    const orderInfo = orderItems?.[0];

    const totalPrice = orderItems.reduce(
        (sum, item) => sum + Number(item.line_total),
        0
    );

    const totalQuantity = orderItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    return (
        <div
            className="container py-4"
            style={{
                maxWidth: "1100px",
                direction: "rtl",
            }}
        >
            {/* Breadcrumb */}

            <div className="mb-4 text-muted text-end">
                الطلبات /{" "}
                <span className="fw-bold text-dark">
                    طلب #{orderInfo.order_id}
                </span>
            </div>

            {/* Header Card */}

            <div className="card order-header shadow-sm mb-4">
                <div className="card-body d-flex justify-content-between align-items-center">


                    <div>
                        <h3 className="fw-bold mb-2">
                            طلب رقم #{orderInfo.order_id}
                        </h3>

                        <p className="text-muted mb-0">
                            Pharmacy #{orderInfo.pharm_id}
                            {" • "}
                            {new Date(
                                orderInfo.order_date
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    <span className="status-badge">
                        delivered
                    </span>

                </div>
            </div>

            {/* Tracking */}

            <div className="card border-0 rounded-4 mb-4 shadow-sm">
                <div className="card-body p-4">

                    <h5 className="fw-bold mb-5">
                        تتبع الطلب
                    </h5>

                    <div className="position-relative">

                        <div
                            style={{
                                position: "absolute",
                                top: "28px",
                                left: "10%",
                                right: "10%",
                                height: "4px",
                                background: "#dbeafe",
                                zIndex: 1
                            }}
                        />

                        <div className="row text-center position-relative" style={{ zIndex: 2 }}>

                            <div className="col">
                                <div
                                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 56,
                                        height: 56,
                                        background: "#2563eb",
                                        color: "#fff"
                                    }}
                                >
                                    <i className="bi bi-clipboard-check fs-4"></i>
                                </div>

                                <p className="mt-2 fw-semibold mb-1">
                                    تم الطلب
                                </p>

                                <small className="text-muted">
                                    Jan 21 
                                    10:00 am
                                </small>
                            </div>

                            <div className="col">
                                <div
                                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 56,
                                        height: 56,
                                        background: "#2563eb",
                                        color: "#fff"
                                    }}
                                >
                                    <i className="bi bi-box-seam fs-4"></i>
                                </div>

                                <p className="mt-2 fw-semibold mb-1">
                                    قيد المعالجة
                                </p>

                                <small className="text-muted">
                                    Jan 21
                                    10:30 pm
                                </small>
                            </div>

                            <div className="col">
                                <div
                                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 56,
                                        height: 56,
                                        background: "#2563eb",
                                        color: "#fff"
                                    }}
                                >
                                    <i className="bi bi-truck fs-4"></i>
                                </div>

                                <p className="mt-2 fw-semibold mb-1">
                                    تم الشحن
                                </p>

                                <small className="text-muted">
                                    Jan 21
                                    11:00 pm
                                </small>
                            </div>

                            <div className="col">
                                <div
                                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 56,
                                        height: 56,
                                        background: "#2563eb",
                                        color: "#fff"
                                    }}
                                >
                                    <i className="bi bi-check-lg fs-3"></i>
                                </div>

                                <p className="mt-2 fw-semibold mb-1">
                                    تم التوصيل
                                </p>

                                <small className="text-muted">
                                    Jan 21
                                    11:30 pm
                                </small>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Order Items */}

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">

                    <h4 className="fw-bold text-end mb-4">
                        عناصر الطلب
                    </h4>

                    {orderItems.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            لا توجد تفاصيل
                        </div>
                    ) : (
                        <>
                            {orderItems.map((item) => (
                                <div
                                    key={item.order_detail_id}
                                    className="border-bottom py-3"
                                >
                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>
                                            <h6 className="fw-bold mb-1">
                                                {item.medication_name}
                                            </h6>

                                            <small className="text-muted">
                                                {item.category}
                                            </small>
                                        </div>

                                        <div className="text-start">
                                            <div>
                                                الكمية: {item.quantity}
                                            </div>

                                            <div>
                                                سعر الوحدة: {item.unit_price} EGP
                                            </div>

                                            <div className="fw-bold text-primary">
                                                {item.line_total} EGP
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}

                            <div className="mt-4 pt-3">

                                <div className="d-flex justify-content-between mb-2">
                                    <h5>إجمالي الكمية</h5>
                                    <h5>{totalQuantity}</h5>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between">

                                    <h3 className="fw-bold">
                                        الإجمالي
                                    </h3>

                                    <h3 className="fw-bold text-primary">
                                        {totalPrice.toFixed(2)} EGP
                                    </h3>

                                </div>

                            </div>
                        </>
                    )}

                </div>
            </div>

        </div>
    );
}
