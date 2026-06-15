import { useTranslation } from 'react-i18next';
import { FiSearch, FiShield, FiClock, FiPaperclip } from 'react-icons/fi';

export default function WhyUs() {
  const { t } = useTranslation();

  const cards = [
    { icon: <FiSearch />,    title: t('why.cards.search.title'),        desc: t('why.cards.search.desc') },
    { icon: <FiShield />,    title: t('why.cards.trusted.title'),       desc: t('why.cards.trusted.desc') },
    { icon: <FiClock />,     title: t('why.cards.delivery.title'),      desc: t('why.cards.delivery.desc') },
    { icon: <FiPaperclip />, title: t('why.cards.prescriptions.title'), desc: t('why.cards.prescriptions.desc') },
  ];

  return (
    <section className="hp-section">
      <div className="container">

        {/* Header */}
        <div className="hp-section-head text-center">
          <h2 className="hp-section-title">{t('why.title')}</h2>
          <p className="hp-section-sub">{t('why.subtitle')}</p>
        </div>

        {/* Grid */}
        <div className="hp-why-grid">
          {cards.map((card, i) => (
            <div key={i} className="hp-why-card">
              <div className="hp-why-icon">{card.icon}</div>
              <h3 className="hp-why-title">{card.title}</h3>
              <p className="hp-why-desc">{card.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
