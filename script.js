document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.getAttribute("data-page");

    // تحميل المحتوى بناءً على الصفحة
    if (page === "home") {
        loadReviews();
        setupLoginForm(); // إضافة هذا السطر لتهيئة نموذج تسجيل الدخول
    } else if (page === "add-review") {
        setupReviewForm();
    } else if (page === "register") {
        setupRegistrationForm();
    } else if (page === "profile") {
        loadUserProfile();
    } else if (page === "reviews") {
        setupSearchFunctionality();
    } else if (page === "contact") {
        setupContactForm();
    }

    // إضافة أيقونة التواصل معنا
    addContactIcon();

    // تحسين الروابط
    setupNavigation();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const href = this.getAttribute("href");
            window.location.href = href;
        });
    });
}

function setupLoginForm() {
    const loginForm = document.querySelector("#login-form");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("يرجى إدخال اسم المستخدم وكلمة المرور.");
            return;
        }

        const storedUserData = JSON.parse(localStorage.getItem(username));
        if (storedUserData && storedUserData.password === password) {
            alert("تم تسجيل الدخول بنجاح!");
            localStorage.setItem("currentUser", username);
            window.location.href = "profile.html";
        } else {
            alert("اسم المستخدم أو كلمة المرور غير صحيحة.");
        }
    });
}

function setupRegistrationForm() {
    const registrationForm = document.querySelector("form");
    if (!registrationForm) return;

    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (!username || !email || !password || !confirmPassword) {
            alert("يرجى ملء جميع الحقول.");
            return;
        }

        if (password !== confirmPassword) {
            alert("كلمتا المرور غير متطابقتين.");
            return;
        }

        if (localStorage.getItem(username)) {
            alert("اسم المستخدم مسجل بالفعل، يرجى اختيار اسم آخر.");
            return;
        }

        localStorage.setItem(username, JSON.stringify({ email, password }));
        alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
        window.location.href = "home.html";
    });
}

function setupReviewForm() {
    const reviewForm = document.querySelector("form");
    if (!reviewForm) return;

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const review = document.getElementById("review").value.trim();
        const currentUser = localStorage.getItem("currentUser");

        if (!title || !review) {
            alert("يرجى إدخال عنوان الكتاب ونص المراجعة.");
            return;
        }

        if (!currentUser) {
            alert("يجب تسجيل الدخول لإضافة مراجعة.");
            window.location.href = "home.html";
            return;
        }

        const currentDate = new Date().toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' });
        const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.push({ title, content: review, date: currentDate, username: currentUser });
        localStorage.setItem("reviews", JSON.stringify(reviews));

        alert("تم إضافة المراجعة بنجاح!");
        reviewForm.reset();
        window.location.href = "reviews.html";
    });
}

function loadReviews() {
    const reviewsContainer = document.getElementById("latest-reviews");
    if (!reviewsContainer) return;

    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviewsContainer.innerHTML = reviews.length === 0 
        ? "<p>لا توجد مراجعات حتى الآن.</p>"
        : reviews.slice(-5).reverse().map(review => `
            <div class="review">
                <h3>${review.title}</h3>
                <p>${review.content}</p>
                <p><strong>تاريخ المراجعة:</strong> ${review.date || "تاريخ غير متوفر"}</p>
                <hr>
            </div>
        `).join("");
}

function setupReviewForm() {
    const reviewForm = document.querySelector("form");
    if (!reviewForm) return;

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const review = document.getElementById("review").value.trim();
        const currentUser = localStorage.getItem("currentUser");

        if (!title || !review) {
            alert("يرجى إدخال عنوان الكتاب ونص المراجعة.");
            return;
        }

        if (!currentUser) {
            alert("يجب تسجيل الدخول لإضافة مراجعة.");
            window.location.href = "home.html";
            return;
        }

        const currentDate = new Date().toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' });
        const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.push({ title, content: review, date: currentDate, username: currentUser });
        localStorage.setItem("reviews", JSON.stringify(reviews));

        alert("تم إضافة المراجعة بنجاح!");
        reviewForm.reset();
        window.location.href = "reviews.html";
    });
}

function loadUserProfile() {
    const username = localStorage.getItem("currentUser");
    if (!username) {
        alert("لم تقم بتسجيل الدخول بعد.");
        window.location.href = "home.html";
        return;
    }

    const userData = JSON.parse(localStorage.getItem(username));
    document.getElementById("username").textContent = username;
    document.getElementById("email").textContent = userData.email;

    // عرض مراجعات المستخدم
    const reviewsContainer = document.getElementById("reviews-container");
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const userReviews = reviews.filter(review => review.username === username);

    reviewsContainer.innerHTML = userReviews.length === 0 
        ? "<p>لا توجد مراجعات لعرضها.</p>"
        : userReviews.map((review, index) => `
            <div class="review" data-index="${index}">
                <h3>${review.title}</h3>
                <p>${review.content}</p>
                <p><strong>تاريخ المراجعة:</strong> ${review.date || "تاريخ غير متوفر"}</p>
                <button class="edit-button" onclick="editReview(${index})">تعديل</button>
                <button class="delete-button" onclick="deleteReview(${index})">حذف</button>
                <hr>
            </div>
        `).join("");
}

function editReview(index) {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const reviewToEdit = reviews[index];
    const newTitle = prompt("أدخل عنوان الكتاب الجديد:", reviewToEdit.title);
    const newContent = prompt("أدخل نص المراجعة الجديد:", reviewToEdit.content);

    if (newTitle && newContent) {
        reviewToEdit.title = newTitle;
        reviewToEdit.content = newContent;
        localStorage.setItem("reviews", JSON.stringify(reviews));
        loadUserProfile(); // لإعادة تحميل المراجعات مع التحديث
    }
}

function deleteReview(index) {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.splice(index, 1); // إزالة المراجعة من المصفوفة
    localStorage.setItem("reviews", JSON.stringify(reviews));
    loadUserProfile(); // لإعادة تحميل المراجعات بعد الحذف
}


function addContactIcon() {
    const contactIcon = document.createElement("div");
    contactIcon.innerHTML = '<a href="contactUS.html">📩 تواصل معنا</a>';
    contactIcon.style.position = "fixed";
    contactIcon.style.bottom = "20px";
    contactIcon.style.right = "20px";
    document.body.appendChild(contactIcon);
}

function setupSearchFunctionality() {
    const searchForm = document.querySelector("#search-form");
    if (!searchForm) return;

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const query = document.getElementById("search").value.trim().toLowerCase();
        const reviewsContainer = document.getElementById("reviews-container");

        if (!query) {
            alert("يرجى إدخال عنوان للبحث.");
            return;
        }

        const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        const filteredReviews = reviews.filter(review => review.title.toLowerCase().includes(query));

        reviewsContainer.innerHTML = filteredReviews.length === 0 
            ? "<p>لم يتم العثور على مراجعات لهذا العنوان.</p>"
            : filteredReviews.map(review => `
                <div class="review">
                    <h3>${review.title}</h3>
                    <p>${review.content}</p>
                    <p><strong>تاريخ المراجعة:</strong> ${review.date || "تاريخ غير متوفر"}</p>
                    <hr>
                </div>
            `).join("");
    });
}