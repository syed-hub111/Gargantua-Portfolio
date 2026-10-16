export const PERSONAL_INFO = {
  name: 'SYED SAMEER S',
  role: 'Mobile & Web App Developer',
  tagline: 'Computer Science Engineering student crafting intuitive cross-platform mobile apps and scalable MERN full-stack web platforms.',
  phone: '+91 9962033058',
  email: 'sameeraalimec786@gmail.com',
  github: 'https://github.com/syed-hub111',
  linkedin: 'https://www.linkedin.com/in/syedsameers2006/',
  resumeUrl: '/resume.pdf',
  location: 'Avadi, Chennai – 55 • Open to Remote',
  status: 'Seeking Software Development Opportunities',
  bio: [
    'Computer Science Engineering student with hands-on experience in mobile and full-stack web development. Skilled in Flutter, Firebase, MERN stack technologies, Python, and front-end development.',
    'Interested in building practical applications, solving real-world problems, and continuously learning modern technologies. Seeking opportunities to apply technical skills in a professional software development environment.',
    'Awarded 2nd Runner-Up at Impact-a-thon X AMS’25 for building Career Clarity Companion (C³), bridging Google Gemini AI with cross-platform Flutter engineering.'
  ],
  education: {
    college: 'Aalim Muhammed Salegh College of Engineering',
    degree: 'Bachelor of Engineering (B.E.) – Computer Science and Engineering',
    years: '2023 – 2027',
    location: 'Avadi, Chennai – 55'
  },
  certifications: [
    { title: 'Web Development Fundamentals', provider: 'IBM SkillsBuild' },
    { title: 'Object-Oriented Programming in Python', provider: 'Infosys Springboard' }
  ],
  spokenLanguages: ['English', 'Hindi', 'Urdu', 'Tamil']
};

export const SECTORS = [
  { id: 'gateway', name: 'Solar Gateway', code: 'SEC-00', pos: [0, 8, 48], target: [0, 0, 0] },
  { id: 'home', name: 'The Origin', code: 'SEC-01', pos: [0, 2, 24], target: [0, 0, 0] },
  { id: 'about', name: 'Identity Nexus', code: 'SEC-02', pos: [-16, 4, -14], target: [-18, 0, -22] },
  { id: 'projects', name: 'Constellation', code: 'SEC-03', pos: [22, 2, -38], target: [26, 0, -50] },
  { id: 'skills', name: 'Technical Galaxy', code: 'SEC-04', pos: [-18, -10.5, -56], target: [-18, -11.5, -75] },
  { id: 'journey', name: 'Orbital Path', code: 'SEC-05', pos: [12, -18.5, -102], target: [12, -21.5, -118] },
  { id: 'contact', name: 'Event Horizon', code: 'SEC-06', pos: [0, -32, -165], target: [0, -32, -185] }
];

export const PROJECTS = [
  {
    id: 'c3',
    number: '01',
    name: 'Career Clarity Companion (C³)',
    category: 'Flutter | Firebase | REST API | Gemini API',
    subtitle: 'Impact-a-thon X AMS’25 • 2nd Runner-Up (3rd Place)',
    description: 'Developed a cross-platform mobile application focused on personalized career guidance, recognized as 2nd Runner-Up at Impact-a-thon X AMS’25.',
    longDescription: 'Developed a cross-platform mobile application focused on personalized career guidance. Used Flutter for the mobile interface and Firebase Authentication and Cloud Firestore for backend services and data management. Integrated Google’s Gemini API to provide personalized career-path recommendations and answer user queries. Recognized as 2nd Runner-Up (3rd Place) at Impact-a-thon X AMS’25 for the project’s concept, development, presentation, AI integration, and user experience.',
    tags: ['Flutter', 'Google Gemini API', 'Firebase Auth', 'Cloud Firestore', 'REST APIs', 'Dart'],
    role: 'Lead Mobile & AI Developer',
    highlights: [
      'Recognized as 2nd Runner-Up (3rd Place) at Impact-a-thon X AMS’25',
      'Integrated Google Gemini API for personalized career-path guidance',
      'Cross-platform responsive Flutter mobile architecture',
      'Cloud Firestore backend services with Firebase Authentication'
    ],
    github: 'https://github.com/syed-hub111',
    liveUrl: null,
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)'
  },
  {
    id: 'payrollpro',
    number: '02',
    name: 'PayrollPro – Enterprise Payroll System',
    category: 'MERN Stack | Full-Stack Web Application',
    subtitle: 'Naan Mudhalvan x IBM Internship Project',
    description: 'Developed an enterprise payroll platform for automating salary processing, bulk onboarding, and compliance workflows.',
    longDescription: 'Developed an enterprise payroll platform for automating salary processing and employee onboarding. Implemented payroll analytics through a super-admin dashboard and automated PF & ESI compliance workflows. Built a secure employee portal with payslip access and multi-role authentication during internship with Naan Mudhalvan x IBM.',
    tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'MERN Stack', 'Role-Based Auth', 'Analytics'],
    role: 'MERN Stack Developer Intern (IBM x Naan Mudhalvan)',
    highlights: [
      'Engineered automated salary processing and bulk employee onboarding',
      'Super-admin dashboard with real-time payroll analytics',
      'Automated PF & ESI compliance workflows',
      'Secure employee self-service portal with payslip access'
    ],
    github: 'https://github.com/syed-hub111/-payroll-management-system',
    liveUrl: null,
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)'
  },
  {
    id: 'classping',
    number: '03',
    name: 'ClassPing',
    category: 'Mobile Application • Flutter & Firebase',
    subtitle: 'Tuition Attendance & Parent Updates Engine',
    description: 'A tuition attendance management mobile experience designed to help educators streamline daily session logs and keep parents informed.',
    longDescription: 'Engineered with clean Flutter architecture and reactive state management. Features an intuitive tutor workflow for multi-batch attendance marking, session records, student performance telemetry, and cloud-synced parent notifications to foster transparency.',
    tags: ['Flutter', 'Dart', 'Firebase', 'Riverpod', 'Cloud Firestore', 'Push Notifications'],
    role: 'Product Architect & Lead Developer',
    highlights: [
      'Multi-batch attendance logging in under 3 taps',
      'Real-time Firestore sync with offline persistence',
      'Parental update feed and session history reporting',
      'Production-grade Riverpod state segregation'
    ],
    github: 'https://github.com/syed-hub111/ClassPing',
    liveUrl: null,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)'
  },
  {
    id: 'tech-escape-room',
    number: '04',
    name: 'Tech Escape Room',
    category: 'Full Stack Web • Cybersecurity Gamification',
    subtitle: 'Interactive Cybersecurity Challenge & Digital Escape Platform',
    description: 'An interactive, story-driven cybersecurity platform that challenges teams to solve technical puzzles, investigate digital clues, and recover a compromised system through a series of virtual escape rooms.',
    longDescription: 'Developed as a college cybersecurity event platform, it combines interactive gameplay with programming, networking, SQL, debugging, and cryptography challenges. Features team-specific puzzle routes, server-controlled timers, progression tracking, automated answer validation, hints, and scoring to deliver a structured, competitive escape-room experience.',
    tags: ['React.js', 'Vite', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'Neon', 'Vercel'],
    role: 'Full Stack Developer',
    highlights: [
      'Interactive, story-driven cybersecurity challenges and virtual escape rooms',
      'Team-based gameplay with customized puzzle routes and progression',
      'Backend-controlled timers, scoring, hints, and answer validation',
      'Integrated programming, networking, SQL, debugging, and cryptography puzzles',
      'Database-backed challenge and team progression management',
      'Deployed platform for a real college cybersecurity event'


    ],
    github: 'https://github.com/syed-hub111/Escape_Room',
    liveUrl: null,
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)'
  },
  {
    id: 'universe-portfolio',
    number: '05',
    name: 'Universe Portfolio',
    category: 'Creative Development • Real-Time WebGL',
    subtitle: 'Cinematic 3D Spaceflight Portfolio Experience',
    description: 'Continuous 3D universe-themed digital environment built with Three.js, React Three Fiber, custom GLSL shaders, and GSAP scroll trajectories.',
    longDescription: 'Features a real-time 3D solar system with procedural solar flares, planetary atmospheres, particle nebulae, interactive 3D floating constellation monoliths, and seamless spatial camera transitions.',
    tags: ['Three.js', 'React Three Fiber', 'GLSL Shaders', 'GSAP', 'Vite', 'Web Audio API'],
    role: 'Creative Technologist',
    highlights: [
      'Custom procedural solar flare and atmospheric shaders',
      'Seamless scroll and HUD-controlled camera travel across 3D coordinates',
      'Interactive 3D hover elevation and raycasting inspection',
      'Procedural cosmic ambient synthesizer using Web Audio API'
    ],
    github: 'https://github.com/syed-hub111',
    liveUrl: null,
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)'
  }
];

export const SKILL_CATEGORIES = [
  {
    name: 'Programming Languages',
    tag: 'Core Languages',
    color: '#38bdf8',
    skills: ['Python', 'JavaScript', 'C', 'HTML5', 'CSS3', 'Dart', 'TypeScript', 'C++', 'Java']
  },
  {
    name: 'Frameworks & Technologies',
    tag: 'Mobile & Web Platforms',
    color: '#a855f7',
    skills: ['Flutter', 'React.js', 'Node.js', 'Express.js', 'MERN Stack', 'Firebase']
  },
  {
    name: 'Databases & APIs',
    tag: 'Data Persistence & Integration',
    color: '#10b981',
    skills: ['MongoDB', 'Cloud Firestore', 'REST APIs', 'Database Design', 'SQL', 'PostgreSQL', 'Prisma ORM']
  },
  {
    name: 'Developer Tools',
    tag: 'Workflow & Version Control',
    color: '#f59e0b',
    skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Vite']
  },
  {
    name: 'Core Skills',
    tag: 'Leadership & Engineering Mindset',
    color: '#ec4899',
    skills: ['Problem Solving', 'Leadership', 'Creative Thinking', 'Event Management']
  }
];

export const JOURNEY_MILESTONES = [
  {
    year: '2023 – 2027',
    badge: 'Education',
    title: 'B.E. Computer Science and Engineering',
    location: 'Aalim Muhammed Salegh College of Engineering, Chennai',
    description: 'Pursuing Bachelor of Engineering in Computer Science and Engineering. Deep-diving into mobile engineering, full-stack web architectures, and algorithmic problem solving.',
    highlights: ['Computer Science Core', 'Mobile & Web Architecture', 'Data Structures & Algorithms'],
    icon: 'GraduationCap',
    color: '#38bdf8'
  },
  {
    year: '2025',
    badge: 'Award Winner',
    title: 'Impact-a-thon X AMS’25 — 2nd Runner-Up (3rd Place)',
    location: 'Competitive Hackathon',
    description: 'Recognized for Career Clarity Companion (C³), integrating Google’s Gemini API with Flutter to deliver personalized AI career guidance and roadmaps.',
    highlights: ['Flutter & Gemini AI', 'Personalized Roadmaps', 'Hackathon 2nd Runner-Up'],
    icon: 'Trophy',
    color: '#a855f7'
  },
  {
    year: 'Jan 2026 – Feb 2026',
    badge: 'Internship',
    title: 'MERN Stack Developer Intern — Naan Mudhalvan x IBM',
    location: 'IBM x Naan Mudhalvan',
    description: 'Engineered PayrollPro, a MERN-based enterprise payroll platform. Implemented automated salary computation, compliance workflows (PF & ESI), and bulk employee analytics.',
    highlights: ['MERN Architecture', 'PF & ESI Compliance', 'Bulk Onboarding Engine'],
    icon: 'Briefcase',
    color: '#10b981'
  },
  {
    year: '2026',
    badge: 'Internship',
    title: 'MERN Full Stack Intern — Altruisty Innovation Pvt. Ltd.',
    location: 'Altruisty Innovation Pvt. Ltd.',
    description: 'Architected an Enterprise Resource Planning (ERP) platform using MongoDB, Express.js, React, and Node.js to streamline multi-department organizational data workflows.',
    highlights: ['Enterprise ERP Platform', 'Full-Stack React & Node', 'MongoDB Data Modeling'],
    icon: 'Layers',
    color: '#f59e0b'
  },
  {
    year: 'Present',
    badge: 'Active Frontiers',
    title: 'Full Stack & Mobile Innovation',
    location: 'Production Platforms & Creative WebGL',
    description: 'Engineering cutting-edge mobile apps (ClassPing) and real-time WebGL universe experiences. Certified across IBM SkillsBuild and Infosys Springboard.',
    highlights: ['ClassPing Mobile App', 'Real-Time WebGL & Shaders', 'IBM & Infosys Certified'],
    icon: 'Compass',
    color: '#06b6d4'
  }
];
