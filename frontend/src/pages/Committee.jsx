import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { resolveImageUrl } from '../utils/imageUrl';
import {
  Shield,
  Award,
  Users,
  Search,
  Sparkles,
  Building2,
  Globe2,
  Mail,
  Briefcase,
  X,
  RotateCcw,
  UserCheck,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

const HONORARY_CHAIRS = [
  {
    id: 'honorary-chair-1',
    _id: 'honorary-chair-1',
    name: 'Prof. Jinsong Wu',
    institution: 'University of Chile, Chile',
    category: 'Honorary Chairs',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'honorary-chair-2',
    _id: 'honorary-chair-2',
    name: 'Dr. Alvaro Rocha',
    institution: 'Vice-Chair of IEEE SMC Portugal Chapter, Professor ISEG, University of Lisbon, Lisboa, Portugal',
    category: 'Honorary Chairs',
    displayOrder: 2,
    isActive: true
  }
];

const INTERNATIONAL_ADVISORY_CHAIRS = [
  {
    id: 'intl-adv-chair-1',
    _id: 'intl-adv-chair-1',
    name: 'Prof. Dr. Nan Yang',
    institution: 'ANU College of Systems and Society, Australian National University, Australia',
    category: 'International Advisory Chairs',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'intl-adv-chair-2',
    _id: 'intl-adv-chair-2',
    name: 'Dr. Rui Dinis',
    institution: 'FCT-UNL and Researcher, Instituto de Telecomunicações, Portugal',
    category: 'International Advisory Chairs',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'intl-adv-chair-3',
    _id: 'intl-adv-chair-3',
    name: 'Dr. Jinwei Liu',
    institution: 'Florida A&M University, United States',
    category: 'International Advisory Chairs',
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'intl-adv-chair-4',
    _id: 'intl-adv-chair-4',
    name: 'Dr. Sinem Coleri',
    institution: 'Koc University, Turkey',
    category: 'International Advisory Chairs',
    displayOrder: 4,
    isActive: true
  }
];

const INTERNATIONAL_ADVISORY_COMMITTEE = [
  {
    id: 'intl-adv-comm-1',
    _id: 'intl-adv-comm-1',
    name: 'Dr. Tomonobu Senjyu',
    institution: 'Professor, University of the Ryukyus, Okinawam, Japan',
    category: 'International Advisory Committee',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'intl-adv-comm-2',
    _id: 'intl-adv-comm-2',
    name: 'Dr. Francesco Zirlilli',
    institution: 'Professor (retired), Sapienza Universita, Roma, Italy',
    category: 'International Advisory Committee',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'intl-adv-comm-3',
    _id: 'intl-adv-comm-3',
    name: 'Dr. Dariusz Jacek Jakóbczak',
    institution: 'Koszalin University of Technology, Poland',
    category: 'International Advisory Committee',
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'intl-adv-comm-4',
    _id: 'intl-adv-comm-4',
    name: 'Dr. Addison Salazar',
    institution: 'Universitat Politècnica de València, Spain',
    category: 'International Advisory Committee',
    displayOrder: 4,
    isActive: true
  },
  {
    id: 'intl-adv-comm-5',
    _id: 'intl-adv-comm-5',
    name: 'Dr. Debdatta Sinha Roy',
    institution: 'Sr. Research Scientist, Oracle Retail Data Science R&D, Burlington, USA',
    category: 'International Advisory Committee',
    displayOrder: 5,
    isActive: true
  },
  {
    id: 'intl-adv-comm-6',
    _id: 'intl-adv-comm-6',
    name: 'Dr. Grigorios N. Beligiannis',
    institution: 'University of Patras - Agrinio Campus, Greece',
    category: 'International Advisory Committee',
    displayOrder: 6,
    isActive: true
  },
  {
    id: 'intl-adv-comm-7',
    _id: 'intl-adv-comm-7',
    name: 'Dr. Tzung-Pei Hong',
    institution: 'Professor, National University of Kaohsiung, Taiwan',
    category: 'International Advisory Committee',
    displayOrder: 7,
    isActive: true
  },
  {
    id: 'intl-adv-comm-8',
    _id: 'intl-adv-comm-8',
    name: 'Dr. Ayodeji Olalekan Salau',
    institution: 'Afe Babalola University, Nigeria',
    category: 'International Advisory Committee',
    displayOrder: 8,
    isActive: true
  },
  {
    id: 'intl-adv-comm-9',
    _id: 'intl-adv-comm-9',
    name: 'Dr. Leila Bayoudhi',
    institution: 'University of Monastir, Tunisia',
    category: 'International Advisory Committee',
    displayOrder: 9,
    isActive: true
  },
  {
    id: 'intl-adv-comm-10',
    _id: 'intl-adv-comm-10',
    name: 'Dr. Selim Hossain',
    institution: 'Hajee Mohammad Danesh Science & Technology University, Dinajpur, Bangladesh',
    category: 'International Advisory Committee',
    displayOrder: 10,
    isActive: true
  },
  {
    id: 'intl-adv-comm-11',
    _id: 'intl-adv-comm-11',
    name: 'Dr. Yik-Chung Wu',
    institution: 'The University of Hong Kong, Hong Kong',
    category: 'International Advisory Committee',
    displayOrder: 11,
    isActive: true
  },
  {
    id: 'cm-09',
    _id: 'cm-09',
    name: 'Ching-Hsien Hsu',
    role: 'Advisory Committee Member',
    institution: 'Asia University',
    category: 'International Advisory Committee',
    country: 'Taiwan',
    displayOrder: 12,
    isActive: true
  },
  {
    id: 'cm-10',
    _id: 'cm-10',
    name: 'Ren-Hung Hwang',
    role: 'Advisory Committee Member',
    institution: 'Asia University',
    category: 'International Advisory Committee',
    country: 'Taiwan',
    displayOrder: 13,
    isActive: true
  }
];

const NATIONAL_ADVISORY_COMMITTEE = [
  {
    id: 'nat-adv-comm-1',
    _id: 'nat-adv-comm-1',
    name: 'Dr. Gopal Rawat',
    institution: 'Indian Institute of Technology Mandi, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'nat-adv-comm-2',
    _id: 'nat-adv-comm-2',
    name: 'Dr. B. K. Roy',
    institution: 'National Institute of Technology Silchar, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'nat-adv-comm-3',
    _id: 'nat-adv-comm-3',
    name: 'Dr. Umesh C. Pati',
    institution: 'National Institute of Technology Rourkela, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'nat-adv-comm-4',
    _id: 'nat-adv-comm-4',
    name: 'Dr. Shailendra K. Dwivedi',
    institution: 'Maulana Azad National Institute of Technology Bhopal, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 4,
    isActive: true
  },
  {
    id: 'nat-adv-comm-5',
    _id: 'nat-adv-comm-5',
    name: 'Dr. Brijesh Kumar',
    institution: 'Indira Gandhi Delhi Technical University, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 5,
    isActive: true
  },
  {
    id: 'nat-adv-comm-6',
    _id: 'nat-adv-comm-6',
    name: 'Dr. M. Thenmozhi',
    institution: 'Puducherry Technological University, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 6,
    isActive: true
  },
  {
    id: 'nat-adv-comm-7',
    _id: 'nat-adv-comm-7',
    name: 'Dr. K. L. V. Sai Prakash Sakuru',
    institution: 'National Institute of Technology Warangal, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 7,
    isActive: true
  },
  {
    id: 'nat-adv-comm-8',
    _id: 'nat-adv-comm-8',
    name: 'Dr. Tajinder Singh Arora',
    institution: 'National Institute of Technology Uttarakhand, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 8,
    isActive: true
  },
  {
    id: 'nat-adv-comm-9',
    _id: 'nat-adv-comm-9',
    name: 'Dr. Subhojit Ghosh',
    institution: 'National Institute of Technology Raipur, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 9,
    isActive: true
  },
  {
    id: 'nat-adv-comm-10',
    _id: 'nat-adv-comm-10',
    name: 'Dr. Anuradha Banerjee',
    institution: 'Kalyani Government Engineering College, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 10,
    isActive: true
  },
  {
    id: 'nat-adv-comm-11',
    _id: 'nat-adv-comm-11',
    name: 'Dr. Tejavathu Ramesh',
    institution: 'National Institute of Technology Andhra Pradesh, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 11,
    isActive: true
  },
  {
    id: 'nat-adv-comm-12',
    _id: 'nat-adv-comm-12',
    name: 'Dr. Amit Rathi',
    institution: 'Manipal University Jaipur, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 12,
    isActive: true
  },
  {
    id: 'nat-adv-comm-13',
    _id: 'nat-adv-comm-13',
    name: 'Dr. Virender Ranga',
    institution: 'Delhi Technological University, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 13,
    isActive: true
  },
  {
    id: 'nat-adv-comm-14',
    _id: 'nat-adv-comm-14',
    name: 'Dr. Ngangbam Herojit Singh',
    institution: 'National Institute of Technology Agartala, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 14,
    isActive: true
  },
  {
    id: 'nat-adv-comm-15',
    _id: 'nat-adv-comm-15',
    name: 'Dr. Jayendra Kumar',
    institution: 'National Institute of Technology Jamshedpur, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 15,
    isActive: true
  },
  {
    id: 'nat-adv-comm-16',
    _id: 'nat-adv-comm-16',
    name: 'Dr. Anirban Banik',
    institution: 'National Institute of Technology Sikkim, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 16,
    isActive: true
  },
  {
    id: 'nat-adv-comm-17',
    _id: 'nat-adv-comm-17',
    name: 'Dr. S. Chitra',
    institution: 'Government College of Technology Coimbatore, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 17,
    isActive: true
  },
  {
    id: 'nat-adv-comm-18',
    _id: 'nat-adv-comm-18',
    name: 'Dr. J. Satheesh Kumar',
    institution: 'Dayananda Sagar College of Engineering, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 18,
    isActive: true
  },
  {
    id: 'nat-adv-comm-19',
    _id: 'nat-adv-comm-19',
    name: 'Dr. John Clement Singh C',
    institution: 'Kings Engineering College, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 19,
    isActive: true
  },
  {
    id: 'nat-adv-comm-20',
    _id: 'nat-adv-comm-20',
    name: 'Dr. Nandhini Gayathri',
    institution: 'SASTRA University, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 20,
    isActive: true
  },
  {
    id: 'nat-adv-comm-21',
    _id: 'nat-adv-comm-21',
    name: 'Dr. Dilip Singh Sisodia',
    institution: 'National Institute of Technology Raipur, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 21,
    isActive: true
  },
  {
    id: 'nat-adv-comm-22',
    _id: 'nat-adv-comm-22',
    name: 'Dr. Angeline Vijila D',
    institution: 'PSG College of Technology, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 22,
    isActive: true
  },
  {
    id: 'nat-adv-comm-23',
    _id: 'nat-adv-comm-23',
    name: 'Dr. Bhargava Rama',
    institution: 'Indian Institute of Technology Roorkee, India',
    category: 'National Advisory Committee',
    country: 'India',
    displayOrder: 23,
    isActive: true
  }
];

const syncCommitteeMembers = (membersList = []) => {
  const base = Array.isArray(membersList) ? membersList : [];

  // 1. Remove old "Advisory Committee" and any duplicate "International Advisory Committee"
  const cleaned = base.filter((m) => {
    const cat = (m.category || '').toLowerCase();
    return cat !== 'advisory committee' && cat !== 'international advisory committee';
  });

  // 2. Ensure International Advisory Chairs (avoid duplicates)
  const hasIntlChairs = cleaned.some(
    (m) => (m.category || '').toLowerCase() === 'international advisory chairs'
  );
  const intlChairsToAdd = hasIntlChairs ? [] : INTERNATIONAL_ADVISORY_CHAIRS;

  // 3. Ensure Honorary Chairs (avoid duplicates)
  const hasWu = cleaned.some((m) => (m.name || '').toLowerCase().includes('jinsong wu'));
  const hasRocha = cleaned.some((m) => (m.name || '').toLowerCase().includes('alvaro rocha'));
  const honoraryToAdd = [];
  if (!hasWu) honoraryToAdd.push(HONORARY_CHAIRS[0]);
  if (!hasRocha) honoraryToAdd.push(HONORARY_CHAIRS[1]);

  // 4. Ensure National Advisory Committee (avoid duplicates)
  const hasNatAdv = cleaned.some(
    (m) => (m.category || '').toLowerCase() === 'national advisory committee'
  );
  const natAdvToAdd = hasNatAdv ? [] : NATIONAL_ADVISORY_COMMITTEE;

  return [
    ...cleaned,
    ...intlChairsToAdd,
    ...INTERNATIONAL_ADVISORY_COMMITTEE,
    ...honoraryToAdd,
    ...natAdvToAdd
  ];
};

export const Committee = () => {
  // 1. Instant hydration from client cache if available (0ms initial render)
  const initialCached = useMemo(() => {
    try {
      return api.getCached ? api.getCached('/committee') : null;
    } catch (e) {
      return null;
    }
  }, []);

  const [committee, setCommittee] = useState(() => {
    const cachedData = initialCached?.success && Array.isArray(initialCached.data) ? initialCached.data : [];
    return syncCommitteeMembers(cachedData);
  });
  const [loading, setLoading] = useState(() => !(initialCached?.success && initialCached.data?.length > 0));
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchCommitteeData = useCallback(async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await api.getCommittee();
      if (res.success && res.data) {
        setCommittee(syncCommitteeMembers(res.data));
      } else if (!committee.length) {
        setError('Unable to load committee members.');
      }
    } catch (err) {
      console.error('Failed to load committee:', err);
      if (!committee.length) {
        setError(err.message || 'Unable to load committee members.');
      }
    } finally {
      setLoading(false);
    }
  }, [committee.length]);

  useEffect(() => {
    const hasCached = Boolean(initialCached?.success && initialCached.data?.length > 0);
    fetchCommitteeData(hasCached);
  }, [fetchCommitteeData, initialCached]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filterTabs = [
    'All',
    'Patrons & Leadership',
    'Advisory Committees',
    'Technical Program (TPC)',
    'Organizing Committees'
  ];

  // Map individual category string to top-level filter tab
  const getTabForCategory = (categoryName = '') => {
    const name = categoryName.toLowerCase();
    if (
      name.includes('patron') ||
      name.includes('general chair') ||
      name.includes('organizing chair') ||
      name.includes('honorary chair') ||
      name.includes('conference chair') ||
      name.includes('publication chair') ||
      name.includes('leadership')
    ) {
      return 'Patrons & Leadership';
    }
    if (name.includes('advisory')) {
      return 'Advisory Committees';
    }
    if (name.includes('technical program committee') || name.includes('tpc')) {
      return 'Technical Program (TPC)';
    }
    return 'Organizing Committees';
  };

  // Canonical preferred order of categories
  const categoryOrderMap = {
    'chief patrons': 1,
    'patrons': 2,
    'general chair': 4,
    'general co-chair': 5,
    'international advisory chairs': 6,
    'international advisory committee': 7,
    'advisory committee': 7,
    'conference chair': 8,
    'conference co-chair': 9,
    'organizing chair': 10,
    'honorary chairs': 11,
    'honorary chair': 11,
    'national advisory committee': 12,
    'technical chairs': 13,
    'technical co-chairs': 14,
    'publication chairs': 15,
    'finance chair': 16,
    'publicity chair': 17,
    'organizing committee': 18,
    'technical program committee': 19,
    'publicity committee': 20,
    'protocol and hospitality committee': 21
  };

  // Group and filter members dynamically
  const { groupedSections, totalMatchingMembers } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Filter members by search & category tab
    const filtered = committee.filter((member) => {
      // Must be active
      if (member.isActive === false) return false;

      // Filter Tab match
      if (selectedFilter !== 'All') {
        const memberTab = getTabForCategory(member.category);
        if (memberTab !== selectedFilter) return false;
      }

      // Search Query match
      if (query) {
        const nameMatch = (member.name || '').toLowerCase().includes(query);
        const roleMatch = (member.role || '').toLowerCase().includes(query);
        const orgMatch = (member.institution || member.org || '').toLowerCase().includes(query);
        const deptMatch = (member.department || '').toLowerCase().includes(query);
        const desigMatch = (member.designation || '').toLowerCase().includes(query);
        const catMatch = (member.category || '').toLowerCase().includes(query);
        const countryMatch = (member.country || '').toLowerCase().includes(query);

        if (!nameMatch && !roleMatch && !orgMatch && !deptMatch && !desigMatch && !catMatch && !countryMatch) {
          return false;
        }
      }

      return true;
    });

    // 2. Group filtered members by category
    const groupMap = new Map();

    filtered.forEach((member) => {
      const cat = member.category || 'Organizing Committee';
      if (!groupMap.has(cat)) {
        groupMap.set(cat, []);
      }
      groupMap.get(cat).push(member);
    });

    // 3. Sort categories according to preferred sequence
    const sortedCategories = Array.from(groupMap.keys()).sort((a, b) => {
      const orderA = categoryOrderMap[a.toLowerCase()] || 99;
      const orderB = categoryOrderMap[b.toLowerCase()] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });

    // Sort members within each group by displayOrder, then name
    const resultGroups = sortedCategories.map((category) => {
      const members = groupMap.get(category).sort((a, b) => {
        const oA = typeof a.displayOrder === 'number' ? a.displayOrder : 9999;
        const oB = typeof b.displayOrder === 'number' ? b.displayOrder : 9999;
        if (oA !== oB) return oA - oB;
        return (a.name || '').localeCompare(b.name || '');
      });
      return {
        category,
        members
      };
    });

    return {
      groupedSections: resultGroups,
      totalMatchingMembers: filtered.length
    };
  }, [committee, selectedFilter, searchQuery]);

  // Initials generator for placeholder avatar
  const getInitials = (name = '') => {
    const clean = name.replace(/^(Dr\.|Prof\.|Sri|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (parts[0] || 'C')[0].toUpperCase();
  };

  return (
    <ErrorBoundary title="Conference Committee could not be loaded." onRetry={fetchCommitteeData}>
      <div className="committee-page">
        {/* 1. HERO SECTION */}
        <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">
            <Sparkles size={14} style={{ marginRight: 6, display: 'inline' }} />
            ICCCNS-2027
          </span>
          <h1 className="page-header-title">Conference Committee</h1>
          <p className="page-header-subtitle">
            Meet the distinguished leaders, researchers, academicians and professionals contributing to ICCCNS-2027.
          </p>
        </div>
      </section>

      {/* 2. BODY SECTION */}
      <section className="page-body-section" style={{ paddingTop: '2rem' }}>
        <div className="content-container" style={{ maxWidth: '1240px' }}>

          {/* Short Introduction */}
          <div className="committee-intro-card">
            <div className="committee-intro-icon">
              <GraduationCap size={24} />
            </div>
            <p className="committee-intro-text">
              The ICCCNS-2027 organizing and technical committees bring together distinguished academic leaders, researchers and professionals who contribute their expertise to the successful organization of the conference.
            </p>
          </div>

          {/* 3. FILTER & SEARCH BAR */}
          <div className="committee-controls-panel">
            {/* Filter Pills */}
            <div className="committee-filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  className={`committee-filter-btn ${selectedFilter === tab ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(tab)}
                >
                  {tab === 'All' && <Users size={16} />}
                  {tab === 'Patrons & Leadership' && <Shield size={16} />}
                  {tab === 'Advisory Committees' && <Globe2 size={16} />}
                  {tab === 'Technical Program (TPC)' && <Award size={16} />}
                  {tab === 'Organizing Committees' && <Building2 size={16} />}
                  <span>{tab}</span>
                </button>
              ))}
            </div>

            {/* Search Input Row */}
            <div className="committee-search-row">
              <div className="committee-search-box">
                <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  className="committee-search-input"
                  placeholder="Search member, role, or institution..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="committee-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Dynamic Results Counter */}
              <div className="committee-results-badge">
                {loading ? 'Loading...' : `${totalMatchingMembers} ${totalMatchingMembers === 1 ? 'member' : 'members'} found`}
              </div>
            </div>
          </div>

          {/* 4. LOADING SKELETON */}
          {loading && (
            <div className="committee-skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="committee-skeleton-card">
                  <div className="skeleton-photo-circle" />
                  <div className="skeleton-line title" />
                  <div className="skeleton-line subtitle" />
                  <div className="skeleton-line org" />
                </div>
              ))}
            </div>
          )}

          {/* 5. ERROR RETRY STATE */}
          {!loading && error && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--surface-white)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '20px',
              maxWidth: '540px',
              margin: '0 auto',
              boxShadow: 'var(--card-shadow)'
            }}>
              <p style={{ color: 'var(--primary-navy)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>
                {error}
              </p>
              <button
                onClick={fetchCommitteeData}
                className="btn-primary-glow"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <RotateCcw size={16} />
                <span>Retry Loading</span>
              </button>
            </div>
          )}

          {/* 6. EMPTY SEARCH STATE */}
          {!loading && !error && groupedSections.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              background: 'var(--surface-white)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              boxShadow: 'var(--card-shadow)'
            }}>
              <Users size={48} color="var(--primary-cyan)" style={{ marginBottom: '1rem', opacity: 0.6 }} />
              <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                No committee members found
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                No records matched your search query "{searchQuery}" under the selected filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('All');
                }}
                className="btn-secondary-glass"
              >
                Reset Filters & Search
              </button>
            </div>
          )}

          {/* 7. DYNAMIC CATEGORY SECTIONS & MEMBER CARDS */}
          {!loading && !error && groupedSections.map((group, gIdx) => (
            <div key={group.category} className="committee-category-section">
              {/* Category Header */}
              <div className="committee-category-header">
                <div className="committee-category-title-wrap">
                  <div className="committee-category-icon">
                    <Shield size={20} />
                  </div>
                  <h2 className="committee-category-title">
                    {group.category}
                  </h2>
                </div>
                <span className="committee-category-count">
                  {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              {/* Members Grid */}
              <div className="committee-grid">
                {group.members.map((member) => {
                  const resolvedPhotoUrl = resolveImageUrl(member.imageUrl);
                  const hasPhoto = Boolean(resolvedPhotoUrl);
                  const institutionText = member.institution || member.org || '';

                  return (
                    <div
                      key={member.id || member._id}
                      className="committee-card"
                      onClick={() => setSelectedMember(member)}
                      title="Click to view member profile"
                    >
                      {/* Photo Area with Balanced Rounded Frame */}
                      <div className="member-photo-wrapper">
                        {hasPhoto ? (
                          <img
                            src={resolvedPhotoUrl}
                            alt={member.name}
                            className="member-photo"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const placeholderEl = e.target.parentElement?.querySelector('.member-placeholder');
                              if (placeholderEl) placeholderEl.style.display = 'flex';
                            }}
                          />
                        ) : null}

                        {/* Theme Placeholder Avatar (shown if no photo or error) */}
                        <div
                          className="member-placeholder"
                          style={{ display: hasPhoto ? 'none' : 'flex' }}
                        >
                          <div className="member-placeholder-avatar">
                            {getInitials(member.name)}
                          </div>
                          <span className="member-placeholder-tag">Faculty</span>
                        </div>
                      </div>

                      {/* Subtle Visual Divider */}
                      <div className="member-card-divider" />

                      {/* Information Area */}
                      <div className="member-info-content">
                        <h3 className="member-name">
                          {member.name}
                        </h3>

                        {(member.role || member.designation) && (
                          <div className="member-role">
                            {member.role || member.designation}
                          </div>
                        )}

                        {institutionText && (
                          <div className="member-institution">
                            {institutionText}
                          </div>
                        )}

                        {/* Country Tag */}
                        {member.country && member.country !== 'India' && (
                          <div className="member-badge-row">
                            <span className="member-country-tag">
                              {member.country}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* 8. MEMBER DETAILS MODAL */}
      {selectedMember && (
        <div
          className="committee-modal-overlay"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="committee-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="committee-modal-close"
              onClick={() => setSelectedMember(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Modal Left: Portrait Cutout */}
            <div className="committee-modal-left">
              {resolveImageUrl(selectedMember.imageUrl) ? (
                <img
                  src={resolveImageUrl(selectedMember.imageUrl)}
                  alt={selectedMember.name}
                  className="committee-modal-photo"
                />
              ) : (
                <div className="member-placeholder" style={{ width: '160px', height: '190px' }}>
                  <div className="member-placeholder-avatar" style={{ width: '70px', height: '70px', fontSize: '1.7rem' }}>
                    {getInitials(selectedMember.name)}
                  </div>
                  <span className="member-placeholder-tag">ICCCNS-2027</span>
                </div>
              )}
            </div>

            {/* Modal Right: Details */}
            <div className="committee-modal-right">
              <span className="committee-modal-category">
                {selectedMember.category}
              </span>

              <h2 className="committee-modal-name">
                {selectedMember.name}
              </h2>

              {selectedMember.role && (
                <div className="committee-modal-role">
                  {selectedMember.role}
                </div>
              )}

              <div className="committee-modal-detail-list">
                {(selectedMember.institution || selectedMember.org) && (
                  <div className="committee-modal-detail-item">
                    <Building2 size={16} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{selectedMember.institution || selectedMember.org}</span>
                  </div>
                )}

                {selectedMember.department && (
                  <div className="committee-modal-detail-item">
                    <Briefcase size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{selectedMember.department}</span>
                  </div>
                )}

                {selectedMember.country && (
                  <div className="committee-modal-detail-item">
                    <Globe2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{selectedMember.country}</span>
                  </div>
                )}

                {selectedMember.email && (
                  <div className="committee-modal-detail-item">
                    <Mail size={16} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{selectedMember.email}</span>
                  </div>
                )}
              </div>

              {selectedMember.bio && (
                <p className="committee-modal-bio">
                  {selectedMember.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </ErrorBoundary>
);
};


