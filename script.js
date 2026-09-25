// ======================================================
// SKILLPATH - COMPLETE JAVASCRIPT
// ======================================================
// Current logged-in user
let currentUserId = localStorage.getItem("userId");
// ======================================================
// SECTION NAVIGATION
// ======================================================
function showSection(sectionId, saveSection = true) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        section.classList.remove("active");
    });
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add("active");
    }
    // Remember current section
    if (saveSection) {
        sessionStorage.setItem(
            "currentSection",
            sectionId
        );
    }
    // Scroll to top when opening a new section
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// ======================================================
// REGISTER
// ======================================================
document.getElementById("registerForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();
        const name =
            document.getElementById("registerName").value.trim();
        const email =
            document.getElementById("registerEmail").value.trim();
        const password =
            document.getElementById("registerPassword").value;
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            const data = await response.json();
            document.getElementById(
                "registerMessage"
            ).textContent = data.message;
            if (response.ok) {
                document.getElementById(
                    "registerForm"
                ).reset();
                setTimeout(() => {
                    showSection(
                        "loginSection"
                    );
                }, 1000);
            }
        } catch (error) {
            console.log(
                "Register error:",
                error
            );
            document.getElementById(
                "registerMessage"
            ).textContent =
                "Something went wrong.";
        }
    }
);
// ======================================================
// LOGIN
// ======================================================
document.getElementById("loginForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();
        const email =
            document.getElementById("loginEmail").value.trim();
        const password =
            document.getElementById("loginPassword").value;
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            document.getElementById(
                "loginMessage"
            ).textContent = data.message;
            if (response.ok) {
                currentUserId =
                    data.userId;
                localStorage.setItem(
                    "userId",
                    data.userId
                );
                localStorage.setItem(
                    "userName",
                    data.name
                );
                updateNavbar();
                const dashboardUserName =
                    document.getElementById(
                        "dashboardUserName"
                    );
                if (dashboardUserName) {
                    dashboardUserName.textContent =
                        data.name;
                }
                const welcomeUser =
                    document.getElementById(
                        "welcomeUser"
                    );
                if (welcomeUser) {
                    welcomeUser.textContent =
                        `Welcome, ${data.name}!`;
                }
                setTimeout(() => {
                    showSection(
                        "dashboardSection"
                    );
                    loadRoadmaps();
                }, 500);
            }
        } catch (error) {
            console.log(
                "Login error:",
                error
            );
            document.getElementById(
                "loginMessage"
            ).textContent =
                "Something went wrong.";
        }
    }
);
// ======================================================
// CREATE ROADMAP
// ======================================================
document.getElementById("roadmapForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();
        if (!currentUserId) {
            alert(
                "Please login first."
            );
            showSection(
                "loginSection"
            );
            return;
        }
        const goal =
            document.getElementById(
                "goal"
            ).value;
        const level =
            document.getElementById(
                "level"
            ).value;
        const studyTime =
            document.getElementById(
                "studyTime"
            ).value;
        const purpose =
            document.getElementById(
                "purpose"
            ).value;
        try {
            const response = await fetch(
                "/api/roadmaps",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        userId:
                            currentUserId,
                        goal:
                            goal,
                        level:
                            level,
                        studyTime:
                            studyTime,
                        purpose:
                            purpose
                    })
                }
            );
            const data =
                await response.json();
            document.getElementById(
                "roadmapMessage"
            ).textContent =
                data.message;
            if (response.ok) {
                document.getElementById(
                    "roadmapForm"
                ).reset();
                showRoadmap(
                    data.roadmap
                );
            }
        } catch (error) {
            console.log(
                "Roadmap creation error:",
                error
            );
            document.getElementById(
                "roadmapMessage"
            ).textContent =
                "Could not create roadmap.";
        }
    }
);
// ======================================================
// LOAD ROADMAPS
// ======================================================
async function loadRoadmaps() {
    if (!currentUserId) {
        return;
    }
    try {
        const response =
            await fetch(
                `/api/roadmaps/${currentUserId}`
            );
        const roadmaps =
            await response.json();
        // ==================================================
        // DASHBOARD STATISTICS
        // ==================================================
        const totalRoadmaps =
            roadmaps.length;
        let completedRoadmaps = 0;
        let totalProgress = 0;
        roadmaps.forEach(
            roadmap => {
                const completed =
                    roadmap.topics.filter(
                        topic =>
                            topic.completed
                    ).length;
                const total =
                    roadmap.topics.length;
                const progress =
                    total === 0
                        ? 0
                        : Math.round(
                            (completed / total) *
                            100
                        );
                totalProgress +=
                    progress;
                if (progress === 100) {
                    completedRoadmaps++;
                }
            }
        );
        const averageProgress =
            totalRoadmaps === 0
                ? 0
                : Math.round(
                    totalProgress /
                    totalRoadmaps
                );
        // ==================================================
        // UPDATE DASHBOARD STATISTICS
        // ==================================================
        const totalElement =
            document.getElementById(
                "totalRoadmaps"
            );
        if (totalElement) {
            totalElement.textContent =
                totalRoadmaps;
        }
        const completedElement =
            document.getElementById(
                "completedRoadmaps"
            );
        if (completedElement) {
            completedElement.textContent =
                completedRoadmaps;
        }
        const averageElement =
            document.getElementById(
                "averageProgress"
            );
        if (averageElement) {
            averageElement.textContent =
                averageProgress + "%";
        }
        // ==================================================
        // ROADMAP CONTAINER
        // ==================================================
        const container =
            document.getElementById(
                "roadmapsContainer"
            );
        if (!container) {
            return;
        }
        container.innerHTML = "";
        // ==================================================
        // NO ROADMAPS
        // ==================================================
        if (roadmaps.length === 0) {
            container.innerHTML = `
                <div class="empty-roadmaps">
                    <h4>
                        No roadmaps yet 📚
                    </h4>
                    <p>
                        Create your first
                        learning roadmap
                        to get started.
                    </p>
                </div>
            `;
            return;
        }
        // ==================================================
        // DISPLAY ROADMAPS
        // ==================================================
        roadmaps.forEach(
            roadmap => {
                const completed =
                    roadmap.topics.filter(
                        topic =>
                            topic.completed
                    ).length;
                const total =
                    roadmap.topics.length;
                const progress =
                    total === 0
                        ? 0
                        : Math.round(
                            (completed / total) *
                            100
                        );
                const card =
                    document.createElement(
                        "div"
                    );
                card.className =
                    "roadmap-card";
                card.innerHTML = `
                    <h4>
                        ${roadmap.goal}
                    </h4>
                    <p>
                        <strong>
                            Level:
                        </strong>
                        ${roadmap.level}
                    </p>
                    <p>
                        <strong>
                            Study Time:
                        </strong>
                        ${roadmap.studyTime}
                    </p>
                    <div
                        class="progress-container"
                    >
                        <div
                            class="progress-header"
                        >
                            <span>
                                Learning Progress
                            </span>
                            <span>
                                ${progress}%
                            </span>
                        </div>
                        <div
                            class="progress-bar"
                        >
                            <div
                                class="progress-fill"
                                style="
                                    width:
                                    ${progress}%
                                "
                            ></div>
                        </div>
                    </div>
                    <p
                        class="progress-text"
                    >
                        ${completed}/${total}
                        completed
                    </p>
                    <button
                        onclick='showRoadmap(${JSON.stringify(roadmap)})'
                    >
                        View Roadmap
                    </button>
                    <button
                        onclick="
                            deleteRoadmap(
                                '${roadmap._id}'
                            )
                        "
                    >
                        Delete
                    </button>
                `;
                container.appendChild(
                    card
                );
            }
        );
    } catch (error) {
        console.log(
            "Error loading roadmaps:",
            error
        );
    }
}
// ======================================================
// SHOW ROADMAP
// ======================================================
function showRoadmap(roadmap) {
    // Save which roadmap is open
    sessionStorage.setItem(
        "currentRoadmapId",
        roadmap._id
    );
    showSection(
        "roadmapSection"
    );
    // ==================================================
    // TITLE
    // ==================================================
    document.getElementById(
        "roadmapTitle"
    ).textContent =
        roadmap.goal +
        " Roadmap";
    // ==================================================
    // INFORMATION
    // ==================================================
    document.getElementById(
        "roadmapInfo"
    ).textContent =
        `Level: ${roadmap.level} | ` +
        `Study Time: ${roadmap.studyTime} | ` +
        `Purpose: ${roadmap.purpose}`;
    // ==================================================
    // CALCULATE PROGRESS
    // ==================================================
    const completed =
        roadmap.topics.filter(
            topic =>
                topic.completed
        ).length;
    const total =
        roadmap.topics.length;
    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) *
                100
            );
    // ==================================================
    // COMPLETION MESSAGE
    // ==================================================
    const completionMessage =
        document.getElementById(
            "completionMessage"
        );
    if (completionMessage) {
        if (progress === 100) {
            completionMessage.innerHTML = `
                Congratulations!
                You completed this roadmap.
            `;
            completionMessage.style.display =
                "block";
        } else {
            completionMessage.style.display =
                "none";
        }
    }
    // ==================================================
    // PROGRESS AREA
    // ==================================================
    const progressArea =
        document.getElementById(
            "roadmapProgress"
        );
    if (progressArea) {
        progressArea.innerHTML = `
            <div
                class="roadmap-progress-box"
            >
                <div
                    class="progress-title"
                >
                    <span>
                        Learning Progress
                    </span>
                    <strong>
                        ${progress}%
                    </strong>
                </div>
                <div
                    class="large-progress-bar"
                >
                    <div
                        class="large-progress-fill"
                        style="
                            width:
                            ${progress}%
                        "
                    ></div>
                </div>
                <p>
                    Progress:
                    ${completed}/${total}
                    completed
                    (${progress}%)
                </p>
            </div>
        `;
    }
    // ==================================================
    // SHOW TOPICS
    // ==================================================
    const container =
        document.getElementById(
            "roadmapTopics"
        );
    if (!container) {
        return;
    }
    container.innerHTML = "";
    roadmap.topics.forEach(
        (topic, index) => {
            const topicDiv =
                document.createElement(
                    "div"
                );
            topicDiv.className =
                topic.completed
                    ? "topic completed"
                    : "topic";
            topicDiv.innerHTML = `
                <label>
                    <input
                        type="checkbox"
                        ${
                            topic.completed
                                ? "checked"
                                : ""
                        }
                        onchange="
                            updateTopic(
                                '${roadmap._id}',
                                ${index},
                                this.checked
                            )
                        "
                    >
                    <span>
                        ${topic.name}
                    </span>
                </label>
                <span
                    class="topic-status"
                >
                    ${
                        topic.completed
                            ? "Completed ✓"
                            : "Not Started"
                    }
                </span>
            `;
            container.appendChild(
                topicDiv
            );
        }
    );
}
// ======================================================
// UPDATE TOPIC
// ======================================================
async function updateTopic(
    roadmapId,
    topicIndex,
    newStatus
) {
    // Remember current scroll position
    const currentScrollPosition =
        window.scrollY;
    try {
        const response =
            await fetch(
                `/api/roadmaps/${currentUserId}`
            );
        const roadmaps =
            await response.json();
        const roadmap =
            roadmaps.find(
                item =>
                    item._id === roadmapId
            );
        if (!roadmap) {
            console.log(
                "Roadmap not found"
            );
            return;
        }
        // Update selected topic
        roadmap.topics[
            topicIndex
        ].completed =
            newStatus;
        // ==================================================
        // UPDATE MONGODB
        // ==================================================
        const updateResponse =
            await fetch(
                `/api/roadmaps/${roadmapId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        topics:
                            roadmap.topics
                    })
                }
            );
        const updatedData =
            await updateResponse.json();
        if (updateResponse.ok) {
            const completed =
                updatedData.roadmap.topics.filter(
                    topic =>
                        topic.completed
                ).length;
            const total =
                updatedData.roadmap.topics.length;
            const allCompleted =
                total > 0 &&
                completed === total;
            // Update roadmap
            showRoadmap(
                updatedData.roadmap
            );
            // Only move to top when
            // ALL topics are completed
            if (allCompleted) {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            } else {
                // Stay at same position
                window.scrollTo({
                    top:
                        currentScrollPosition,
                    behavior: "instant"
                });
            }
        } else {
            console.log(
                "Update failed:",
                updatedData
            );
        }
    } catch (error) {
        console.log(
            "Update topic error:",
            error
        );
    }
}
// ======================================================
// DELETE ROADMAP
// ======================================================
async function deleteRoadmap(id) {
    const confirmDelete =
        confirm(
            "Are you sure you want to delete this roadmap?"
        );
    if (!confirmDelete) {
        return;
    }
    try {
        const response =
            await fetch(
                `/api/roadmaps/${id}`,
                {
                    method: "DELETE"
                }
            );
        const data =
            await response.json();
        alert(
            data.message
        );
        loadRoadmaps();
    } catch (error) {
        console.log(
            "Delete roadmap error:",
            error
        );
    }
}
// ======================================================
// LOGOUT
// ======================================================
function logout() {
    localStorage.removeItem(
        "userId"
    );
    localStorage.removeItem(
        "userName"
    );
    // Clear remembered page
    sessionStorage.removeItem(
        "currentSection"
    );
    sessionStorage.removeItem(
        "currentRoadmapId"
    );
    currentUserId = null;
    updateNavbar();
    showSection(
        "homeSection"
    );
}
// ======================================================
// DYNAMIC NAVBAR
// ======================================================
function updateNavbar() {
    const navbarButtons =
        document.getElementById(
            "navbarButtons"
        );
    if (!navbarButtons) {
        return;
    }
    const userId =
        localStorage.getItem(
            "userId"
        );
    if (userId) {
        navbarButtons.innerHTML = `
            <button
                onclick="
                    showSection(
                        'dashboardSection'
                    )
                "
            >
                Dashboard
            </button>
            <button
                onclick="
                    logout()
                "
            >
                Logout
            </button>

        `;
    } else {
        navbarButtons.innerHTML = `
            <button
                onclick="
                    showSection(
                        'loginSection'
                    )
                "
            >
                Login
            </button>
            <button
                onclick="
                    showSection(
                        'registerSection'
                    )
                "
            >
                Sign Up
            </button>
        `;
    }
}
// ======================================================
// LOGO → HOME
// ======================================================
function goHome() {
    showSection(
        "homeSection"
    );
}
// ======================================================
// PAGE LOAD
// ======================================================
window.addEventListener(
    "DOMContentLoaded",
    async function () {
        const savedUserId =
            localStorage.getItem(
                "userId"
            );
        // ==================================================
        // USER IS LOGGED IN
        // ==================================================
        if (savedUserId) {
            currentUserId =
                savedUserId;
            const savedUserName =
                localStorage.getItem(
                    "userName"
                );
            // Dashboard name
            const dashboardUserName =
                document.getElementById(
                    "dashboardUserName"
                );
            if (
                dashboardUserName &&
                savedUserName
            ) {
                dashboardUserName.textContent =
                    savedUserName;
            }
            // Welcome message
            const welcomeUser =
                document.getElementById(
                    "welcomeUser"
                );
            if (
                welcomeUser &&
                savedUserName
            ) {
                welcomeUser.textContent =
                    `Welcome, ${savedUserName}!`;
            }
            // ==================================================
            // RESTORE LAST SECTION
            // ==================================================
            const savedSection =
                sessionStorage.getItem(
                    "currentSection"
                ) ||
                "homeSection";
            // If roadmap was open before refresh
            if (
                savedSection ===
                "roadmapSection"
            ) {
                const roadmapId =
                    sessionStorage.getItem(
                        "currentRoadmapId"
                    );
                if (roadmapId) {
                    try {
                        const response =
                            await fetch(
                                `/api/roadmaps/${currentUserId}`
                            );
                        const roadmaps =
                            await response.json();
                        const roadmap =
                            roadmaps.find(
                                item =>
                                    item._id ===
                                    roadmapId
                            );
                        if (roadmap) {
                            showRoadmap(
                                roadmap
                            );
                        } else {
                            showSection(
                                "dashboardSection"
                            );
                        }
                    } catch (error) {
                        console.log(
                            "Could not restore roadmap:",
                            error
                        );
                        showSection(
                            "dashboardSection"
                        );
                    }
                } else {
                    showSection(
                        "dashboardSection"
                    );
                }
            } else {
                // Restore normal section
                showSection(
                    savedSection,
                    false
                );
            }
            // Load roadmap data
            loadRoadmaps();
        } else {
            // User is logged out
            showSection(
                "homeSection"
            );
        }
        // Update navbar
        updateNavbar();
    }
);
// ======================================================
// SHOW / HIDE PASSWORD
// ======================================================

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        button.classList.add("showing");
    } else {
        input.type = "password";
        button.classList.remove("showing");
    }
}