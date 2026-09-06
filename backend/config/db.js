import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

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
      dates: "11 – 13 June 2027",
      targetDate: "2027-06-11T09:00:00.000Z",
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
        title: "Call for Papers & Submission Opens",
        date: "2027-01-15",
        displayDate: "15 JAN 2027",
        description: "Official submission portal opens for full research manuscripts across all tracks.",
        highlight: false,
        status: "Open"
      },
      {
        id: "d2",
        title: "Paper Submission Deadline",
        date: "2027-04-10",
        displayDate: "10 APR 2027",
        description: "Strict deadline for full manuscript upload and initial peer-review dispatch.",
        highlight: true,
        status: "Upcoming"
      },
      {
        id: "d3",
        title: "Notification of Acceptance",
        date: "2027-04-30",
        displayDate: "30 APR 2027",
        description: "Double-blind peer-review evaluations and acceptance decisions dispatched to authors.",
        highlight: false,
        status: "Upcoming"
      },
      {
        id: "d4",
        title: "Camera Ready Submission & Copyright",
        date: "2027-05-15",
        displayDate: "15 MAY 2027",
        description: "Final publication-ready paper submission and signed copyright form.",
        highlight: false,
        status: "Upcoming"
      },
      {
        id: "d5",
        title: "Author & Attendee Registration Closes",
        date: "2027-05-25",
        displayDate: "25 MAY 2027",
        description: "Early-bird and author registration deadline for conference scheduling.",
        highlight: true,
        status: "Upcoming"
      },
      {
        id: "d6",
        title: "Conference Dates (ICC-CNS 2027)",
        date: "2027-06-11",
        displayDate: "11–13 JUN 2027",
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
    committee: [
      {
        category: "Chief Patrons",
        members: [
          { name: "Dr. L. Rathaiah", role: "Chairman", org: "Vignan's Group" },
          { name: "Sri L. Sri Krishna Devarayalu", role: "Vice Chairman", org: "Vignan's Group" }
        ]
      },
      {
        category: "Patrons",
        members: [
          { name: "Dr. Pavuluri Subba Rao", role: "Chancellor", org: "VFSTR" },
          { name: "Prof. K. V. Krishna Kishore", role: "Vice-Chancellor", org: "VFSTR" },
          { name: "Dr. K. Meghana", role: "CEO", org: "VFSTR, Vadlamudi" },
          { name: "Prof. P. M. V. Rao", role: "Registrar", org: "VFSTR" }
        ]
      },
      {
        category: "General Chair",
        members: [
          { name: "Prof. K.V.Krishna Kishore", role: "Dean", org: "School of Computing & Informatics, VFSTR" }
        ]
      },
      {
        category: "Organizing Chair",
        members: [
          { name: "Dr. S. V. Phani Kumar", role: "Professor and HOD", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Honorary Chairs",
        members: [
          { name: "Prof. Jinsong Wu", role: "Professor", org: "University of Chile, Chile" },
          { name: "Dr. Alvaro Rocha", role: "Vice-Chair of IEEE SMC Portugal Chapter", org: "Professor ISEG, University of Lisbon, Lisboa, Portugal" }
        ]
      },
      {
        category: "Conference Chair",
        members: [
          { name: "Dr. H. James Deva Koresh", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Publication Chair",
        members: [
          { name: "Dr. J. Vijitha Ananthi", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "International Advisory Chairs",
        members: [
          { name: "Prof. Dr. Nan Yang", role: "ANU College of Systems and Society", org: "Australian National University, Australia" },
          { name: "Dr. Rui Dinis", role: "FCT-UNL and Researcher", org: "Instituto de Telecomunicações, Portugal" },
          { name: "Dr. Jinwei Liu", role: "Advisory Chair", org: "Florida A&M University, United States" },
          { name: "Dr. Sinem Coleri", role: "Advisory Chair", org: "Koc University, Turkey" }
        ]
      },
      {
        category: "International Advisory Committee",
        members: [
          { name: "Dr. Tomonobu Senjyu", role: "Professor", org: "University of the Ryukyus, Okinawa, Japan" },
          { name: "Dr. Francesco Zirilli", role: "Professor (retired)", org: "Sapienza Universita, Roma, Italy" },
          { name: "Dr. Dariusz Jacek Jakobczak", role: "Faculty of Electronics & CS", org: "Koszalin University of Technology, Poland" },
          { name: "Dr. Addisson Salazar", role: "Advisory Member", org: "Universitat Politècnica de València, Spain" },
          { name: "Dr. Debdatta Sinha Roy", role: "Sr. Research Scientist", org: "Oracle Retail Data Science R&D, Burlington, USA" },
          { name: "Dr. Grigorios N. Beligiannis", role: "Advisory Member", org: "University of Patras - Agrinio Campus, Greece" },
          { name: "Dr. Tzung-Pei Hong", role: "Professor", org: "National University of Kaohsiung, Taiwan" },
          { name: "Dr. Ayodeji Olalekan Salau", role: "Advisory Member", org: "Afe Babalola University, Nigeria" },
          { name: "Dr. Leila Bayoudhi", role: "Advisory Member", org: "University of Monastir, Tunisia" },
          { name: "Dr. Selim Hossain", role: "Advisory Member", org: "Hajee Mohammad Danesh Science & Technology University, Dinajpur, Bangladesh" },
          { name: "Dr. Yik-Chung Wu", role: "Advisory Member", org: "The University of Hong Kong, Hong Kong" }
        ]
      },
      {
        category: "National Advisory Committee",
        members: [
          { name: "Dr. Gopal Rawat", role: "Advisory Member", org: "Indian Institute of Technology Mandi, India" },
          { name: "Dr. B. K. Roy", role: "Advisory Member", org: "National Institute of Technology Silchar, India" },
          { name: "Dr. Umesh C. Pati", role: "Advisory Member", org: "National Institute of Technology Rourkela, India" },
          { name: "Dr. Shailendra K. Dwivedi", role: "Advisory Member", org: "Maulana Azad National Institute of Technology Bhopal, India" },
          { name: "Dr. Brijesh Kumar", role: "Advisory Member", org: "Indira Gandhi Delhi Technical University, India" },
          { name: "Dr. M. Thenmozhi", role: "Advisory Member", org: "Puducherry Technological University, India" },
          { name: "Dr. K. L. V. Sai Prakash Sakuru", role: "Advisory Member", org: "National Institute of Technology Warangal, India" },
          { name: "Dr. Tajinder Singh Arora", role: "Advisory Member", org: "National Institute of Technology Uttarakhand, India" },
          { name: "Dr. Subhojit Ghosh", role: "Advisory Member", org: "National Institute of Technology Raipur, India" },
          { name: "Dr. Anuradha Banerjee", role: "Advisory Member", org: "Kalyani Government Engineering College, India" },
          { name: "Dr. Tejavathu Ramesh", role: "Advisory Member", org: "National Institute of Technology Andhra Pradesh, India" },
          { name: "Dr. Amit Rathi", role: "Advisory Member", org: "Manipal University Jaipur, India" },
          { name: "Dr. Virender Ranga", role: "Advisory Member", org: "Delhi Technological University, India" },
          { name: "Dr. Ngangbam Herojit Singh", role: "Advisory Member", org: "National Institute of Technology Agartala, India" },
          { name: "Dr. Jayendra Kumar", role: "Advisory Member", org: "National Institute of Technology Jamshedpur, India" },
          { name: "Dr. Anirban Banik", role: "Advisory Member", org: "National Institute of Technology Sikkim, India" },
          { name: "Dr. S. Chitra", role: "Advisory Member", org: "Government College of Technology Coimbatore, India" },
          { name: "Dr. J. Satheesh Kumar", role: "Advisory Member", org: "Dayananda Sagar College of Engineering, India" },
          { name: "Dr. John Clement Singh C", role: "Advisory Member", org: "Kings Engineering College, India" },
          { name: "Dr. Nandhini Gayathri", role: "Advisory Member", org: "SASTRA University, India" },
          { name: "Dr. Dilip Singh Sisodia", role: "Advisory Member", org: "National Institute of Technology Raipur, India" },
          { name: "Dr. Angeline Vijula D", role: "Advisory Member", org: "PSG College of Technology, India" },
          { name: "Dr. Bhargava Rama", role: "Advisory Member", org: "Indian Institute of Technology Roorkee, India" }
        ]
      },
      {
        category: "Technical Program Committee",
        members: [
          { name: "Dr. Soumen Mondal", role: "TPC Member", org: "National Sun Yat-sen University, Taiwan" },
          { name: "Dr. Jiancheng An", role: "TPC Member", org: "Nanyang Technological University, Singapore" },
          { name: "Prof. Patrick Finnerty", role: "TPC Member", org: "Kobe University, Japan" },
          { name: "Dr. Vinayakumar Ravi", role: "TPC Member", org: "Prince Mohammad Bin Fahd University, Saudi Arabia" },
          { name: "Prof. Weiwei Jiang", role: "TPC Member", org: "Beijing University of Posts and Telecommunications, China" },
          { name: "Dr. Ke-Lin Du", role: "TPC Member", org: "Guangdong University of Science and Technology, China" },
          { name: "Prof. Pascal Lorenz", role: "TPC Member", org: "University of Haute Alsace, Greece" },
          { name: "Dr. Satish Jondhale", role: "TPC Member", org: "Savitribai Phule Pune University, Pune, India" },
          { name: "Dr. Sweety Kunjachan", role: "TPC Member", org: "Indian Institute of Technology, Kottayam, India" },
          { name: "Prof. Sivakumar P", role: "TPC Member", org: "Dr. NGP Institute of Technology, Coimbatore, India" },
          { name: "Dr. Sujatha Radhakrishnan", role: "TPC Member", org: "Vellore Institute of Technology, India" },
          { name: "Dr. Sadhana Tiwari", role: "TPC Member", org: "Prestige Institute of Engineering Management and Research, Indore, India" },
          { name: "Dr. C. Ezhilazhagan", role: "TPC Member", org: "Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology, India" },
          { name: "Dr. G. Murugadass", role: "TPC Member", org: "Anna University, India" },
          { name: "Dr. P. Subha Hency Jose", role: "TPC Member", org: "Karunya Institute of Technology and Sciences, India" },
          { name: "Dr. Md. Golam Rashed", role: "TPC Member", org: "University of Rajshahi, Rajshahi, Bangladesh" },
          { name: "Dr. Selwyn Piramuthu", role: "TPC Member", org: "University of Florida, USA" },
          { name: "Dr. Sunday Ayoola OKE", role: "TPC Member", org: "University of Lagos, Lagos, Nigeria" },
          { name: "Dr. Archana Prabahar", role: "TPC Member", org: "Cleveland State University, USA" },
          { name: "Dr. Anand Nayyar", role: "TPC Member", org: "Duy Tan University, Vietnam" },
          { name: "Dr. Pavel Loskot", role: "TPC Member", org: "ZJU-UIUC Institute, Zhejiang, China" },
          { name: "Dr. G. Castellanos Dominguez", role: "TPC Member", org: "National University of Colombia, Colombia" },
          { name: "Mr. Kiran Babu Macha", role: "Sr Manager - Software Engineering", org: "Maximus Inc, USA" }
        ]
      },
      {
        category: "Conference Co-Convenors",
        members: [
          { name: "Dr. Satish Kumar Satti", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. Vinoj J", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Technical Chairs",
        members: [
          { name: "Dr. M. Umadevi", role: "Associate Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. D. Yakobu", role: "Associate Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. S. Deva Kumar", role: "Associate Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Publication Co-Chairs",
        members: [
          { name: "Dr. B. Suvarna", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. Jhansi Lakshmi P.", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. R. Prathap Kumar", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Conference Core Committee",
        members: [
          { name: "Dr. M. Sunil Babu", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. E. Deepak Chowdary", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. M. Vijai Meyyapan", role: "Sr. Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. R. Renugadevi", role: "Sr. Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. P. Siva Prasad", role: "Associate Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. Prashant Upadhyay", role: "Associate Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Technical Program Associates",
        members: [
          { name: "Dr. V. S. R. Pavan Kumar Neeli", role: "Sr. Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. N. Sameera", role: "Sr. Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. M. Raja Rao", role: "Sr. Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Coordinators - Registration & Session Management Committee",
        members: [
          { name: "Dr. Md. Oqail Ahmad", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. Gabbi Reddy Keerthi", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. Jani Shaik", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. D. Senthil", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. M. Bhargavi", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. SD. Shareefunnisa", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. K. Pavan Kumar", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. V. Anusha", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. Ch. Pushya", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Ms. P. Anusha", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "MS. Sk.Sajida Sultana", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Coordinators - Finance Committee",
        members: [
          { name: "Dr. Simhadiri Chinna Gopi", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. Krishna Reddy", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. O. Bhaskar", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. E. Akhil Babu", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Coordinators - Websites, Brochure & Event Promotion Committee",
        members: [
          { name: "Dr. Phanindra Thota", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. Saubhagya Ranjan Biswal", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. Manoj Kumar Merugumal", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. G. Parimala", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. P. Kiran Kumar Raja", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. T. Narasimha Rao", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. Magham Sumalatha", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. P. Venkata Rajulu", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. Sai Spandana Verella", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. R. Lalitha", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. N. Brahma Naidu", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. Kumar Devapogu", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Coordinators - Media & Publicity Committee",
        members: [
          { name: "Dr. Rambabu Kusuma", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. G. Balu Narasimha Rao", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. J. Veeranjaneyulu", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. P. Vijaya Babu", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. U. Venkateswara Rao", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. Gujjula Murali", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. Ch. Amaresh", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Ms. Shaik Reehana", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Ms. Jarugumalla Dayanika", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. Tanigundala Leelavathy", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. Ch. Swarna Lalitha", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      },
      {
        category: "Coordinators - Organizing & Hospitality Committee",
        members: [
          { name: "Dr. T. R. Rajesh", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Dr. G. Veera Bhadra Chary", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. O. Gandhi", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. Kiran Kumar Kaveti", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. N. Uttej Kumar", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Ms. N. Bhargavi", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. Badheli Krishnakanth", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. V. Nandini", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. Archana Nalluri", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. K. Jyostna", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. Koganti Swathi", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. M. Mohana Venkateswara Rao", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. B. Anil Babu", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. D. Tipura", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mrs. N. Mounika", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Ms. Y. Sai Eswari", role: "Assistant Professor", org: "Department of CSE, VFSTR" },
          { name: "Mr. Kanna Hareesh", role: "Assistant Professor", org: "Department of CSE, VFSTR" }
        ]
      }
    ],
    gallery: [
      {
        id: "g1",
        title: "A-Block Main Campus Building",
        category: "Campus",
        image: "/images/vignan_ablock_campus.webp",
        description: "Iconic A-Block administrative and academic complex at Vignan University Vadlamudi campus."
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
