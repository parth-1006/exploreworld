//NAVBAR TOGGLE
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

//EXPLORE PAGE CARDS
const packageGrid = document.getElementById("packageGrid");

if (packageGrid) {
    fetch("https://exploreworld-backend.onrender.com/api/packages")
        .then(res => res.json())
        .then(packagesData => {

            packageGrid.innerHTML = ""; // clear old cards

            packagesData.forEach(pkg => {
                const card = document.createElement("div");
                card.classList.add("card", "package-card");

                card.innerHTML = `
                    <img src="https://exploreworld-backend.onrender.com/${pkg.imageUrl}" alt="${pkg.name}">
                    <h3>${pkg.name}</h3>
                    <p>Starting from ${pkg.price}</p>
                    <button class="btn-primary details-btn">Details</button>
                `;

                card.querySelector(".details-btn").addEventListener("click", () => {
                    window.location.href = `package-details.html?id=${pkg.id}`;
                });

                packageGrid.appendChild(card);
            });
        })
        .catch(err => console.error("Error loading packages:", err));
}

//HOME PAGE PACKAGE-GRID RANDOM 4 CARDS
const homePackageGrid = document.getElementById("homePackageGrid");

if (homePackageGrid) {
        fetch("https://exploreworld-backend.onrender.com/api/packages")
        .then(res => res.json())
        .then(packagesData => {

    const shuffledPackages = [...packagesData].sort(() => 0.5 - Math.random());
    const randomFour = shuffledPackages.slice(0, 4);

    randomFour.forEach(pkg => {
        const card = document.createElement("div");
        card.classList.add("card", "package-card");

        card.innerHTML = `
            <img src="${pkg.imageUrl}" alt="${pkg.name}">
            <h3>${pkg.name}</h3>
            <p>Starting from ${pkg.price}</p>
        `;
        card.addEventListener("click", () => {
        window.location.href = `explore.html#${pkg.id}`;
        });

        homePackageGrid.appendChild(card);
    });
})
.catch(err => console.error("Error loading home packages:", err));
}

//CAROUSAL-HOME PAGE 
const carouselTrack = document.querySelector(".carousel-track");
const carouselImages = document.querySelectorAll(".carousel-img");

let currentIndex = 0;

if (carouselTrack && carouselImages.length>0) {
    setInterval(() => {
        currentIndex++;

        if (currentIndex >= carouselImages.length) {
            currentIndex = 0;
        }

        carouselTrack.style.transform =
            `translateX(-${currentIndex * 100}%)`;
    }, 2000); //2000=2sec
}

//PACKAGE-DETAILS PAGE 
const detailsCard = document.getElementById("detailsCard");

if (detailsCard) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    fetch(`https://exploreworld-backend.onrender.com/api/packages/${id}`)
        .then(res => res.json())
        .then(pkg => {
            detailsCard.innerHTML = `
                <img src="https://exploreworld-backend.onrender.com/${pkg.imageUrl}" alt="${pkg.name}">
                <h2>${pkg.name}</h2>
                <p><strong>Package ID:</strong> ${pkg.id}</p>
                <p><strong>Price:</strong> ${pkg.price}</p>

                <div class="details-actions">
                    <button id="goBackBtn" class="secondary-btn">Go Back</button>
                    <button id="planTripBtn">Plan Your Trip</button>
                </div>
            `;

            document.getElementById("goBackBtn").addEventListener("click", () => {
                window.history.back();
            });

            document.getElementById("planTripBtn").addEventListener("click", () => {
                window.location.href = "contact.html";
            });
        })
        .catch(err => console.error("Error loading package details:", err));
}

//CONTACT PAGE PACKAGE-SELECT/STATE/CITY DROPDOWN MENU SELECT
const packageSelect = document.getElementById("packageSelect");
const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");

if (packageSelect) {
    const data= ["None", "Paris Tour", "Bali Trip"];
    
    data.forEach(package=> {
        const option= document.createElement("option");
        option.value= package;
        option.textContent= package;
        packageSelect.appendChild(option);
    });

}
if (stateSelect && citySelect) {
    const data = {
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Akola"],
        "Karnataka": ["Bangalore", "Mysore"],
        "Delhi": ["New Delhi"]
    };


    Object.keys(data).forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    stateSelect.addEventListener("change", () => {
        citySelect.innerHTML = "<option>Select City</option>";
        data[stateSelect.value]?.forEach(city => {
            const option = document.createElement("option");
            option.textContent = city;
            citySelect.appendChild(option);
        });
    });
}

//CONTACT FORM BACKEND CONNECTION
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault(); // stop page reload

        const formData = new FormData(contactForm);

        const contactData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            state: formData.get("state"),
            city: formData.get("city"),
            message: formData.get("message"),
            packageName: formData.get("packageName") || null
        };

        fetch("https://exploreworld-backend.onrender.com/api/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        })
        .then(res => res.json())
        .then(data => {
            alert("Message sent successfully!");
            contactForm.reset();
        })
        .catch(err => {
            console.error(err);
            alert("Error sending message");
        });
    });
}

//ADMIN LOGIN PAGE
const adminForm = document.getElementById("adminLoginForm");

if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("adminName").value;
        const password = document.getElementById("adminPassword").value;

        const response = await fetch("https://exploreworld-backend.onrender.com/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ name, password })
        });

        if (response.ok) {
            // LOGIN SUCCESS
            window.location.href = "admin-dashboard.html";
        } else {
            alert("Invalid Admin Credentials");
        }
    });
}

//ADMIN DASHBOARD : CONTACT TABLE
document.addEventListener("DOMContentLoaded", () => {

    const contactTable = document.getElementById("contactTable");

    if (contactTable) {
        fetch("https://exploreworld-backend.onrender.com/api/contacts")
            .then(response => response.json())
            .then(data => {
                console.log("Contacts received:", data);

                const tableBody = contactTable.querySelector("tbody");

                data.forEach(contact => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phone}</td>
                        <td>${contact.packageName}</td>
                        <td>${contact.state}</td>
                        <td>${contact.city}</td>
                        <td>${contact.message}</td>
                    `;

                    tableBody.appendChild(row);
                });
            })
            .catch(err => console.error("Error loading contacts:", err));
    }

});

//ADMIN DASHBOARD : ADD PACKAGE
const addPackageForm = document.getElementById("addPackageForm");

if (addPackageForm) {
    addPackageForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(addPackageForm);

        try {
            const response = await fetch("https://exploreworld-backend.onrender.com/api/packages/upload", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (response.ok) {
                alert("Package added successfully");
                addPackageForm.reset();
                setTimeout(()=>{
                    location.reload(); // refresh table & cards
                })} else {
                const msg = await response.text();
                alert(msg || "Failed to add package");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Server error");
        }
    });
}

//ADMIN DASHBOARD-LOGOUT BUTTON
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await fetch("https://exploreworld-backend.onrender.com/api/admin/logout", {
            method: "GET",
            credentials: "include"
        });
        window.location.href = "admin-login.html";
    });
}

//SESSION-CHECK
if (document.body.classList.contains("admin-page")) {
    // check session every 1 seconds
    setInterval(() => {
        fetch("https://exploreworld-backend.onrender.com/api/admin/check-session", {
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) {
                alert("Session expired! Redirecting to login...");
                window.location.href = "admin-login.html";
            }
        })
        .catch(() => {
            window.location.href = "admin-login.html";
        });
    }, 1000); // 1000ms = 1 seconds
}


