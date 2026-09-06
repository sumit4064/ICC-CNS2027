import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Countdown } from '../components/Countdown';
import { StatCounter } from '../components/StatCounter';
import { SpeakerCard } from '../components/SpeakerCard';
import { SpeakerModal } from '../components/SpeakerModal';
import { ConferenceIntro } from '../components/ConferenceIntro';
import {
  Calendar,
  MapPin,
  Laptop,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Building,
  GraduationCap,
  Award,
  Globe2,
  Users,
  Lightbulb,
  FileCheck,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Download
} from 'lucide-react';

let hasPlayedIntroSession = false;

export const Home = () => {
  const [showIntro, setShowIntro] = useState(!hasPlayedIntroSession);
  const [conference, setConference] = useState(null);
  const [dates, setDates] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [confRes, datesRes, tracksRes, speakersRes] = await Promise.all([
          api.getConference(),
          api.getDates(),
          api.getTracks(),
          api.getSpeakers()
        ]);

        if (confRes.success) setConference(confRes.data);
        if (datesRes.success) setDates(datesRes.data);
        if (tracksRes.success) setTracks(tracksRes.data);
        if (speakersRes.success) setSpeakers(speakersRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = conference?.dynamicStats || conference?.stats || {
    speakers: '6+',
    countries: '6+',
    registered: '1+'
  };

  const whyAttendCards = [
    {
      icon: <Lightbulb size={24} color="#FF6B35" />,
      title: "Research & Innovation",
      desc: "Engage with groundbreaking paradigms in Cognitive AI, Deep Neural Architectures, and 5G/6G autonomous networking systems."
    },
    {
      icon: <Users size={24} color="#00B4D8" />,
      title: "Academic Collaboration",
      desc: "Foster cross-institutional research partnerships with leading scholars from top global universities and research laboratories."
    },
    {
      icon: <Building size={24} color="#10B981" />,
      title: "Industry Interaction",
      desc: "Connect with high-tech enterprise leaders deploying cognitive IoT, zero-trust cloud infrastructure, and distributed AI."
    },
    {
      icon: <Globe2 size={24} color="#A855F7" />,
      title: "Global Networking",
      desc: "Hybrid mode infrastructure allowing seamless in-person and virtual interactive sessions with scholars worldwide."
    },
    {
      icon: <Award size={24} color="#FF6B35" />,
      title: "Knowledge Exchange",
      desc: "Doctoral symposiums, interactive poster sessions, and keynote presentations by renowned IEEE and international scientists."
    },
    {
      icon: <FileCheck size={24} color="#00B4D8" />,
      title: "Publication Opportunities",
      desc: "Accepted and presented papers will be submitted for indexing in conference proceedings series as announced by organizers."
    }
  ];

  const faqs = [
    {
      q: "Who can attend and present at ICC-CNS 2027?",
      a: "The conference is open to academic researchers, faculty members, Ph.D. scholars, undergraduate and postgraduate students, industry professionals, and scientists interested in Cognitive Computing, AI, and Next-Gen Networking Systems."
    },
    {
      q: "How can I submit my research paper?",
      a: "Authors can submit their manuscripts directly through the online Paper Submission Portal in PDF or DOCX format following standard double-blind review formatting templates."
    },
    {
      q: "Is online / virtual presentation available?",
      a: "Yes! ICC-CNS 2027 operates in full Hybrid Mode, allowing remote authors and delegates to present their accepted papers and join interactive keynote sessions virtually."
    },
    {
      q: "Where is the conference held?",
      a: "The conference is hosted on-campus at Vignan's Foundation for Science, Technology and Research (VFSTR Deemed to be University), Vadlamudi, Guntur-522213, Andhra Pradesh, India."
    },
    {
      q: "How do I register for the conference?",
      a: "Navigate to the Registration page, select your participant category (Student, Faculty, Industry, International), fill in personal details and paper ID, and complete registration to receive your official pass."
    },
    {
      q: "How can I contact the conference organizers?",
      a: "You can reach the secretariat by email at info@vignan.ac.in or icccns2027@vignan.ac.in, or by phone at +91-863-2344 700 / 701."
    }
  ];

  return (
    <div className="home-page">
      {/* 3.5-4.0s Technological Neural Network Intro Animation Overlay */}
      {showIntro && (
        <ConferenceIntro
          onComplete={() => {
            hasPlayedIntroSession = true;
            setShowIntro(false);
          }}
        />
      )}

      {/* ========================================================
          1. HERO SECTION (Vignan University 2027 International Conference)
         ======================================================== */}
      <section className="hero-section">
        {/* Layered Background Atmosphere System */}
        <div className="hero-bg-layer" aria-hidden="true">
          <div className="hero-glow-bg" />
          <div className="hero-glow-left" />
          <div className="hero-glow-accent" />
          <div className="hero-vignette-overlay" />

          {/* Subtle Technology / Network Constellation Background */}
          <svg className="hero-bg-network-svg" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
            <g opacity="0.35">
              {/* Soft Network Grid & Connection Lines */}
              <line x1="850" y1="120" x2="1100" y2="240" stroke="#00B4D8" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="1100" y1="240" x2="1320" y2="180" stroke="#00E5FF" strokeWidth="1.2" />
              <line x1="1100" y1="240" x2="1200" y2="420" stroke="#FF6B35" strokeWidth="1" strokeDasharray="6 4" />
              <line x1="1200" y1="420" x2="1380" y2="480" stroke="#00B4D8" strokeWidth="1" />
              <line x1="950" y1="360" x2="1200" y2="420" stroke="#00E5FF" strokeWidth="1.2" />
              <line x1="850" y1="120" x2="950" y2="360" stroke="#00B4D8" strokeWidth="0.8" />
              <line x1="680" y1="200" x2="850" y2="120" stroke="#00B4D8" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="680" y1="200" x2="950" y2="360" stroke="#00E5FF" strokeWidth="1" />
              <line x1="950" y1="360" x2="1050" y2="580" stroke="#FF6B35" strokeWidth="1" />

              {/* Glowing Constellation Nodes */}
              <circle cx="850" cy="120" r="3.5" fill="#00E5FF" opacity="0.8" />
              <circle cx="1100" cy="240" r="4.5" fill="#FF6B35" opacity="0.85" />
              <circle cx="1320" cy="180" r="3" fill="#00E5FF" opacity="0.7" />
              <circle cx="1200" cy="420" r="5" fill="#00B4D8" opacity="0.8" />
              <circle cx="1380" cy="480" r="3" fill="#FF6B35" opacity="0.7" />
              <circle cx="950" cy="360" r="4" fill="#00E5FF" opacity="0.9" />
              <circle cx="680" cy="200" r="3" fill="#00B4D8" opacity="0.6" />
              <circle cx="1050" cy="580" r="3.5" fill="#FFA726" opacity="0.75" />

              {/* Orbital Synapse Rings */}
              <circle cx="1100" cy="240" r="60" stroke="#00B4D8" strokeWidth="0.75" strokeDasharray="5 5" opacity="0.25" />
              <circle cx="1200" cy="420" r="90" stroke="#FF6B35" strokeWidth="0.75" strokeDasharray="6 6" opacity="0.2" />
            </g>
          </svg>
        </div>

        <div className="content-container">
          <div className="hero-grid">
            {/* HERO LEFT COLUMN */}
            <div className="hero-left">
              {/* Badges */}
              <div className="hero-badges">
                <span className="hero-badge-date">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B35' }} />
                  {conference?.dates || '11 – 13 JUNE 2027'}
                </span>
                <span className="hero-badge-mode">
                  {conference?.mode || 'HYBRID MODE'}
                </span>
              </div>

              {/* Main Headline with Orange Accent */}
              <h1 className="hero-title">
                {conference?.year || '2027'} International Conference on
                <span className="title-accent">Cognitive Computing and Networking Systems</span>
              </h1>

              {/* Subtitles: Vignan Department & University */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div className="hero-subtitle">
                  <Sparkles size={16} color="#FF6B35" />
                  <span>{conference?.subTitle || 'ORGANIZED BY DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING'}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {conference?.school || 'School of Computing and Informatics'} •{' '}
                  <span style={{ color: '#00B4D8' }}>
                    {conference?.institution || "Vignan's Foundation for Science, Technology and Research (Deemed to be University)"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="hero-description">
                {conference?.description ||
                  "ICC-CNS 2027 is a premier international forum hosted by the Department of Computer Science & Engineering at Vignan's Foundation for Science, Technology and Research (VFSTR), Vadlamudi. The conference brings together leading academicians, researchers, scientists, and industry innovators to exchange and share breakthrough findings in Cognitive Computing, Artificial Intelligence, and Next-Generation Networking Systems."}
              </p>

              {/* Dynamic Stats Row */}
              <div className="hero-stats-row">
                <StatCounter value={stats.speakers || '6+'} label="Speakers" />
                <StatCounter value={stats.countries || '6+'} label="Countries" />
                <StatCounter value={stats.registered || '1+'} label="Registered" />
              </div>

              {/* Action Buttons */}
              <div className="hero-cta-group">
                <Link to="/registration" className="btn-primary-glow">
                  <span>Register Now</span>
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="/assets/brochure/ICC-CNS-2027-Brochure.pdf"
                  download="ICC-CNS-2027-Brochure.pdf"
                  className="btn-secondary-glass"
                  title="Download Official ICC-CNS 2027 Conference Brochure (PDF)"
                >
                  <Download size={18} />
                  <span>Download Brochure</span>
                </a>
                <Link to="/submission" className="btn-secondary-glass">
                  <span>Submit Paper</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Real-time Configurable Countdown Timer */}
              <Countdown targetDate={conference?.targetDate || '2027-06-11T09:00:00.000Z'} />
            </div>

            {/* HERO RIGHT COLUMN: Technical Co-Sponsorship Asset */}
            <div className="hero-right">
              <div className="hero-emblem-container">
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '440px',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '1px solid var(--glass-border-light)',
                  boxShadow: 'var(--shadow-lg), 0 0 35px rgba(0, 180, 216, 0.25)',
                  background: 'rgba(0, 36, 41, 0.85)',
                  backdropFilter: 'blur(16px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src="/images/technical_cosponsorship.png"
                    alt="Technical Co-Sponsorship by IEEE, IEEE ComSoc, ICC-CNS, Vignan's"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* HERO BOTTOM INFO BAR (3 Bento Cards) */}
          <div className="hero-infobar">
            <div className="info-bento-card">
              <div className="info-icon-box">
                <Calendar size={24} />
              </div>
              <div className="info-card-content">
                <h4>{conference?.dates || '11 – 13 June 2027'}</h4>
                <p>Conference Dates</p>
              </div>
            </div>

            <div className="info-bento-card">
              <div className="info-icon-box">
                <MapPin size={24} />
              </div>
              <div className="info-card-content">
                <h4>{conference?.venueName || "Vignan's University (VFSTR)"}</h4>
                <p>{conference?.venueLocation || 'Vadlamudi, Guntur, Andhra Pradesh, India'}</p>
              </div>
            </div>

            <div className="info-bento-card">
              <div className="info-icon-box">
                <Laptop size={24} />
              </div>
              <div className="info-card-content">
                <h4>{conference?.mode || 'Hybrid Mode'}</h4>
                <p>{conference?.modeDetail || 'In-person & Online Virtual'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. BENTO HIGHLIGHTS GRID (About, Dates, Tracks)
         ======================================================== */}
      <section className="bento-section">
        <div className="content-container">
          <div className="bento-grid-3">
            {/* Card 1: About Conference */}
            <div className="bento-card">
              <div>
                <div className="bento-card-header">
                  <h3 className="bento-card-title">About Conference</h3>
                </div>
                <div className="about-bento-content">
                  <div className="about-bento-img-wrap">
                    <img
                      src="/images/vignan_ablock_campus.webp"
                      alt="Vignan Campus"
                      className="about-bento-img"
                    />
                  </div>
                  <p className="about-bento-text">
                    Hosted by the Department of CSE at Vignan University (Est. 1997), ICC-CNS 2027 provides a premier platform for researchers, academicians, and industry engineers to present cutting-edge findings in Cognitive Computing and Intelligent Networking.
                  </p>
                </div>
              </div>
              <Link to="/about" className="btn-card-action">
                <span>Learn More</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Card 2: Important Dates */}
            <div className="bento-card">
              <div>
                <div className="bento-card-header">
                  <h3 className="bento-card-title">Important Dates</h3>
                </div>
                <div className="dates-timeline">
                  {dates.slice(0, 4).map((d) => (
                    <div key={d.id} className="date-timeline-item">
                      <span className="date-pill-badge">{d.displayDate || d.date}</span>
                      <span className="date-timeline-node" />
                      <span className="date-timeline-title">{d.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/dates" className="card-link-more">
                <span>View All Dates</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Card 3: Conference Tracks */}
            <div className="bento-card">
              <div>
                <div className="bento-card-header">
                  <h3 className="bento-card-title">Conference Tracks</h3>
                </div>
                <div className="tracks-bento-list">
                  {tracks.map((t) => (
                    <div key={t.id} className="track-bento-item">
                      <div className="track-bento-left">
                        <div
                          className={`track-num-badge ${
                            t.number === '01' ? 'orange' : t.number === '02' ? 'emerald' : 'blue'
                          }`}
                        >
                          {t.number}
                        </div>
                        <div className="track-bento-info">
                          <h5>{t.name}</h5>
                          <p>{t.summary}</p>
                        </div>
                      </div>
                      <Link to="/tracks" className="track-bento-link">
                        <span>View Topics</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/tracks" className="card-link-more">
                <span>Explore All 3 Tracks</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. WHY ATTEND ICC-CNS 2027 (6 Modern Cards)
         ======================================================== */}
      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="content-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="page-header-badge">Why Participate</span>
            <h2 className="section-title">Key Conference Highlights</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0.8rem auto 0' }}>
              Experience high-impact scholarly exchange, international networking, and technical innovation at Vignan University.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.8rem'
          }}>
            {whyAttendCards.map((card, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  marginBottom: '1.2rem'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    minWidth: '50px',
                    flexShrink: 0,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--glass-border)'
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0, lineHeight: '1.35' }}>
                    {card.title}
                  </h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. KEYNOTE & INVITED SPEAKERS
         ======================================================== */}
      <section className="speakers-section">
        <div className="content-container">
          <div className="section-header-row">
            <div>
              <span className="page-header-badge" style={{ marginBottom: '0.4rem' }}>Global Thought Leaders</span>
              <h2 className="section-title">Keynote Speakers</h2>
            </div>
            <Link to="/speakers" className="btn-card-action">
              <span>View All Speakers</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="speakers-grid">
            {speakers.slice(0, 4).map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                onClick={(sp) => setSelectedSpeaker(sp)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. PUBLICATION INFORMATION NOTICE (Configurable)
         ======================================================== */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="content-container">
          <div className="glass-panel" style={{
            padding: '2.5rem',
            background: 'rgba(0, 31, 36, 0.88)',
            borderLeft: '4px solid var(--accent-orange)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <BookOpen size={24} color="var(--accent-orange)" />
              <h3 style={{ color: '#FFF', fontSize: '1.4rem' }}>Publication & Proceedings Information</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              {conference?.publicationInfo?.notice ||
                'All accepted, registered, and presented papers will be submitted for publication and indexation in indexed conference proceedings (Scopus / IEEE / Springer indexed series) subject to official conference approval.'}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span><strong>Status:</strong> {conference?.publicationInfo?.status || 'Announced by Organizers'}</span>
              <span><strong>Publisher:</strong> {conference?.publicationInfo?.publisher || 'Conference Proceedings Series'}</span>
              <span><strong>ISBN / Indexing:</strong> {conference?.publicationInfo?.isbn || 'To be announced'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. FREQUENTLY ASKED QUESTIONS (FAQ Accordion)
         ======================================================== */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="content-container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="page-header-badge">Common Queries</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '1.2rem 1.6rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <HelpCircle size={18} color="var(--accent-orange)" />
                    {faq.q}
                  </h4>
                  <ChevronDown
                    size={20}
                    color="var(--text-muted)"
                    style={{
                      transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform var(--transition-normal)'
                    }}
                  />
                </div>
                {activeFaq === idx && (
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    marginTop: '0.8rem',
                    paddingTop: '0.8rem',
                    borderTop: '1px solid var(--glass-border)'
                  }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. REGISTRATION CTA BANNER
         ======================================================== */}
      <section style={{ padding: '0 0 6rem' }}>
        <div className="content-container">
          <div
            className="glass-panel glass-panel-glow"
            style={{
              padding: '3.5rem 2.5rem',
              textAlign: 'center',
              background:
                'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.15) 0%, rgba(0, 43, 48, 0.85) 70%)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span className="badge badge-orange" style={{ marginBottom: '1.2rem' }}>
              Registrations Are Open for 2027
            </span>
            <h2 style={{ fontSize: '2.5rem', color: '#FFF', marginBottom: '1rem' }}>
              Join Global Researchers at Vignan University for ICC-CNS 2027
            </h2>
            <p
              style={{
                maxWidth: '640px',
                margin: '0 auto 2rem',
                fontSize: '1.05rem',
                color: 'var(--text-secondary)'
              }}
            >
              Present your research paper, interact with international keynote scientists, and participate in technical tracks either in-person at Vadlamudi or online via hybrid streaming.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
              <Link to="/registration" className="btn-primary-glow">
                <span>Register as Participant</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/submission" className="btn-secondary-glass">
                <span>Submit Your Paper</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Speaker Biography Modal */}
      <SpeakerModal speaker={selectedSpeaker} onClose={() => setSelectedSpeaker(null)} />
    </div>
  );
};
