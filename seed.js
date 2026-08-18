const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');
const Job = require('./models/Job');
const Service = require('./models/Service');
const Gallery = require('./models/Gallery');
const Testimonial = require('./models/Testimonial');
const Client = require('./models/Client');
const Settings = require('./models/Settings');
const Application = require('./models/Application');
const Contact = require('./models/Contact');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jessy_staffing');
    console.log('Connected to MongoDB for Seeding...');
  } catch (err) {
    console.error('DB Connection error during seed:', err);
    process.exit(1);
  }
}; 

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing collections
    await Admin.deleteMany({});
    await Job.deleteMany({});
    await Service.deleteMany({});
    await Gallery.deleteMany({});
    await Testimonial.deleteMany({});
    await Client.deleteMany({});
    await Settings.deleteMany({});
    await Application.deleteMany({});
    await Contact.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Default Admin
    const admin = await Admin.create({
      name: 'Executive Admin',
      email: 'admin@staffing.com',
      password: 'Admin@123',
      role: 'admin'
    });
    console.log(`Created Default Admin: ${admin.email} / Admin@123`);

    // 2. Create Default Settings
    await Settings.create({
      siteName: 'Apex Global Staffing & HR Solutions',
      tagline: 'Empowering Enterprises with World-Class Talent',
      contactEmail: 'contact@apexstaffing.com',
      contactPhone: '+1 (800) 555-2739',
      address: '100 Enterprise Boulevard, Suite 500, Financial District, NY 10005',
      whatsappNumber: '+18005552739',
      metaTitle: 'Apex Global Staffing & HR Solutions | International Talent Acquisition',
      metaDescription: 'Leading international staffing, healthcare, security, corporate HR outsourcing, and school staffing solutions.'
    });

    // 3. Create Services
    const servicesData = [
      {
        title: 'School & Educational Staffing',
        slug: 'school-staffing',
        category: 'School Staffing',
        icon: 'bi-mortarboard-fill',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
        shortDescription: 'Qualified educators, academic principals, lab assistants, sports coaches, and administrative support for institutions.',
        description: 'Our School Staffing Division provides vetted pedagogical professionals and support staff tailored to international schools, universities, and K-12 institutions. We ensure all staff pass background screening, credential validation, and child safety compliance.',
        features: [
          'Background & Police Verification Certified',
          'Subject Matter Experts & Native Language Educators',
          'Flexible Contractual & Permanent Placements',
          'Emergency Classroom Substitute Pool'
        ],
        rolesProvided: ['Teachers', 'Lab Assistants', 'Office Staff', 'Receptionists', 'Principal', 'Sports Coach', 'Administrative Staff'],
        order: 1
      },
      {
        title: 'Security & Facility Guard Services',
        slug: 'security-services',
        category: 'Security Staffing',
        icon: 'bi-shield-lock-fill',
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=800&auto=format&fit=crop',
        shortDescription: 'Rigorous physical security, corporate access patrol, industrial guards, and VIP event security forces.',
        description: 'Apex Security Solutions deploys highly trained, disciplined security officers for corporate towers, gated luxury residential communities, industrial sites, and high-profile events. Our personnel are trained in emergency management and de-escalation tactics.',
        features: [
          '24/7 Command Center Monitoring',
          'CCTV & Electronic Gate Access Integration',
          'Tactical De-escalation & Fire Safety Certified',
          'Custom Uniformed & Armed/Unarmed Personnel'
        ],
        rolesProvided: ['Security Guards', 'Corporate Security Officers', 'Industrial Guards', 'Apartment Security', 'Event Security Tactical Crew'],
        order: 2
      },
      {
        title: 'Healthcare & Clinical Personnel',
        slug: 'healthcare-staffing',
        category: 'Healthcare Staffing',
        icon: 'bi-hospital-fill',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
        shortDescription: 'Licensed ICU nurses, staff nurses, medical lab technicians, physiotherapists, and hospital specialists.',
        description: 'Providing accredited healthcare professionals to premier hospitals, specialty clinics, and diagnostic networks. All candidates hold current medical board licenses and intensive clinical practice records.',
        features: [
          'Verified Medical Licenses & ACLS/BLS Certifications',
          'Specialized Clinical Units (ICU, NICU, ER, OT)',
          'Rapid Deployment Locum & Permanent Staffing',
          'HIPAA & Clinical Governance Compliant'
        ],
        rolesProvided: ['ICU Nurses', 'Staff Nurses', 'Lab Technicians', 'Physiotherapist', 'Hospital Administrative Officers'],
        order: 3
      },
      {
        title: 'Home Care & In-Home Assistance',
        slug: 'home-care-assistance',
        category: 'Home Care',
        icon: 'bi-heart-pulse-fill',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop',
        shortDescription: 'Compassionate home nurses, elder care specialists, patient assistance, baby care, and personal aides.',
        description: 'Personalized in-home care services designed for families seeking compassionate, trustworthy nursing care for elderly loved ones, recovering patients, infants, or executive personal assistants.',
        features: [
          'Dignified Senior Care & Post-Operative Nursing',
          '24/7 In-Residence or Shift-Based Assistance',
          'Certified Infant & Child Care Specialists',
          'Custom Personal Assistant Matching'
        ],
        rolesProvided: ['Home Nurses', 'Patient Care Assistants', 'Elder Care Givers', 'Companion Care Specialists', 'Baby Care Nannies', 'Personal Assistants'],
        order: 4
      },
      {
        title: 'Corporate Executive Staffing',
        slug: 'corporate-staffing',
        category: 'Corporate Staffing',
        icon: 'bi-building-fill-gear',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
        shortDescription: 'High-caliber talent in Human Resources, Accounts, Sales, Information Technology, and Executive Support.',
        description: 'Empowering enterprise growth by sourcing top-tier corporate managers, financial analysts, software engineers, and administrative executives matched to your organizational culture.',
        features: [
          'Executive Headhunting & Competency Assessment',
          'Reduced Time-to-Hire & High Retention Rate',
          'Specialized IT & Finance Talent Pipelines',
          'Flexible Staff Augmentation & Direct Placement'
        ],
        rolesProvided: ['HR Managers', 'Accounts Officers', 'Sales Executives', 'IT Engineers', 'Receptionists', 'Customer Support Leads'],
        order: 5
      },
      {
        title: 'HR Outsourcing & Payroll Management',
        slug: 'hr-outsourcing-payroll',
        category: 'HR Outsourcing',
        icon: 'bi-cash-coin',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
        shortDescription: 'End-to-end statutory compliance, payroll processing, employee benefits administration, and risk mitigation.',
        description: 'Streamline your corporate operations with Apex HR Outsourcing. We handle complex multi-state payroll, tax deductions, employee contracts, performance reviews, and benefits administration seamlessly.',
        features: [
          'Automated Direct Deposit & Tax Filing',
          'Complete Labour Law Compliance Guarantee',
          'Employee Self-Service Portal Integration',
          'Customized Monthly HR Analytics Reporting'
        ],
        rolesProvided: ['Payroll Specialist', 'HR Compliance Lead', 'Benefits Specialist', 'Talent Acquisition Manager'],
        order: 6
      }
    ];

    const insertedServices = await Service.insertMany(servicesData);
    console.log(`Inserted ${insertedServices.length} Services.`);

    // 4. Create Dynamic Jobs
    const jobsData = [
      {
        jobTitle: 'Senior High School Mathematics Teacher',
        category: 'School Staffing',
        department: 'Academic Department',
        location: 'New York, NY',
        employmentType: 'Full-Time',
        experience: '3-5 Years',
        salary: '$65,000 - $80,000 / year',
        vacancies: 3,
        qualification: 'Master’s Degree in Education / Mathematics',
        skills: ['Curriculum Planning', 'STEM Education', 'Classroom Management', 'AP Calculus'],
        description: 'We are seeking an experienced Senior High School Mathematics Teacher for a prestigious private academy. The ideal candidate will inspire students through advanced calculus, algebra, and analytical thinking.',
        responsibilities: [
          'Design and deliver engaging daily lesson plans aligning with state academic standards.',
          'Prepare students for Advanced Placement (AP) examinations and college entrance tests.',
          'Maintain regular communication with parents regarding student progress.'
        ],
        benefits: ['Full Health Insurance', 'Retirement 401(k) Matching', 'Tuition Assistance', 'Paid Summer Leave'],
        genderPreference: 'Any',
        ageLimit: '24 - 55 Years',
        workingHours: '8:00 AM - 4:00 PM (Mon-Fri)',
        status: 'published',
        isFeatured: true,
        companyName: 'St. Jude International Academy',
        companyImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=400&auto=format&fit=crop'
      },
      {
        jobTitle: 'Lead Corporate Security Supervisor',
        category: 'Security Staffing',
        department: 'Asset Protection & Safety',
        location: 'Jersey City, NJ',
        employmentType: 'Full-Time',
        experience: '4-7 Years',
        salary: '$50,000 - $62,000 / year',
        vacancies: 2,
        qualification: 'Security Officer Certification / Ex-Military Preferred',
        skills: ['Access Control', 'CCTV Operations', 'Emergency Response', 'Team Leadership'],
        description: 'Apex Security requires a Lead Security Supervisor to oversee safety protocols, visitor management, and guard patrols at a premier financial tower.',
        responsibilities: [
          'Supervise 15+ shift security guards and conduct daily roll-call briefings.',
          'Monitor CCTV systems and manage automated access badge control.',
          'Execute crisis response protocols during building emergencies.'
        ],
        benefits: ['Overtime Allowance', 'Uniform Provided', 'Medical Coverage', 'Performance Bonuses'],
        genderPreference: 'Any',
        ageLimit: '25 - 50 Years',
        workingHours: '12-Hour Shift Patrol (Rotational)',
        status: 'published',
        isFeatured: true,
        companyName: 'Apex Security Force',
        companyImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=400&auto=format&fit=crop'
      },
      {
        jobTitle: 'Critical Care ICU Specialist Nurse',
        category: 'Healthcare Staffing',
        department: 'Intensive Care Unit (ICU)',
        location: 'Brooklyn, NY',
        employmentType: 'Full-Time',
        experience: '2-4 Years',
        salary: '$95,000 - $115,000 / year',
        vacancies: 5,
        qualification: 'BSN Nurse License (RN) + ACLS / BLS Certification',
        skills: ['Patient Monitoring', 'Ventilator Management', 'EHR Systems', 'Critical Care'],
        description: 'Join a state-of-the-art medical center as a Critical Care ICU Nurse providing life-saving interventions and compassionate bedside care.',
        responsibilities: [
          'Monitor vital signs of critical care patients and adjust medication drips.',
          'Collaborate with attending physicians in emergency resuscitation procedures.',
          'Maintain precise Electronic Health Records (EHR) and patient documentation.'
        ],
        benefits: ['Sign-on Bonus $5,000', 'Flexible Shift Scheduling', 'Comprehensive Medical & Dental', 'Continuing Education Stipend'],
        genderPreference: 'Any',
        ageLimit: '22 - 50 Years',
        workingHours: '12 Hours (Day/Night Rotation)',
        status: 'published',
        isFeatured: true,
        companyName: 'Metropolitan General Hospital',
        companyImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=400&auto=format&fit=crop'
      },
      {
        jobTitle: 'Private In-Home Senior Care Giver',
        category: 'Home Care',
        department: 'Private Residence Care',
        location: 'Manhattan, NY',
        employmentType: 'Full-Time',
        experience: '1-3 Years',
        salary: '$4,000 - $5,200 / month',
        vacancies: 4,
        qualification: 'Certified Nursing Assistant (CNA) or Equivalent',
        skills: ['Elder Care', 'Mobility Assistance', 'Medication Reminders', 'Meal Prep'],
        description: 'Seeking a warm, patient Home Care Aide to assist an elderly client with daily living activities, companionship, and medication reminders.',
        responsibilities: [
          'Assist client with bathing, dressing, grooming, and mobility support.',
          'Prepare nutritious meals and manage light housekeeping duties.',
          'Provide engaging companionship and escort to medical appointments.'
        ],
        benefits: ['Live-in Room & Board Option', 'Paid Time Off', 'Holiday Pay Multiplier'],
        genderPreference: 'Female',
        ageLimit: '25 - 55 Years',
        workingHours: 'Full-Time Live-in or 8-Hour Shift',
        status: 'published',
        isFeatured: false,
        companyName: 'Apex Healthcare At Home',
        companyImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400&auto=format&fit=crop'
      },
      {
        jobTitle: 'Senior Human Resources Business Partner',
        category: 'Corporate Staffing',
        department: 'People & Culture',
        location: 'New York, NY',
        employmentType: 'Full-Time',
        experience: '5-8 Years',
        salary: '$90,000 - $110,000 / year',
        vacancies: 1,
        qualification: 'Bachelor/Master Degree in Human Resource Management (SHRM Certified)',
        skills: ['Talent Acquisition', 'Employee Relations', 'HR Automation', 'Performance Management'],
        description: 'An executive role leading HR strategy, organizational development, employee engagement, and talent acquisition for a expanding fintech firm.',
        responsibilities: [
          'Partner with C-level executives to align people strategies with business goals.',
          'Oversee recruitment pipelines, onboarding workflows, and retention metrics.',
          'Resolve employee grievances and uphold workplace compliance standards.'
        ],
        benefits: ['Stock Options', 'Hybrid Work Policy', 'Unlimited PTO', 'Comprehensive Health Plan'],
        genderPreference: 'Any',
        ageLimit: '28 - 50 Years',
        workingHours: '9:00 AM - 5:00 PM (Hybrid)',
        status: 'published',
        isFeatured: true,
        companyName: 'Vanguard Global Corp',
        companyImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop'
      },
      {
        jobTitle: 'Senior Financial & Payroll Administrator',
        category: 'HR Outsourcing',
        department: 'Finance & Operations',
        location: 'White Plains, NY',
        employmentType: 'Full-Time',
        experience: '3-6 Years',
        salary: '$70,000 - $85,000 / year',
        vacancies: 2,
        qualification: 'BS in Accounting / Finance / CPA Eligible',
        skills: ['ADP / Workday Payroll', 'Tax Withholdings', 'Audit Compliance', 'Excel VBA'],
        description: 'Responsible for managing bi-weekly multi-state payroll execution, statutory tax compliance, and benefit reconciliation for over 1,500 employees.',
        responsibilities: [
          'Execute automated payroll processing via Workday / ADP system.',
          'Reconcile payroll liabilities, tax withholdings, and employee deductions.',
          'Respond to payroll queries and prepare monthly auditing reports.'
        ],
        benefits: ['401(k) 5% Match', 'Annual Bonus', 'Medical/Vision/Dental', 'Career Escalation'],
        genderPreference: 'Any',
        ageLimit: '23 - 48 Years',
        workingHours: '8:30 AM - 5:00 PM',
        status: 'published',
        isFeatured: false,
        companyName: 'Apex Outsourcing Hub',
        companyImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop'
      }
    ];

    const insertedJobs = await Job.insertMany(jobsData);
    console.log(`Inserted ${insertedJobs.length} Jobs.`);

    // 5. Create Testimonials
    const testimonialsData = [
      {
        name: 'Dr. Arthur Pendelton',
        designation: 'Dean of Academics',
        company: 'St. Jude International Academy',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
        review: 'Apex Staffing provided our institution with top-tier STEM educators within 48 hours. Their rigorous credential checks and professionalism saved our academic semester!',
        rating: 5,
        status: 'active'
      },
      {
        name: 'Elena Rostova',
        designation: 'VP of Human Resources',
        company: 'Vanguard Global Corp',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
        review: 'The quality of candidates sourced by Apex is unmatched. Their executive recruitment team understood our corporate ethos perfectly and filled critical technical leads effortlessly.',
        rating: 5,
        status: 'active'
      },
      {
        name: 'Michael Vance',
        designation: 'Director of Security Ops',
        company: 'Financial Center Towers',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
        review: 'Apex Security officers are punctual, sharp, and highly disciplined. They transformed our facility security protocol and elevated our corporate standard.',
        rating: 5,
        status: 'active'
      }
    ];

    await Testimonial.insertMany(testimonialsData);
    console.log('Inserted Testimonials.');

    // 6. Create Corporate Clients (Logos)
    const clientsData = [
      { companyName: 'St. Jude Academy', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=300&auto=format&fit=crop', website: 'https://example.com' },
      { companyName: 'Vanguard Global', logo: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?q=80&w=300&auto=format&fit=crop', website: 'https://example.com' },
      { companyName: 'Metropolitan Hospital', logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300&auto=format&fit=crop', website: 'https://example.com' },
      { companyName: 'Empire Financial Group', logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop', website: 'https://example.com' },
      { companyName: 'Horizon Tech Networks', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop', website: 'https://example.com' }
    ];

    await Client.insertMany(clientsData);
    console.log('Inserted Client Logos.');

    // 7. Create Gallery Items
    const galleryData = [
      {
        title: 'Modern Science Laboratory Staffing',
        category: 'School',
        description: 'Certified lab technicians conducting high school chemistry demonstrations.',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
        status: 'active'
      },
      {
        title: 'Tactical Corporate Security Squad',
        category: 'Security',
        description: 'Uniformed guards maintaining 24/7 security at financial headquarters.',
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=800&auto=format&fit=crop',
        status: 'active'
      },
      {
        title: 'ICU Clinical Care Unit Team',
        category: 'Healthcare',
        description: 'Accredited intensive care nurses monitoring advanced patient vitals.',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop',
        status: 'active'
      },
      {
        title: 'In-Home Senior Companion Nursing',
        category: 'Home Care',
        description: 'Dignified elder care specialist assisting with rehabilitation mobility.',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop',
        status: 'active'
      },
      {
        title: 'Enterprise Boardroom HR Consultation',
        category: 'Corporate',
        description: 'Senior HR consultants facilitating strategic workforce alignment.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
        status: 'active'
      }
    ];

    await Gallery.insertMany(galleryData);
    console.log('Inserted Gallery items.');

    // 8. Sample Applications
    if (insertedJobs.length > 0) {
      await Application.create({
        jobId: insertedJobs[0]._id,
        name: 'Sarah Jenkins',
        phone: '+1 (555) 234-5678',
        email: 'sarah.jenkins@example.com',
        qualification: 'Master of Science in Mathematics',
        experience: '4 Years',
        expectedSalary: '$75,000 / yr',
        resumeUrl: '/uploads/sample_resume_sarah.pdf',
        coverLetter: 'I am excited to submit my candidate application for the Senior Math Teacher role. I have extensive experience in AP Calculus instruction.',
        status: 'pending'
      });
      await Application.create({
        jobId: insertedJobs[2]._id,
        name: 'Robert Sterling',
        phone: '+1 (555) 987-6543',
        email: 'robert.nurse@example.com',
        qualification: 'BSN Registered Nurse',
        experience: '5 Years ICU',
        expectedSalary: '$105,000 / yr',
        resumeUrl: '/uploads/sample_resume_robert.pdf',
        coverLetter: 'Dedicated ICU Specialist Nurse with emergency trauma experience.',
        status: 'selected'
      });
    }

    console.log('Successfully completed database seeding!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed execution:', error);
    process.exit(1);
  }
};

seedData();
