document.addEventListener("DOMContentLoaded", function () {

    // Determine the current page
    const currentPage = window.location.pathname.split("/").pop();
    //*********************************************************************************/
    const companyBtn = document.getElementById("company-btn");
    if (companyBtn) {
        companyBtn.addEventListener("click", function() {
            window.location.href = "company.html";
        });
    }
    //*************************************************************************************/
    const customerBtn = document.getElementById("customer-btn");
    if (customerBtn) {
        customerBtn.addEventListener("click", function() {
            window.location.href = "customer_sign_in.html";
        });
    }
    //****************************************************************************/
    //sign in function to connect to backend
    async function signIn(event) {
        event.preventDefault();
        
        //data for backend
        const signinData = {
            email: document.getElementById("Email").value,
            password: document.getElementById("Password").value,
        };

        try {
            //post req for backend(insert url for fetch)
            const responce = await fetch("/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signinData)
            });

            if(responce.ok) {
                const responceData = await responce.json();
                //store user data in localstorage when signing in
                localStorage.setItem("user", JSON.stringify(responceData.user));
                window.location.href = "customer.html"
            }
            else {
                //get errorData from backend if needed
                const errorData = await responce.json();
                alert("Error");
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert("Network error.")
        }
    }
    const signinBtn = document.getElementById("signin-btn");
    if (signinBtn) {
        signinBtn.addEventListener("click", signIn);
    }

    //********************************************************************************/
    //sign up function to connect to backend
    async function signUp(event) {
        event.preventDefault();

        //data for backend
        const signupData = {
            firstName: document.getElementById("FirstName").value,
            lastName: document.getElementById("LastName").value,
            email: document.getElementById("Email").value,
            password: document.getElementById("Password").value,
            phone: document.getElementById("PhoneNumber").value,
            address: document.getElementById("Address").value,
        };

        try {
            //post req for backend(insert url for fetch)
            const responce = await fetch("/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData)
            });

            if(responce.ok) {
                const responceData = await responce.json();
                alert("Account created!");
                window.location.href = "customer_sign_in.html"
            }
            else {
                //get errorData from backend if needed
                const errorData = await responce.json();
                alert("Error");
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert("Network error.")
        }
    }
    const signupForm = document.getElementById("signup-submit-btn");
    if (signupForm) {
        signupForm.addEventListener("click", signUp);
    }
    //************************************************************************************/
    //recover password function to connect to backend
    async function recoverPassword(event) {
        event.preventDefault();
        
        const email = document.getElementById("email").value;

        if(!email) {
            alert("Valid email is required!");
            return;
        }

        //data for backend
        const data = {email: email};

        try{
            //post req for backend(insert url for fetch)
            const responce = await fetch("", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.parse.stringify(data)
            });

            if(responce.ok) {
                const responceData = await responce.json();

                document.getElementById("password-display").textContent = responceData.password;
                document.getElementById("recovered-password").style.display = "block";
            }
            else {
                //get errorData from backend if needed
                const errorData = await responce.json();
                alert("Error");
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert("Network error.");
        }
    }
    const recoverBtn = document.getElementById("recover-btn");
    if (recoverBtn) {
        recoverBtn.addEventListener("click", recoverPassword);
    }
    //*************************************************************************************/
    const signupBtn = document.getElementById("signup-btn");
    if (signupBtn) {
        signupBtn.addEventListener("click", function() {
            window.location.href = "customer_sign_up.html";
        });
    }
    //*************************************************************************************/
    const forgotpassBtn = document.getElementById("forgot-pass-btn");
    if (forgotpassBtn) {
        forgotpassBtn.addEventListener("click", function() {
            window.location.href = "recover_password.html";
        });
    }
    //***************************************************************************************/
    //validate session on pages needed
    /*
    const restrictedPages = ["customer.html", "review.html"];

    if (restrictedPages.includes(currentPage)) {
        const user = JSON.parse(localStorage.getItem("user"));
        if(!user) {
            alert("You must sign in first.");
            window.location.href = "customer_sign_in.html";
            return;
        }
        document.getElementById("welcome-message").textContent = `Welcome, ${user.email}!`;
    }
    */
    //*****************************************************************************************/
    //clear local storage when going to homepage(sign out)
    const homepageBtn = document.getElementById("homepage-btn");
    if (homepageBtn) {
        homepageBtn.addEventListener("click", function () {
            localStorage.removeItem("user");
            window.location.href = "homepage.html";
        });
    }
    //*********************************************************************************************/
    // Customer page-specific functionality
    if (currentPage === "customer.html") {
        // Fetch and display catering companies
        async function getCateringCompanies() {
            try {
                const response = await fetch("/companies");
                if (response.ok) {
                    const companies = await response.json();
                    const companySelect = document.getElementById("company-name");
                    companies.forEach(company => {
                        const option = document.createElement("option");
                        option.value = company.ServiceName;
                        option.textContent = company.ServiceName;
                        companySelect.appendChild(option);
                    });
                } else {
                    alert("Failed to fetch companies.");
                }
            } 
            catch (error) {
                console.error("Error:", error);
                alert("Network error.");
            }
        }

        // Show price when a company is selected
        async function showPrice(event) {
            const selectedCompany = event.target.value;
            if (!selectedCompany) return;

            try {
                const response = await fetch(`/api/services/:serviceId`);
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById("price").textContent = `$${data.price}`;
                } else {
                    alert("Failed to fetch price.");
                }
            } 
            catch (error) {
                console.error("Error fetching price:", error);
                alert("Network error.");
            }
        }

        // Handle booking confirmation
        async function confirmBooking(event) {
            event.preventDefault();
            const companyName = document.getElementById("company-name").value;
            const description = document.getElementById("service-description").value;
            const paymentMethod = document.getElementById("payment-method").value;
            const price = document.getElementById("price").textContent.replace("$", "");

            if (!companyName || !description || !paymentMethod || !price) {
                alert("All fields are required.");
                return;
            }

            const bookingData = {
                companyName,
                description,
                paymentMethod,
                price,
            };

            try {
                const response = await fetch("", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bookingData),
                });
                if (response.ok) {
                    alert("Booking confirmed!");
                    document.getElementById("booking-form-details").reset();
                    document.getElementById("price").textContent = "";
                } else {
                    const error = await response.json();
                    alert("Error confirming booking: " + error.message);
                }
            } 
            catch (error) {
                console.error("Error", error);
                alert("Network error.");
            }
        }

        const companySelect = document.getElementById("company-name");
        if (companySelect) {
            companySelect.addEventListener("change", showPrice);
        }

        const confirmBookingBtn = document.getElementById("confirm-booking-btn");
        if (confirmBookingBtn) {
            confirmBookingBtn.addEventListener("click", confirmBooking);
        }

        // Initialize customer page
        getCateringCompanies();
    }
    //*******************************************************************************************/
    const gotoReviewBtn = document.getElementById("go-to-review-btn");
    if (gotoReviewBtn) {
        gotoReviewBtn.addEventListener("click", function() {
            window.location.href = "review.html";
        });
    }
    //******************************************************************************************/
    // Review page-specific functionality
    if (currentPage === "review.html") {

        // Fetch the booked services for the user
        async function getBookedServices() {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                alert("You must be signed in to leave a review.");
                window.location.href = "customer_sign_in.html";
                return;
            }

            try {
                const response = await fetch(``);
                if (response.ok) {
                    const services = await response.json();
                    const serviceList = document.getElementById("service-list");

                    services.forEach(service => {
                        const serviceItem = document.createElement("div");
                        serviceItem.classList.add("service-item");
                        serviceItem.innerHTML = `
                            <p><strong>${service.companyName}</strong></p>
                            <p>Description: ${service.description}</p>
                            <p>Price: $${service.price}</p>
                            <div id="review-${service.id}">
                                ${service.review ? 
                                    `<p>Rating: ${service.review.rating} / 5</p>
                                     <p>Review: ${service.review.description}</p>` : 
                                    `<button class="leave-review-btn" data-service-id="${service.id}">Leave a Review</button>`
                                }
                            </div>
                        `;
                        serviceList.appendChild(serviceItem);

                        // If review button exists, attach click event to open the review form
                        const reviewBtn = serviceItem.querySelector(".leave-review-btn");
                        if (reviewBtn) {
                            reviewBtn.addEventListener("click", () => openReviewForm(service));
                        }
                    });
                } else {
                    alert("Failed to fetch booked services.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Network error.");
            }
        }

        // Open the review form for a specific service
        function openReviewForm(service) {
            document.getElementById("review-form").style.display = "block";

            const submitBtn = document.getElementById("submit-review-btn");
            submitBtn.onclick = function(event) {
                event.preventDefault();

                const rating = document.getElementById("rating").value;
                const description = document.getElementById("review-description").value;

                if (!rating || !description) {
                    alert("All fields are required.");
                    return;
                }

                // Send review data to the backend
                submitReview(service.id, rating, description);
            };
        }

        // Submit the review to the backend
        async function submitReview(serviceId, rating, description) {
            const user = JSON.parse(localStorage.getItem("user"));
            const reviewData = {
                userId: user.id,
                serviceId: serviceId,
                rating: rating,
                description: description
            };

            try {
                const response = await fetch("", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reviewData)
                });

                if (response.ok) {
                    alert("Review submitted successfully!");
                    document.getElementById("review-form").reset();
                    document.getElementById("review-form").style.display = "none";
                    getBookedServices(); // Reload services to update the review status
                } else {
                    const error = await response.json();
                    alert("Error submitting review: " + error.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Network error.");
            }
        }

        // Initialize review page
        getBookedServices();
    }
    //******************************************************************************************/
    const gotoBookingBtn = document.getElementById("go-to-customer-btn");
    if (gotoBookingBtn) {
        gotoBookingBtn.addEventListener("click", function() {
            window.location.href = "customer.html";
        });
    }
    //********************************************************************************************/
    //add company
    async function addCompany(event) {
        event.preventDefault();
        
        const companyData = {
            companyName: document.getElementById("add_company_name").value,
            contactName: document.getElementById("add_contact_name").value,
            contactEmail: document.getElementById("add_contact_email").value,
            contactPhone: document.getElementById("add_contact_phone").value,
            address: document.getElementById("add_address").value,
        };

        try {
            const response = await fetch("/companies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(companyData),
            });
    
            if (response.ok) {
                alert("Company added.");
                document.getElementById("add-company-form").reset();
            } else {
                const error = await response.json();
                alert("Error adding company: " + error.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error.");
        }
    }
    const addCompanyBtn = document.getElementById("add-company-btn");
    if (addCompanyBtn) {
        addCompanyBtn.addEventListener("click", addCompany);
    }
    //***************************************************************************************************/
    //delete company
    async function deleteCompany(event) {
        event.preventDefault();
    
        const deleteData = {
            companyName: document.getElementById("delete-company-name").value,
            address: document.getElementById("delete-address").value,
        };
    
        try {
            const response = await fetch("/companies/:companyId", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteData),
            });
    
            if (response.ok) {
                alert("Company deleted.");
                document.getElementById("delete-company-form").reset();
            } else {
                const error = await response.json();
                alert("Error deleting company: " + error.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error.");
        }
    }
    const deleteCompanyBtn = document.getElementById("delete-company-btn");
    if (deleteCompanyBtn) {
        deleteCompanyBtn.addEventListener("click", deleteCompany);
    }
    //**********************************************************************************/
});