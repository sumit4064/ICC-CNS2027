import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { officialCommitteeMembers } from './committeeData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

// Ensure DNS resolver fallback for Windows SRV queries (_mongodb._tcp)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

// MongoDB Connection Helper
export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('[DB] Connected to MongoDB Atlas successfully.');
    return true;
  } catch (err) {
    console.error('[DB] MongoDB Atlas connection failed:', err.name, err.message);
    throw err;
  }
};

export const connectMongo = connectDatabase;

export const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('VFSTR@2027', salt);

  return {
    conference: {
      year: 2027,
      edition: "3rd",
      editionTag: "the 3rd ICC-CNS 2027",
      shortName: "ICC-CNS 2027",
      title: "2027 International Conference on Cognitive Computing and Networking Systems",
      subTitle: "Organized by Department of Computer Science & Engineering",
      school: "School of Computing and Informatics",
      institution: "Vignan's Foundation for Science, Technology and Research (Deemed to be University)",
      dates: "10–12 June 2027",
      targetDate: "2027-06-10T09:00:00.000Z",
      mode: "Hybrid Mode",
      modeDetail: "In-person & Online Virtual",
      venueName: "Vignan's Foundation for Science, Technology and Research (VFSTR)",
      venueLocation: "Vadlamudi, Guntur-522213, Andhra Pradesh, India",
      departmentEstablished: "1997",
      departmentPrograms: "B.Tech in Computer Science and Engineering, M.Tech in Computer Science and Engineering, Ph.D. in Computer Science and Engineering",
      description: "ICC-CNS 2027 is a premier international forum hosted by the Department of Computer Science & Engineering at Vignan's Foundation for Science, Technology and Research (VFSTR), Vadlamudi. The conference brings together leading academicians, researchers, scientists, and industry innovators to exchange and share breakthrough findings in Cognitive Computing, Artificial Intelligence, and Next-Generation Networking Systems.",
      stats: {
        speakers: "12+",
        countries: "8+",
        registered: "210+",
        papersSubmitted: "145+"
      },
      publicationInfo: {
        status: "Announced by Organizers",
        notice: "All accepted, registered, and presented papers will be submitted for publication and indexation in indexed conference proceedings (Scopus / IEEE / Springer indexed series) subject to official conference approval.",
        publisher: "Conference Proceedings Series",
        isbn: "To be announced",
        isConfirmed: true
      },
      contact: {
        email: "info@vignan.ac.in",
        confEmail: "icccns2027@vignan.ac.in",
        phone: "+91-863-2344 700 / 701",
        deptPhone: "+91-863-2344 700 Ext: 201",
        address: "Department of Computer Science & Engineering, School of Computing and Informatics, VFSTR (Deemed to be University), Vadlamudi, Guntur-522213, Andhra Pradesh, India",
        emergencyContact: "+91-863-2344 700"
      }
    },
    dates: [
      {
        id: "d1",
        title: "Opening Date for Paper Submission",
        date: "2026-11-01",
        displayDate: "01/11/2026",
        description: "Official submission portal opens for full research manuscripts across all tracks.",
        highlight: false,
        status: "Open"
      },
      {
        id: "d2",
        title: "Closing Date for Paper Submission",
        date: "2027-03-31",
        displayDate: "31/03/2027",
        description: "Strict deadline for full manuscript upload and initial peer-review dispatch.",
        highlight: true,
        status: "Upcoming"
      },
      {
        id: "d3",
        title: "Notification of Decision (Acceptance / Rejection)",
        date: "2027-04-10",
        displayDate: "10/04/2027 Onwards",
        description: "Double-blind peer-review evaluations and acceptance decisions dispatched to authors.",
        highlight: false,
        status: "Upcoming"
      },
      {
        id: "d4",
        title: "Registration Close",
        date: "2027-05-15",
        displayDate: "15/05/2027",
        description: "Final registration deadline for authors and attendees.",
        highlight: true,
        status: "Upcoming"
      },
      {
        id: "d5",
        title: "Conference",
        date: "2027-06-10",
        displayDate: "10–12 June 2027",
        description: "Inaugural ceremony, Keynote Speeches, Technical Paper Presentations & Valedictory.",
        highlight: true,
        status: "Major Event"
      }
    ],
    tracks: [
      {
        id: "t1",
        number: "01",
        code: "TRACK-CC",
        name: "Cognitive Computing & AI",
        color: "#FF6B35",
        accent: "orange",
        summary: "Cognitive Artificial Intelligence, Deep Learning, NLP, Neuromorphic Systems, and Brain-Inspired Machine Intelligence.",
        topics: [
          "Cognitive Artificial Intelligence & Knowledge Graph Representation",
          "Deep Neural Architectures & Transformer Systems",
          "Natural Language Processing & Large Multimodal Models",
          "Neuromorphic Computing & Brain-Inspired Hardware Architectures",
          "Human-Computer Cognitive Interaction & Affective Computing",
          "Autonomous Intelligent Systems & Cognitive Robotics",
          "Explainable AI (XAI) & Ethical Machine Learning Paradigms",
          "Soft Computing, Fuzzy Systems & Evolutionary Computation"
        ]
      },
      {
        id: "t2",
        number: "02",
        code: "TRACK-IN",
        name: "Intelligent Networking & Next-Gen Systems",
        color: "#10B981",
        accent: "emerald",
        summary: "5G/6G Networks, SDN/NFV, IoT, Cybersecurity, Edge/Cloud Architectures, and Trust Computing.",
        topics: [
          "Next-Generation 5G / 6G Wireless Architectures & Ultra-Reliable Low Latency (URLLC)",
          "Software Defined Networking (SDN) & Network Function Virtualization (NFV)",
          "Internet of Things (IoT) & Smart Sensor Networks",
          "Edge, Fog, and Distributed Cloud Computing",
          "Cybersecurity, Cryptography, Network Defense & Zero-Trust Architectures",
          "Blockchain & Distributed Ledger Technologies for Secure Networking",
          "AI-Driven Autonomous Network Traffic Optimization & Routing",
          "Vehicular Ad-Hoc Networks (VANETs) & Satellite Communications"
        ]
      },
      {
        id: "t3",
        number: "03",
        code: "TRACK-AD",
        name: "Data Science, Blockchain & Computational Systems",
        color: "#0EA5E9",
        accent: "blue",
        summary: "Machine Learning, Big Data Analytics, Predictive Modeling, Smart Cities, and High-Performance Informatics.",
        topics: [
          "Scalable Machine Learning Algorithms & Distributed Computing",
          "Big Data Analytics & Real-Time Stream Intelligence",
          "Decentralized Autonomous Systems & Smart Contracts",
          "Optimization Techniques & Swarm Intelligence",
          "Quantum Machine Learning & Quantum Information Processing",
          "Smart City Informatics, Intelligent Transportation & Healthcare IoT",
          "Bioinformatics, Computational Biology & Environmental Sensor Informatics",
          "High-Performance Computing (HPC) & GPU-Accelerated Workloads"
        ]
      }
    ],
    registrationCategories: [
      {
        id: "cat1",
        type: "Student / Research Scholar",
        inr: "INR 4,000",
        usd: "USD 150",
        desc: "Valid student/scholar institutional identity proof required at registration."
      },
      {
        id: "cat2",
        type: "Faculty / Academician",
        inr: "INR 6,500",
        usd: "USD 220",
        desc: "Full access to all technical sessions, conference kit, lunch & banquet."
      },
      {
        id: "cat3",
        type: "Industry Professional",
        inr: "INR 9,000",
        usd: "USD 300",
        desc: "Access to conference tracks, industry panels, exhibition & networking."
      },
      {
        id: "cat4",
        type: "International Participant",
        inr: "USD 250",
        usd: "USD 250",
        desc: "International author/attendee registration for in-person or virtual presentation."
      },
      {
        id: "cat5",
        type: "Attendee / Listener Only",
        inr: "INR 3,000",
        usd: "USD 100",
        desc: "Session participation & official digital certificate of conference attendance."
      }
    ],
    speakers: [
      {
        id: "sp1",
        name: "Dr. Aris Thorne",
        designation: "Professor & Director of AI Systems",
        institution: "Massachusetts Institute of Technology (MIT)",
        country: "USA",
        track: "Cognitive Computing & AI",
        topic: "Neuromorphic AI & Next-Gen Cognitive Systems",
        bio: "Dr. Aris Thorne is a distinguished researcher in brain-inspired neuromorphic computing and cognitive machine architectures with over 120 publications in top IEEE and ACM transactions.",
        image: "/speakers/speaker1.svg",
        type: "Keynote"
      },
      {
        id: "sp2",
        name: "Prof. Elena Rostova",
        designation: "Chair of Networked Intelligence",
        institution: "Technical University of Munich",
        country: "Germany",
        track: "Intelligent Networking & Next-Gen Systems",
        topic: "Autonomous Edge Networks & 6G Symbiosis",
        bio: "Prof. Rostova leads advanced wireless communications research focusing on ultra-low-latency cellular networks, autonomous 6G orchestration, and AI-enabled edge routing.",
        image: "/speakers/speaker2.svg",
        type: "Keynote"
      },
      {
        id: "sp3",
        name: "Dr. Rajesh V. Murthy",
        designation: "Distinguished Chief Scientist",
        institution: "Indian Institute of Science (IISc), Bangalore",
        country: "India",
        track: "Data Science, Blockchain & Computational Systems",
        topic: "Quantum Cognitive Algorithms in High-Density Networks",
        bio: "Dr. Murthy has spearheaded national high-performance computing initiatives and contributed extensively to quantum cognitive models and scalable distributed intelligence.",
        image: "/speakers/speaker3.svg",
        type: "Keynote"
      },
      {
        id: "sp4",
        name: "Prof. Kenji Takahashi",
        designation: "Head of Cybernetics Research",
        institution: "University of Tokyo",
        country: "Japan",
        track: "Cognitive Computing & AI",
        topic: "Deep Learning for Resilient Cyber-Physical Systems",
        bio: "Prof. Takahashi has made seminal contributions in robotic perception, real-time computer vision, and cognitive decision trees for resilient cyber-physical systems.",
        image: "/speakers/speaker4.svg",
        type: "Invited"
      },
      {
        id: "sp5",
        name: "Dr. Sarah Jenkins",
        designation: "Associate Professor of Computing",
        institution: "Imperial College London",
        country: "United Kingdom",
        track: "Data Science, Blockchain & Computational Systems",
        topic: "Trustworthy and Explainable AI for Distributed Data",
        bio: "Dr. Jenkins specializes in fairness, accountability, and transparency in artificial intelligence, collaborating with European research frameworks.",
        image: "/speakers/speaker5.svg",
        type: "Invited"
      },
      {
        id: "sp6",
        name: "Prof. Carlos Mendoza",
        designation: "Principal Investigator in IoT",
        institution: "University of São Paulo",
        country: "Brazil",
        track: "Intelligent Networking & Next-Gen Systems",
        topic: "IoT and Intelligent Sensor Mesh Technologies",
        bio: "Prof. Mendoza is an international authority on energy-efficient communication protocols for remote IoT mesh deployments in agriculture and industrial automation.",
        image: "/speakers/speaker6.svg",
        type: "Invited"
      }
    ],
    committee: officialCommitteeMembers,
    gallery: [
      {
        id: "g1",
        title: "N-Block Academic Complex – CSE Department",
        category: "Campus",
        image: "/images/vignan_ablock_campus.png",
        description: "Iconic N-Block administrative and academic complex at Vignan University Vadlamudi campus."
      },
      {
        id: "g2",
        title: "Academic Symposium & Technical Sessions",
        category: "Conference",
        image: "/images/vignan_campus_event_1.webp",
        description: "Scholars and faculty participating in interdisciplinary research workshops."
      },
      {
        id: "g3",
        title: "Research & Innovation Presentations",
        category: "Research",
        image: "/images/vignan_campus_event_2.webp",
        description: "Student researchers and keynote speakers discussing cutting-edge computing advances."
      },
      {
        id: "g4",
        title: "University Convention & Auditorium Hall",
        category: "Events",
        image: "/images/vignan_campus_event_3.webp",
        description: "State-of-the-art auditorium for inaugural sessions and international keynote addresses."
      },
      {
        id: "g5",
        title: "School of Computing & Informatics",
        category: "CSE Department",
        image: "/images/vignan_departments.webp",
        description: "High-performance computing, AI, and cybersecurity research laboratories."
      },
      {
        id: "g6",
        title: "Academic Excellence & Campus Life",
        category: "Campus",
        image: "/images/vignan_campus_life.webp",
        description: "Vibrant academic environment and collaborative learning culture at VFSTR."
      }
    ],
    faqs: [
      {
        id: "f1",
        question: "Who can attend and present at ICC-CNS 2027?",
        answer: "The conference is open to academic researchers, faculty members, Ph.D. scholars, undergraduate and postgraduate students, industry professionals, and scientists from around the world interested in Cognitive Computing, AI, and Networking Systems."
      },
      {
        id: "f2",
        question: "How can I submit my research paper?",
        answer: "Authors can submit their original manuscripts directly through our online Paper Submission Portal in PDF or DOCX format following standard double-blind conference formatting templates."
      },
      {
        id: "f3",
        question: "Is online (virtual) presentation available for remote participants?",
        answer: "Yes, ICC-CNS 2027 operates in full Hybrid Mode. Authors and delegates unable to travel to the Vadlamudi campus can present their accepted papers and attend keynote sessions virtually via interactive live streaming."
      },
      {
        id: "f4",
        question: "What are the publication and indexing arrangements?",
        answer: "All accepted, registered, and presented papers will be submitted for inclusion in indexed conference proceedings (Scopus / IEEE / Springer indexed series) subject to official conference approval and publisher guidelines."
      },
      {
        id: "f5",
        question: "How do I reach Vignan University Vadlamudi Campus?",
        answer: "The campus is conveniently accessible from Vijayawada International Airport (VGA - 38 km), Vijayawada Railway Junction (BZA - 15 km), and Guntur Railway Station (GNT - 18 km). Dedicated campus shuttle services and taxis are readily available."
      },
      {
        id: "f6",
        question: "How can I contact the conference organizers for queries?",
        answer: "You can email the secretariat at info@vignan.ac.in or icccns2027@vignan.ac.in, call +91-863-2344 700 / 701, or use the online Contact Form on this portal."
      }
    ],
    registrations: [
      {
        id: "REG-2027-1001",
        fullName: "Dr. Amitava Bhattacharya",
        email: "amitava.b@iitk.ac.in",
        phone: "+91 94321 67890",
        country: "India",
        institution: "IIT Kanpur",
        participantType: "Faculty / Academician",
        mode: "Offline (In-person)",
        paperId: "N/A (Attendee Only)",
        paperTitle: "",
        amountPaid: "INR 6,500",
        status: "Confirmed",
        registeredAt: "2027-01-20T10:30:00.000Z"
      }
    ],
    counters: {
      paperSequence: 0
    },
    submissions: [],
    users: [
      {
        id: "usr-admin",
        email: "hodcse@vignan.ac.in",
        password: hashedPassword,
        name: "ICC-CNS 2027 Administrator",
        role: "admin"
      },
      {
        id: "usr-author",
        email: "author@university.edu",
        password: bcrypt.hashSync('pass123', salt),
        name: "Dr. Author Delegate",
        role: "participant"
      }
    ]
  };
};

export const getDb = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error('Error reading db.json, returning initial seed:', error);
    return getInitialData();
  }
};

export const saveDb = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving db.json:', error);
    return false;
  }
};
