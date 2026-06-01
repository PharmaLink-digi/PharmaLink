import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { FiSearch, FiShield, FiClock, FiPaperclip } from "react-icons/fi";

function WhyUs() {
  const { t } = useTranslation();
  const cards = [
    {
      icon: <FiSearch />, 
      title: t("why.cards.search.title"),
      desc: t("why.cards.search.desc")
    },
    {
      icon: <FiShield />, 
      title: t("why.cards.trusted.title"),
      desc: t("why.cards.trusted.desc")
    },
    {
      icon: <FiClock />, 
      title: t("why.cards.delivery.title"),
      desc: t("why.cards.delivery.desc")
    },
    {
      icon: <FiPaperclip />, 
      title: t("why.cards.prescriptions.title"),
      desc: t("why.cards.prescriptions.desc")
    },
  ];

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family: Arial, Helvetica, sans-serif;
        }
        body{
          background:#ffffff;
        }
        .why-section{
          padding:90px 0;
          background:#ffffff;
        }
        .main-title{
          font-size:32px;
          font-weight:700;
          color:#001847;
          margin-bottom:10px;
        }
        .sub-title{
          font-size:14px;
          color:#6c7a96;
          margin-bottom:70px;
        }
        .feature-card{
          background:#ffffff;
          border:1px solid #dde4ef;
          border-radius:18px;
          padding:24px;
          height:195px;
          transition:0.3s;
          cursor:pointer;
          text-align:left;
        }
        .feature-card:hover{
          transform:translateY(-8px);
          box-shadow:0 12px 30px rgba(0,0,0,0.08);
        }
        .icon-box{
          width:48px;
          height:48px;
          border-radius:15px;
          background:linear-gradient(135deg,#1769ff,#00c2cb);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          font-size:22px;
          margin-bottom:28px;
        }
        .feature-title{
          font-size:16px;
          font-weight:700;
          color:#001847;
          margin-bottom:10px;
        }
        .feature-desc{
          font-size:13px;
          line-height:1.7;
          color:#6c7a96;
          width:90%;
          margin:0;
        }
      `}</style>
      <section className="why-section">
        <div className="container-fluid px-4">
          <div className="text-center">
            <h2 className="main-title">{t("why.title")}</h2>
            <p className="sub-title">{t("why.subtitle")}</p>
          </div>
          <div className="row justify-content-center g-4 mt-4">
            {cards &&
              cards.map((card, index) => (
                <div className="col-xl-3 col-lg-4 col-md-6" key={index}>
                  <div className="feature-card">
                    <div className="icon-box">{card?.icon}</div>
                    <h3 className="feature-title">{card?.title}</h3>
                    <p className="feature-desc">{card?.desc}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default WhyUs;
