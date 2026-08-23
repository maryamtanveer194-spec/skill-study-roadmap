const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(express.static("public"));
// =======================
// MONGODB CONNECTION
// =======================
mongoose
    .connect("mongodb://127.0.0.1:27017/skillPath")
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });
// =======================
// USER SCHEMA
// =======================
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);
// =======================
// ROADMAP SCHEMA
// =======================
const roadmapSchema = new mongoose.Schema({
    userId: String,
    goal: String,
    level: String,
    studyTime: String,
    purpose: String,
    topics: [
        {
            name: String,
            completed: Boolean
        }
    ]
});
const Roadmap = mongoose.model("Roadmap", roadmapSchema);
// =======================
// HOME ROUTE
// =======================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
// =======================
// WELCOME ROUTE
// =======================
app.get("/welcome", (req, res) => {
    res.send("Welcome to SkillPath!");
});
app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working!"
    });
});
// =======================
// REGISTER / SIGN UP
// =======================
app.post("/api/register", async (req, res) => {
    try {
        console.log("Register route called");
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }
        // Create new user
        const user = new User({
            name: name,
            email: email,
            password: password
        });
        // Save user in MongoDB
        await user.save();
        res.status(201).json({
            message: "Registration successful!",
            userId: user._id
        });
    } catch (error) {
        console.log("Registration error:", error);
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});
// =======================
// LOGIN
// =======================
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email,
            password: password
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        res.json({
            message: "Login successful!",
            userId: user._id,
            name: user.name
        });
    } catch (error) {
        console.log("Login error:", error);
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});
// ======================================================
// CREATE ROADMAP
// ======================================================

app.post("/api/roadmaps", async (req, res) => {

    try {

        const {
            userId,
            goal,
            level,
            studyTime,
            purpose
        } = req.body;


        let topics = [];


        // ==================================================
        // WEB DEVELOPMENT
        // ==================================================

        if (goal === "Web Development") {

            if (level === "Beginner") {

                topics = [
                    { name: "HTML Basics", completed: false },
                    { name: "CSS Fundamentals", completed: false },
                    { name: "JavaScript Basics", completed: false },
                    { name: "DOM and Events", completed: false },
                    { name: "Git and GitHub", completed: false },
                    { name: "Basic Web Projects", completed: false }
                ];

            }

            else if (level === "Intermediate") {

                topics = [
                    { name: "Advanced JavaScript", completed: false },
                    { name: "APIs and Fetch", completed: false },
                    { name: "Node.js", completed: false },
                    { name: "Express.js", completed: false },
                    { name: "MongoDB and Mongoose", completed: false },
                    { name: "Authentication", completed: false },
                    { name: "Full Stack Projects", completed: false }
                ];

            }

            else if (level === "Advanced") {

                topics = [
                    { name: "Advanced JavaScript Concepts", completed: false },
                    { name: "Backend Architecture", completed: false },
                    { name: "Advanced Node.js and Express", completed: false },
                    { name: "Database Design", completed: false },
                    { name: "Web Security", completed: false },
                    { name: "API Development", completed: false },
                    { name: "Deployment and Production", completed: false },
                    { name: "Advanced Full Stack Project", completed: false }
                ];

            }

        }


        // ==================================================
        // PYTHON DEVELOPMENT
        // ==================================================

        else if (goal === "Python Development") {

            if (level === "Beginner") {

                topics = [
                    { name: "Python Basics", completed: false },
                    { name: "Variables and Data Types", completed: false },
                    { name: "Conditions and Loops", completed: false },
                    { name: "Functions", completed: false },
                    { name: "Lists, Tuples and Dictionaries", completed: false },
                    { name: "File Handling", completed: false },
                    { name: "Error Handling", completed: false },
                    { name: "Basic Python Project", completed: false }
                ];

            }

            else if (level === "Intermediate") {

                topics = [
                    { name: "Object Oriented Programming", completed: false },
                    { name: "Modules and Packages", completed: false },
                    { name: "Virtual Environments", completed: false },
                    { name: "Working with APIs", completed: false },
                    { name: "Database Integration", completed: false },
                    { name: "Flask and FastAPI", completed: false },
                    { name: "Testing and Debugging", completed: false },
                    { name: "Intermediate Python Project", completed: false }
                ];

            }

            else if (level === "Advanced") {

                topics = [
                    { name: "Advanced Object Oriented Programming", completed: false },
                    { name: "REST API Development", completed: false },
                    { name: "Authentication and Authorization", completed: false },
                    { name: "Asynchronous Programming", completed: false },
                    { name: "Advanced Database Integration", completed: false },
                    { name: "Security Best Practices", completed: false },
                    { name: "Deployment and Performance", completed: false },
                    { name: "Advanced Python Project", completed: false }
                ];

            }

        }


        // ==================================================
        // DATA SCIENCE
        // ==================================================

        else if (goal === "Data Science") {

            if (level === "Beginner") {

                topics = [
                    { name: "Introduction to Data Science", completed: false },
                    { name: "Python for Data Science", completed: false },
                    { name: "NumPy Basics", completed: false },
                    { name: "Pandas Basics", completed: false },
                    { name: "Data Cleaning", completed: false },
                    { name: "Data Visualization", completed: false },
                    { name: "Basic Statistics", completed: false },
                    { name: "Beginner Data Analysis Project", completed: false }
                ];

            }

            else if (level === "Intermediate") {

                topics = [
                    { name: "Advanced Pandas", completed: false },
                    { name: "Exploratory Data Analysis", completed: false },
                    { name: "Statistical Analysis", completed: false },
                    { name: "Matplotlib and Seaborn", completed: false },
                    { name: "Data Preprocessing", completed: false },
                    { name: "Introduction to Machine Learning", completed: false },
                    { name: "Model Evaluation", completed: false },
                    { name: "Data Science Project", completed: false }
                ];

            }

            else if (level === "Advanced") {

                topics = [
                    { name: "Advanced Machine Learning", completed: false },
                    { name: "Feature Engineering", completed: false },
                    { name: "Supervised Learning", completed: false },
                    { name: "Unsupervised Learning", completed: false },
                    { name: "Model Optimization", completed: false },
                    { name: "Deep Learning Basics", completed: false },
                    { name: "Model Deployment", completed: false },
                    { name: "Advanced Data Science Project", completed: false }
                ];

            }

        }


        // ==================================================
        // UI/UX DESIGN
        // ==================================================

        else if (goal === "UI/UX Design") {

            if (level === "Beginner") {

                topics = [
                    { name: "Introduction to UI/UX", completed: false },
                    { name: "Design Principles", completed: false },
                    { name: "Color Theory", completed: false },
                    { name: "Typography", completed: false },
                    { name: "User Research Basics", completed: false },
                    { name: "Wireframing", completed: false },
                    { name: "Introduction to Figma", completed: false },
                    { name: "Simple UI Design Project", completed: false }
                ];

            }

            else if (level === "Intermediate") {

                topics = [
                    { name: "Advanced Figma", completed: false },
                    { name: "User Personas", completed: false },
                    { name: "User Flows", completed: false },
                    { name: "Information Architecture", completed: false },
                    { name: "Prototyping", completed: false },
                    { name: "Usability Testing", completed: false },
                    { name: "Responsive UI Design", completed: false },
                    { name: "Complete UI/UX Project", completed: false }
                ];

            }

            else if (level === "Advanced") {

                topics = [
                    { name: "Advanced Prototyping", completed: false },
                    { name: "Design Systems", completed: false },
                    { name: "Advanced User Research", completed: false },
                    { name: "Interaction Design", completed: false },
                    { name: "Accessibility", completed: false },
                    { name: "UX Strategy", completed: false },
                    { name: "Design Handoff", completed: false },
                    { name: "Professional UX Case Study", completed: false }
                ];

            }

        }


        // ==================================================
        // GRAPHIC DESIGN
        // ==================================================

        else if (goal === "Graphic Design") {

            if (level === "Beginner") {

                topics = [
                    { name: "Introduction to Graphic Design", completed: false },
                    { name: "Design Principles", completed: false },
                    { name: "Color Theory", completed: false },
                    { name: "Typography Basics", completed: false },
                    { name: "Shapes and Composition", completed: false },
                    { name: "Introduction to Canva", completed: false },
                    { name: "Basic Logo Design", completed: false },
                    { name: "Beginner Design Project", completed: false }
                ];

            }

            else if (level === "Intermediate") {

                topics = [
                    { name: "Advanced Typography", completed: false },
                    { name: "Advanced Color Theory", completed: false },
                    { name: "Brand Identity", completed: false },
                    { name: "Logo Design", completed: false },
                    { name: "Social Media Design", completed: false },
                    { name: "Photo Editing", completed: false },
                    { name: "Layout Design", completed: false },
                    { name: "Complete Branding Project", completed: false }
                ];

            }

            else if (level === "Advanced") {

                topics = [
                    { name: "Advanced Branding", completed: false },
                    { name: "Professional Logo Systems", completed: false },
                    { name: "Visual Identity Systems", completed: false },
                    { name: "Advanced Photo Manipulation", completed: false },
                    { name: "Creative Art Direction", completed: false },
                    { name: "Design for Marketing", completed: false },
                    { name: "Professional Portfolio", completed: false },
                    { name: "Advanced Graphic Design Project", completed: false }
                ];

            }

        }


        // ==================================================
        // SAFETY CHECK
        // ==================================================

        if (topics.length === 0) {

            return res.status(400).json({
                message: "No topics found for this goal and level."
            });

        }


        // ==================================================
        // CREATE ROADMAP
        // ==================================================

        const roadmap = new Roadmap({

            userId: userId,

            goal: goal,

            level: level,

            studyTime: studyTime,

            purpose: purpose,

            topics: topics

        });


        // ==================================================
        // SAVE TO MONGODB
        // ==================================================

        await roadmap.save();


        res.status(201).json({

            message: "Roadmap created successfully!",

            roadmap: roadmap

        });


    } catch (error) {

        console.log(
            "Roadmap creation error:",
            error
        );

        res.status(500).json({

            message: "Could not create roadmap",

            error: error.message

        });

    }

});
// =======================
// GET USER ROADMAPS
// =======================
app.get("/api/roadmaps/:userId", async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({
            userId: req.params.userId
        });
        res.json(roadmaps);
    } catch (error) {
        console.log("Fetch roadmaps error:", error);
        res.status(500).json({
            message: "Could not fetch roadmaps",
            error: error.message
        });
    }
});
// =======================
// UPDATE ROADMAP PROGRESS
// =======================
app.put("/api/roadmaps/:id", async (req, res) => {
    try {
        const { topics } = req.body;
        const roadmap = await Roadmap.findByIdAndUpdate(
            req.params.id,
            {
                topics: topics
            },
            {
                new: true
            }
        );
        if (!roadmap) {
            return res.status(404).json({
                message: "Roadmap not found"
            });
        }
        res.json({
            message: "Progress updated successfully!",
            roadmap: roadmap
        });
    } catch (error) {
        console.log("Update error:", error);
        res.status(500).json({
            message: "Could not update roadmap",
            error: error.message
        });
    }
});
// =======================
// DELETE ROADMAP
// =======================
app.delete("/api/roadmaps/:id", async (req, res) => {
    try {
        const roadmap = await Roadmap.findByIdAndDelete(
            req.params.id
        );
        if (!roadmap) {
            return res.status(404).json({
                message: "Roadmap not found"
            });
        }
        res.json({
            message: "Roadmap deleted successfully!"
        });
    } catch (error) {
        console.log("Delete error:", error);
        res.status(500).json({
            message: "Could not delete roadmap",
            error: error.message
        });
    }
});
// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
    console.log(
        `SkillPath server is running on http://localhost:${PORT}`
    );
});