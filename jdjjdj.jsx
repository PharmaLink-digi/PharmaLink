// import React from "react";
// import "./Home.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaSearch, FaChevronLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="home-page">
//       <div className="blur-circle left"></div>
//       <div className="blur-circle right"></div>

//       <div className="container">
//         <div className="hero-section text-center">
//           {/* badge */}
//           <div className="platform-badge">
//             <span className="dot"></span>
//             المنصة الصحية الرائدة
//           </div>

//           {/* title */}
//           <h1 className="hero-title">
//             صحتك، <span>مرتابة</span>
//           </h1>

//           {/* desc */}
//           <p className="hero-description">
//             منصة متكاملة تربط المرضى والصيدليات والمستودعات
//             وشركات الأدوية في نظام بيئي صحي موحد
//           </p>

//           {/* search */}
//           <div className="search-container">
//             <button className="search-btn">
//               بحث
//             </button>

//             <div className="input-wrapper">
//               <input
//                 type="text"
//                 placeholder="ابحث عن دواء أو مادة فعالة..."
//               />
//               <FaSearch className="search-icon" />
//             </div>
//           </div>

//           {/* buttons */}
//           <div className="action-buttons">
//             <button
//               className="browse-btn"
//               onClick={() => navigate("/search")}
//             >
//               تصفح الأدوية
//               <FaChevronLeft />
//             </button>

//             <button
//               className="start-btn"
//               onClick={() => navigate("/signup")}
//             >
//               ابدأ الآن
//             </button>
//           </div>

//           {/* stats */}
//           <div className="stats-container">
//             <div className="stat-box">
//               <h3>+50K</h3>
//               <span>مريض</span>
//             </div>

//             <div className="stat-box">
//               <h3>+1,200</h3>
//               <span>صيدلية</span>
//             </div>

//             <div className="stat-box">
//               <h3>+10K</h3>
//               <span>دواء</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;










// @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap");

// * {
//   font-family: "Cairo", sans-serif;
// }

// body {
//   background: #f4f7fb;
//   overflow-x: hidden;
// }

// .home-page {
//   min-height: 100vh;
//   background: linear-gradient(to bottom, #f7f9fc, #eef3f8);
//   position: relative;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   direction: rtl;
//   overflow: hidden;
// }

// /* Background blur */
// .blur-circle {
//   position: absolute;
//   border-radius: 50%;
//   filter: blur(120px);
//   z-index: 0;
// }

// .blur-circle.left {
//   width: 350px;
//   height: 350px;
//   background: rgba(91, 213, 255, 0.18);
//   bottom: -50px;
//   left: -100px;
// }

// .blur-circle.right {
//   width: 300px;
//   height: 300px;
//   background: rgba(0, 115, 255, 0.08);
//   top: 80px;
//   right: -100px;
// }

// .hero-section {
//   position: relative;
//   z-index: 2;
//   width: 100%;
//   max-width: 900px;
//   padding: 20px;
// }

// .platform-badge {
//   display: inline-flex;
//   align-items: center;
//   gap: 8px;
//   background: #e8f0ff;
//   color: #1d4ed8;
//   padding: 8px 18px;
//   border-radius: 30px;
//   font-size: 14px;
//   margin-bottom: 25px;
// }

// .dot {
//   width: 8px;
//   height: 8px;
//   background: #3b82f6;
//   border-radius: 50%;
// }

// .hero-title {
//   font-size: 70px;
//   font-weight: 800;
//   color: #111827;
//   margin-bottom: 15px;
// }

// .hero-title span {
//   background: linear-gradient(90deg, #1d4ed8, #00c2b8);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// }

// .hero-description {
//   color: #64748b;
//   font-size: 26px;
//   line-height: 1.9;
//   max-width: 850px;
//   margin: auto;
//   margin-bottom: 40px;
// }

// /* Search */
// .search-container {
//   background: #fff;
//   border-radius: 25px;
//   box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
//   display: flex;
//   align-items: center;
//   padding: 8px;
//   max-width: 850px;
//   margin: auto;
// }

// .search-btn {
//   background: linear-gradient(90deg, #2563eb, #00c2b8);
//   border: none;
//   color: white;
//   border-radius: 18px;
//   padding: 14px 35px;
//   font-size: 18px;
//   font-weight: 600;
//   transition: 0.3s;
// }

// .search-btn:hover {
//   transform: scale(1.03);
// }

// .input-wrapper {
//   flex: 1;
//   position: relative;
// }

// .input-wrapper input {
//   width: 100%;
//   border: none;
//   outline: none;
//   padding: 15px 50px 15px 20px;
//   font-size: 18px;
//   background: transparent;
// }

// .search-icon {
//   position: absolute;
//   left: 18px;
//   top: 50%;
//   transform: translateY(-50%);
//   color: #94a3b8;
//   font-size: 20px;
// }

// /* Buttons */
// .action-buttons {
//   display: flex;
//   justify-content: center;
//   gap: 15px;
//   margin-top: 40px;
//   flex-wrap: wrap;
// }

// .start-btn {
//   background: linear-gradient(90deg, #2563eb, #00c2b8);
//   border: none;
//   color: white;
//   padding: 15px 35px;
//   border-radius: 18px;
//   font-size: 18px;
//   font-weight: 600;
// }

// .browse-btn {
//   background: white;
//   border: 1px solid #d7dde8;
//   color: #1e293b;
//   padding: 15px 35px;
//   border-radius: 18px;
//   font-size: 18px;
//   display: flex;
//   align-items: center;
//   gap: 10px;
// }

// /* Stats */
// .stats-container {
//   margin-top: 50px;
//   display: flex;
//   justify-content: center;
//   gap: 60px;
//   flex-wrap: wrap;
// }

// .stat-box h3 {
//   font-size: 40px;
//   font-weight: 800;
//   background: linear-gradient(90deg, #2563eb, #00c2b8);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// }

// .stat-box span {
//   color: #64748b;
//   font-size: 18px;
// }

// /* Responsive */
// @media (max-width: 768px) {
//   .hero-title {
//     font-size: 45px;
//   }

//   .hero-description {
//     font-size: 18px;
//   }

//   .search-container {
//     flex-direction: column;
//     gap: 10px;
//   }

//   .search-btn {
//     width: 100%;
//   }

//   .action-buttons {
//     flex-direction: column;
//   }

//   .browse-btn,
//   .start-btn {
//     width: 100%;
//   }
// }