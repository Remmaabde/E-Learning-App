import mongoose from "mongoose";
import Course from "../models/course";
import User from "../models/user";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const seedCourses = async () => {
  try {
    
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/elearning";
    await mongoose.connect(mongoURI);
    
    // Find or create instructors with proper data
    let figmaInstructor = await User.findOne({ email: "sarem@instructor.com" });
    if (!figmaInstructor) {
      figmaInstructor = await User.create({
        email: "sarem@instructor.com",
        password: "password123",
        name: "Sarem",
        role: "instructor",
        bio: "Sarem is a UI/UX designer with 6+ years of experience working with startups and design agencies. he specializes in product design and has taught over 5,000 students how to bring their ideas to life using Figma.",
        image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop"
      });
    }

    let marioInstructor = await User.findOne({ email: "mario@instructor.com" });
    if (!marioInstructor) {
      marioInstructor = await User.create({
        email: "mario@instructor.com",
        password: "password123",
        name: "Mario",
        role: "instructor",
        bio: "Senior fullstack developer with cutting edge skills in the market.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop"
      });
    }

    let hadenInstructor = await User.findOne({ email: "haden@instructor.com" });
    if (!hadenInstructor) {
      hadenInstructor = await User.create({
        email: "haden@instructor.com",
        password: "password123",
        name: "Haden",
        role: "instructor",
        bio: "Haden is a Front-end developer with 3+ years of experience working with startups and design agencies.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop"
      });
    }

    let carlottaInstructor = await User.findOne({ email: "carlotta@instructor.com" });
    if (!carlottaInstructor) {
      carlottaInstructor = await User.create({
        email: "carlotta@instructor.com",
        password: "password123",
        name: "Carlotta",
        role: "instructor",
        bio: "AI specialist and educator with expertise in generative AI and large language models.",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop"
      });
    }

    let jabirInstructor = await User.findOne({ email: "jabir@instructor.com" });
    if (!jabirInstructor) {
      jabirInstructor = await User.create({
        email: "jabir@instructor.com",
        password: "password123",
        name: "Jabir",
        role: "instructor",
        bio: "Jabir is a Front-end developer with 4+ years of experience working with startups and Silicon valley.",
        image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&h=300&fit=crop"
      });
    }

    // Sample courses with proper video URLs and instructors
    const courses = [
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        title: "Introduction To Figma : Create Beautiful and Responsive Designs using Figma",
        category: "UI/UX",
        description: "provides instruction on using this popular tool for UI/UX design, web, and app design by covering its interface, design principles, and collaborative features.",
        instructor: figmaInstructor._id,
        lessons: [
          {
            title: "How to use Figma?",
            duration: "1:24:20",
            videoUrl: "https://www.youtube.com/embed/bI6q16ffdgQ"
          },
          {
            title: "How to use Figma Frames & Autolayout?",
            duration: "1:01:30",
            videoUrl: "https://www.youtube.com/embed/d88nvmnj5mU"
          }
        ],
        rating: 5,
        reviewsCount: 987,
        skills: ["UI Design", "Prototyping", "UI/UX", "graphic Designing"],
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop"
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
        title: "Fullstack Development",
        category: "Fullstack",
        description: "Master Full-stack development with our comprehensive, guided and mentored track to build scalable fullstack applications.",
        instructor: marioInstructor._id,
        lessons: [
          {
            title: "Master HTML&CSS",
            duration: "14:02:50",
            videoUrl: "https://www.youtube.com/embed/bWACo_pvKxg"
          },
          {
            title: "Master Tailwind CSS By Building 3 Projects",
            duration: "3:47:27",
            videoUrl: "https://www.youtube.com/embed/WvBnTJK7Khk"
          }
        ],
        rating: 4.5,
        reviewsCount: 987,
        skills: ["HTML", "CSS", "Javascript", "React", "Express", "MongoDB", "Node.js"],
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop"
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
        title: "Introduction To HTML",
        category: "Frontend",
        description: "A comprehensive course to teach HTML5, Tags & Forms.",
        instructor: hadenInstructor._id,
        lessons: [
          {
            title: "Learn HTML – Full Tutorial for Beginners",
            duration: "4:07:29",
            videoUrl: "https://www.youtube.com/embed/kUMe1FH4CHE"
          }
        ],
        rating: 5,
        reviewsCount: 987,
        skills: ["HTML", "Tags", "UI/UX", "CSS"],
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&h=300&fit=crop"
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"),
        title: "Introduction to Generative AI and LLMs [Pt 1] | Generative AI for Beginners",
        category: "AI",
        description: "Introduction our startup idea and mission, Generative AI and how we landed on the current technology landscape.",
        instructor: carlottaInstructor._id,
        lessons: [
          {
            title: "Introduction to Generative AI and LLMs [Pt 1]",
            duration: "10:41",
            videoUrl: "https://www.youtube.com/embed/lFXQkBvEe0o"
          }
        ],
        rating: 5,
        reviewsCount: 987,
        skills: ["AI", "Prompt Engineering"],
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439015"),
        title: "Introduction to Prompt Engineering",
        category: "Prompt Engineering",
        description: "Dive in and learn how to use ChatGPT in order to create effective prompts that will guide language models",
        instructor: carlottaInstructor._id,
        lessons: [
          {
            title: "Introduction to Generative AI and LLMs [Pt 1]",
            duration: "10:41",
            videoUrl: "https://www.youtube.com/embed/lFXQkBvEe0o"
          }
        ],
        rating: 5,
        reviewsCount: 987,
        skills: ["AI", "Prompt Engineering"],
        image: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=500&h=300&fit=crop"
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439016"),
        title: "Built a SaaS App Landing Page in 3 Hours",
        category: "Frontend",
        description: "Learn how to build and deploy a SaaS landing page with modern UI and mobile-first principles.",
        instructor: jabirInstructor._id,
        lessons: [
          {
            title: "Built a SaaS App Landing Page in 3 Hours",
            duration: "2:49:03",
            videoUrl: "https://www.youtube.com/embed/ukiGFmZ32YA"
          }
        ],
        rating: 5,
        reviewsCount: 987,
        skills: ["frontend", "React", "Tailwind", "CSS", "Responsive"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
      }
    ];

    
    await Course.deleteMany({});
    await Course.insertMany(courses);

    console.log("✅ Courses seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();
