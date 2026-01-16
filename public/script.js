let currentSlide = 0;
let currentLang = "ko";
let currentCityCode = "seoul";
let map;
let mapMarker;
let authToken = null;
let currentUser = null;

const translations = {
    ko: {
        ui: {
            registerUser: "일반 회원가입",
            registerOwner: "카페 사장님 회원가입",
            login: "로그인",
            quickTitle: "빠른 예약",
            quickText: "회원가입 후 바로 예약 가능!",
            citySelectTitle: "도시 선택",
            selectedCityPrefix: "선택된 도시: ",
            adTitle: "특별 할인 이벤트!",
            adText: "첫 예약 시 20% 할인",
            adButton: "자세히 보기",
            recommendTitle: "추천 지역"
        },
        cities: {
            seoul: "서울",
            busan: "부산",
            incheon: "인천",
            daegu: "대구",
            daejeon: "대전",
            gwangju: "광주",
            ulsan: "울산",
            jeju: "제주",
            suwon: "수원",
            seongnam: "성남",
            goyang: "고양",
            yongin: "용인",
            changwon: "창원",
            cheongju: "청주",
            jeonju: "전주",
            pohang: "포항",
            gumi: "구미"
        },
        recommendations: {
            seoul: "서울에서는 강남, 홍대, 이태원 주변 카페를 추천합니다.",
            busan: "부산에서는 해운대와 광안리 바다뷰 카페를 추천합니다.",
            incheon: "인천에서는 송도 국제도시 카페 거리를 추천합니다.",
            daegu: "대구에서는 동성로와 앞산 인근 카페를 방문해 보세요.",
            daejeon: "대전에서는 둔산동과 은행동 주변 카페가 인기입니다.",
            gwangju: "광주에서는 충장로와 상무지구 카페를 추천합니다.",
            ulsan: "울산에서는 태화강과 산업단지 인근 카페를 즐겨보세요.",
            jeju: "제주에서는 해안도로 뷰 카페와 협재 해변 인근을 추천합니다.",
            suwon: "수원에서는 화성 근처 분위기 좋은 카페를 추천합니다.",
            seongnam: "성남에서는 분당 정자동과 판교 카페 거리가 인기입니다.",
            goyang: "고양에서는 일산 호수공원 주변 카페가 좋습니다.",
            yongin: "용인에서는 에버랜드 인근과 동백지구 카페를 추천합니다.",
            changwon: "창원에서는 상남동과 중앙동 카페 거리를 즐겨보세요.",
            cheongju: "청주에서는 성안길과 지웰시티 주변 카페를 추천합니다.",
            jeonju: "전주에서는 한옥마을 전통 카페를 꼭 방문해 보세요.",
            pohang: "포항에서는 영일대 해수욕장 주변 카페를 추천합니다.",
            gumi: "구미에서는 금오산과 공단 인근 카페를 방문해 보세요."
        }
    },
    en: {
        ui: {
            registerUser: "Sign up (Guest)",
            registerOwner: "Sign up (Cafe owner)",
            login: "Login",
            quickTitle: "Quick booking",
            quickText: "Register and book a table instantly.",
            citySelectTitle: "Choose city",
            selectedCityPrefix: "Selected city: ",
            adTitle: "Special discount!",
            adText: "20% off on your first booking.",
            adButton: "Learn more",
            recommendTitle: "Recommendations"
        },
        cities: {
            seoul: "Seoul",
            busan: "Busan",
            incheon: "Incheon",
            daegu: "Daegu",
            daejeon: "Daejeon",
            gwangju: "Gwangju",
            ulsan: "Ulsan",
            jeju: "Jeju",
            suwon: "Suwon",
            seongnam: "Seongnam",
            goyang: "Goyang",
            yongin: "Yongin",
            changwon: "Changwon",
            cheongju: "Cheongju",
            jeonju: "Jeonju",
            pohang: "Pohang",
            gumi: "Gumi"
        },
        recommendations: {
            seoul: "Seoul: try cafes in Gangnam, Hongdae and Itaewon.",
            busan: "Busan: visit seaside cafes near Haeundae and Gwangalli.",
            incheon: "Incheon: Songdo international district has many modern cafes.",
            daegu: "Daegu: explore cafes around Dongseongno and Apsan.",
            daejeon: "Daejeon: cafes in Dunsan and Eunhaeng-dong are popular.",
            gwangju: "Gwangju: try cafes around Chungjang-ro and Sangmu district.",
            ulsan: "Ulsan: enjoy cafes near Taehwagang and industrial area.",
            jeju: "Jeju: coastal view cafes and Hyupjae area are recommended.",
            suwon: "Suwon: visit cozy cafes near Hwaseong Fortress.",
            seongnam: "Seongnam: Bundang Jeongja and Pangyo have great cafe streets.",
            goyang: "Goyang: enjoy cafes around Ilsan Lake Park.",
            yongin: "Yongin: cafes near Everland and Dongbaek are popular.",
            changwon: "Changwon: try cafes in Sangnam-dong and Jungang-dong.",
            cheongju: "Cheongju: cafes near Seongan-gil and Gwell City are nice.",
            jeonju: "Jeonju: visit traditional cafes in Hanok Village.",
            pohang: "Pohang: beach cafes near Yeongildae Beach are recommended.",
            gumi: "Gumi: explore cafes near Geumosan and industrial complexes."
        }
    },
    ru: {
        ui: {
            registerUser: "Регистрация гостя",
            registerOwner: "Регистрация владельца кафе",
            login: "Войти",
            quickTitle: "Быстрое бронирование",
            quickText: "После регистрации можно сразу бронировать столики.",
            citySelectTitle: "Выбор города",
            selectedCityPrefix: "Выбранный город: ",
            adTitle: "Специальная скидка!",
            adText: "20% скидка на первую бронь.",
            adButton: "Подробнее",
            recommendTitle: "Рекомендации по городу"
        },
        cities: {
            seoul: "Сеул",
            busan: "Пусан",
            incheon: "Инчхон",
            daegu: "Тэгу",
            daejeon: "Тэджон",
            gwangju: "Гванчжу",
            ulsan: "Ульсан",
            jeju: "Чеджу",
            suwon: "Сувон",
            seongnam: "Соннам",
            goyang: "Коян",
            yongin: "Ёнин",
            changwon: "Чханвон",
            cheongju: "Чхонджу",
            jeonju: "Чонджу",
            pohang: "Пхохан",
            gumi: "Куми"
        },
        recommendations: {
            seoul: "Сеул: рекомендуем кафе в районах Каннам, Хонде и Итхэвон.",
            busan: "Пусан: отличные кафе с видом на море в Хэундэ и Кваналли.",
            incheon: "Инчхон: много современных кафе в районе Сондо.",
            daegu: "Тэгу: обратите внимание на кафе возле Донсонно и Апсан.",
            daejeon: "Тэджон: популярны кафе в районах Тунсан и Ынхэн-дон.",
            gwangju: "Гванчжу: рекомендуем кафе на Чхунджанно и в районе Санму.",
            ulsan: "Ульсан: интересные кафе вдоль реки Тэхваган и у промзоны.",
            jeju: "Чеджу: отличные кафе с видом на море вдоль побережья и у пляжа Хёпче.",
            suwon: "Сувон: уютные кафе рядом с крепостью Хвасон.",
            seongnam: "Соннам: популярны кафе в Пундоне (Чонча) и Пангьо.",
            goyang: "Коян: хорошие кафе у парка Ильсан-Хосу.",
            yongin: "Ёнин: рекомендуем кафе около Эверленда и района Тонбэк.",
            changwon: "Чханвон: много кафе в районах Саннам-дон и Чунан-дон.",
            cheongju: "Чхонджу: обратите внимание на кафе у Сонан-гиль и Gwell City.",
            jeonju: "Чонджу: обязательно зайдите в традиционные кафе в ханок-деревне.",
            pohang: "Пхохан: рекомендуем кафе у пляжа Ёнгильдэ.",
            gumi: "Куми: интересные кафе у горы Кумосан и возле промзоны."
        }
    }
};

function setAuth(token, user) {
    authToken = token;
    currentUser = user;
    if (token) {
        localStorage.setItem("kafe_token", token);
        localStorage.setItem("kafe_user", JSON.stringify(user));
    } else {
        localStorage.removeItem("kafe_token");
        localStorage.removeItem("kafe_user");
    }
    renderProfile();
}

function loadAuthFromStorage() {
    const token = localStorage.getItem("kafe_token");
    const userStr = localStorage.getItem("kafe_user");
    if (!token || !userStr) {
        authToken = null;
        currentUser = null;
        return;
    }
    try {
        const user = JSON.parse(userStr);
        authToken = token;
        currentUser = user;
    } catch (e) {
        authToken = null;
        currentUser = null;
    }
}

async function refreshProfileFromBackend() {
    if (!authToken) {
        return;
    }
    try {
        const res = await fetch("/api/profile/me", {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        if (data && data.user) {
            setAuth(authToken, data.user);
        }
    } catch (e) {
    }
}

async function initAds() {
    const adBanner = document.querySelector(".ad-banner");
    if (!adBanner) {
        return;
    }
    try {
        const headers = {};
        if (authToken) {
            headers.Authorization = "Bearer " + authToken;
        }
        const res = await fetch("/api/ads/config", { headers });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        if (!data || data.showAds === false) {
            adBanner.classList.add("hidden");
            return;
        }
        if (data.provider === "adsense" && data.adsenseClientId && data.adsenseSlotId) {
            adBanner.innerHTML = "";
            const ins = document.createElement("ins");
            ins.className = "adsbygoogle";
            ins.style.display = "block";
            ins.setAttribute("data-ad-client", data.adsenseClientId);
            ins.setAttribute("data-ad-slot", data.adsenseSlotId);
            ins.setAttribute("data-ad-format", "auto");
            ins.setAttribute("data-full-width-responsive", "true");
            adBanner.appendChild(ins);
            if (!window.adsbygoogle) {
                const s = document.createElement("script");
                s.async = true;
                s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(data.adsenseClientId);
                s.crossOrigin = "anonymous";
                document.head.appendChild(s);
                s.onload = () => {
                    try {
                        window.adsbygoogle = window.adsbygoogle || [];
                        window.adsbygoogle.push({});
                    } catch (e) {}
                };
            } else {
                try {
                    window.adsbygoogle = window.adsbygoogle || [];
                    window.adsbygoogle.push({});
                } catch (e) {}
            }
            return;
        }
        if (data.provider === "kakao" && data.kakaoUnitId && data.kakaoScriptUrl) {
            adBanner.innerHTML = "";
            const container = document.createElement("div");
            container.id = data.kakaoUnitId;
            adBanner.appendChild(container);
            const s = document.createElement("script");
            s.async = true;
            s.src = data.kakaoScriptUrl;
            document.head.appendChild(s);
            return;
        }
        if (data.provider === "naver" && data.naverUnitId && data.naverScriptUrl) {
            adBanner.innerHTML = "";
            const container = document.createElement("div");
            container.id = data.naverUnitId;
            adBanner.appendChild(container);
            const s = document.createElement("script");
            s.async = true;
            s.src = data.naverScriptUrl;
            document.head.appendChild(s);
            return;
        }
    } catch (e) {
    }
}

async function handleTossSuccess() {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amountStr = params.get("amount");
    const amount = amountStr ? Number(amountStr) : NaN;
    if (!paymentKey || !orderId || !amountStr || !Number.isFinite(amount)) {
        alert(currentLang === "ru" ? "Некорректные данные оплаты" :
            currentLang === "en" ? "Invalid payment data" : "잘못된 결제 정보입니다.");
        window.location.href = "/";
        return;
    }
    loadAuthFromStorage();
    if (!authToken) {
        alert(currentLang === "ru" ? "Сначала войдите в аккаунт и повторите оплату" :
            currentLang === "en" ? "Please login and try the payment again" : "로그인 후 다시 결제해 주세요.");
        window.location.href = "/";
        return;
    }
    try {
        const res = await fetch("/api/payments/toss/confirm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount
            })
        });
        if (!res.ok) {
            alert(currentLang === "ru" ? "Не удалось подтвердить оплату" :
                currentLang === "en" ? "Failed to confirm payment" : "결제 확인에 실패했습니다.");
            window.location.href = "/";
            return;
        }
        alert(currentLang === "ru" ? "Оплата успешно подтверждена." :
            currentLang === "en" ? "Payment confirmed successfully." : "결제가 완료되었습니다.");
        window.location.href = "/";
    } catch (e) {
        alert(currentLang === "ru" ? "Сетевая ошибка при подтверждении оплаты" :
            currentLang === "en" ? "Network error while confirming payment" : "결제 확인 중 네트워크 오류가 발생했습니다.");
        window.location.href = "/";
    }
}

function handleTossFail() {
    alert(currentLang === "ru" ? "Оплата отклонена или отменена." :
        currentLang === "en" ? "Payment was declined or cancelled." : "결제가 거절되었거나 취소되었습니다.");
    window.location.href = "/";
}

function renderProfile() {
    const statusEl = document.getElementById("profileStatus");
    const btnBecomeOwner = document.getElementById("btnBecomeOwner");
    const btnClientPremium = document.getElementById("btnClientPremium");
    const btnCoffeePremium = document.getElementById("btnCoffeePremium");
    const btnInvestPremium = document.getElementById("btnInvestPremium");
    const ownerPanel = document.getElementById("ownerPanel");
    if (!statusEl) {
        return;
    }
    if (!currentUser) {
        statusEl.textContent = currentLang === "ru" ? "Вы не авторизованы." :
            currentLang === "en" ? "You are not logged in." : "로그인하지 않았습니다.";
        if (btnBecomeOwner) btnBecomeOwner.classList.add("hidden");
        if (btnClientPremium) btnClientPremium.classList.add("hidden");
        if (btnCoffeePremium) btnCoffeePremium.classList.add("hidden");
        if (btnInvestPremium) btnInvestPremium.classList.add("hidden");
        if (ownerPanel) ownerPanel.classList.add("hidden");
        return;
    }
    const plan = currentUser.subscriptionPlan || "none";
    const role = currentUser.role || "user";
    let planText = "";
    if (plan === "client") {
        planText = currentLang === "ru" ? "Клиентский премиум (2000₩)" :
            currentLang === "en" ? "Client premium (2000₩)" : "클라이언트 프리미엄 (2000₩)";
    } else if (plan === "coffee") {
        planText = currentLang === "ru" ? "Coffee Premium (25000₩)" :
            currentLang === "en" ? "Coffee Premium (25000₩)" : "커피 프리미엄 (25000₩)";
    } else if (plan === "invest") {
        planText = currentLang === "ru" ? "Invest Premium" :
            currentLang === "en" ? "Invest Premium" : "인베스트 프리미엄";
    } else {
        planText = currentLang === "ru" ? "Без премиума" :
            currentLang === "en" ? "No premium" : "프리미엄 없음";
    }
    const name = currentUser.name || "";
    if (currentLang === "ru") {
        statusEl.textContent = "Привет, " + name + ". Роль: " + role + ". Тариф: " + planText + ".";
    } else if (currentLang === "en") {
        statusEl.textContent = "Hello, " + name + ". Role: " + role + ". Plan: " + planText + ".";
    } else {
        statusEl.textContent = "안녕하세요, " + name + "님. 역할: " + role + ", 요금제: " + planText + ".";
    }
    if (btnBecomeOwner) {
        if (role === "owner") {
            btnBecomeOwner.classList.add("hidden");
        } else {
            btnBecomeOwner.classList.remove("hidden");
        }
    }
    if (btnClientPremium) {
        if (plan === "client" || plan === "coffee" || plan === "invest") {
            btnClientPremium.classList.add("hidden");
        } else {
            btnClientPremium.classList.remove("hidden");
        }
    }
    if (btnCoffeePremium) {
        if (plan === "coffee" || plan === "invest") {
            btnCoffeePremium.classList.add("hidden");
        } else {
            btnCoffeePremium.classList.remove("hidden");
        }
    }
    if (btnInvestPremium) {
        if (currentUser.isInvestor) {
            btnInvestPremium.classList.add("hidden");
        } else {
            btnInvestPremium.classList.remove("hidden");
        }
    }
    if (ownerPanel) {
        if (role === "owner") {
            ownerPanel.classList.remove("hidden");
        } else {
            ownerPanel.classList.add("hidden");
        }
    }
}

const cityCenters = {
    seoul: { lat: 37.5665, lng: 126.9780 },
    busan: { lat: 35.1796, lng: 129.0756 },
    incheon: { lat: 37.4563, lng: 126.7052 },
    daegu: { lat: 35.8714, lng: 128.6014 },
    daejeon: { lat: 36.3504, lng: 127.3845 },
    gwangju: { lat: 35.1595, lng: 126.8526 },
    ulsan: { lat: 35.5384, lng: 129.3114 },
    jeju: { lat: 33.4996, lng: 126.5312 },
    suwon: { lat: 37.2636, lng: 127.0286 },
    seongnam: { lat: 37.4449, lng: 127.1389 },
    goyang: { lat: 37.6584, lng: 126.8320 },
    yongin: { lat: 37.2411, lng: 127.1776 },
    changwon: { lat: 35.2280, lng: 128.6811 },
    cheongju: { lat: 36.6424, lng: 127.4890 },
    jeonju: { lat: 35.8242, lng: 127.1480 },
    pohang: { lat: 36.0190, lng: 129.3435 },
    gumi: { lat: 36.1195, lng: 128.3442 }
};

function showSlide(index) {
    const slides = document.querySelectorAll(".slide");
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentSlide);
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

setInterval(() => {
    nextSlide();
}, 5000);

function showRegisterModal(type) {
    const modal = document.getElementById("registerModal");
    const userTypeInput = document.getElementById("userType");
    const title = document.getElementById("modalTitle");
    if (!modal || !userTypeInput || !title) return;
    userTypeInput.value = type;
    if (currentLang === "ko") {
        title.textContent = type === "owner" ? "카페 사장님 회원가입" : "일반 회원가입";
    } else if (currentLang === "en") {
        title.textContent = type === "owner" ? "Sign up (Cafe owner)" : "Sign up (Guest)";
    } else {
        title.textContent = type === "owner" ? "Регистрация владельца кафе" : "Регистрация гостя";
    }
    modal.style.display = "block";
}

function showLoginModal() {
    const modal = document.getElementById("loginModal");
    if (!modal) return;
    modal.style.display = "block";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = "none";
}

window.onclick = function (event) {
    const registerModal = document.getElementById("registerModal");
    const loginModal = document.getElementById("loginModal");
    if (event.target === registerModal) {
        registerModal.style.display = "none";
    }
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
};

function showCafeDetail(id) {
    alert("Здесь позже будет детальная страница кафе ID: " + id);
}

function applyLanguage(lang) {
    const config = translations[lang];
    if (!config) return;
    currentLang = lang;

    const btnUser = document.getElementById("btnRegisterUser");
    const btnOwner = document.getElementById("btnRegisterOwner");
    const btnLogin = document.getElementById("btnLogin");
    const quickTitle = document.getElementById("quickTitle");
    const quickText = document.getElementById("quickText");
    const citySelectTitle = document.getElementById("citySelectTitle");
    const selectedCityTitle = document.getElementById("selectedCityTitle");
    const recommendTitle = document.getElementById("recommendTitle");
    const recommendText = document.getElementById("recommendText");
    const adTitle = document.getElementById("adTitle");
    const adText = document.getElementById("adText");
    const adButton = document.getElementById("adButton");

    if (btnUser) btnUser.textContent = config.ui.registerUser;
    if (btnOwner) btnOwner.textContent = config.ui.registerOwner;
    if (btnLogin) btnLogin.textContent = config.ui.login;
    if (quickTitle) quickTitle.textContent = config.ui.quickTitle;
    if (quickText) quickText.textContent = config.ui.quickText;
    if (citySelectTitle) citySelectTitle.textContent = config.ui.citySelectTitle;
    if (adTitle) adTitle.textContent = config.ui.adTitle;
    if (adText) adText.textContent = config.ui.adText;
    if (adButton) adButton.textContent = config.ui.adButton;
    if (recommendTitle) recommendTitle.textContent = config.ui.recommendTitle;

    const cityButtons = document.querySelectorAll(".city-btn");
    cityButtons.forEach((btn) => {
        const code = btn.getAttribute("data-city");
        const name = config.cities[code];
        if (name) {
            btn.textContent = name;
        }
    });

    const cityName = config.cities[currentCityCode] || "";
    if (selectedCityTitle) {
        selectedCityTitle.textContent = config.ui.selectedCityPrefix + cityName;
    }

    if (recommendText && config.recommendations) {
        const rec = config.recommendations[currentCityCode];
        if (rec) {
            recommendText.textContent = rec;
        }
    }

    const langButtons = document.querySelectorAll(".lang-btn");
    langButtons.forEach((b) => {
        const langCode = b.getAttribute("data-lang");
        b.classList.toggle("active", langCode === lang);
    });

    renderProfile();
}

function initKakaoMap(cityCode) {
    const container = document.getElementById("map");
    if (!container) return;
    if (!window.kakao || !kakao.maps) return;

    const centerInfo = cityCenters[cityCode] || cityCenters.seoul;
    const center = new kakao.maps.LatLng(centerInfo.lat, centerInfo.lng);
    const options = {
        center,
        level: 5
    };

    if (!map) {
        map = new kakao.maps.Map(container, options);
        mapMarker = new kakao.maps.Marker({
            position: center
        });
        mapMarker.setMap(map);
    } else {
        map.setCenter(center);
        if (mapMarker) {
            mapMarker.setPosition(center);
        }
    }
}

async function loadOwnerCafes() {
    const listEl = document.getElementById("ownerCafesList");
    if (!listEl || !authToken) {
        return;
    }
    try {
        const res = await fetch("/api/my/cafes", {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const cafes = data && data.cafes ? data.cafes : [];
        listEl.innerHTML = "";
        cafes.forEach((cafe) => {
            const div = document.createElement("div");
            div.className = "owner-cafe-item";
            div.textContent = cafe.name + " (" + cafe.cityCode + ")";
            listEl.appendChild(div);
        });
    } catch (e) {
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showSlide(0);
    loadAuthFromStorage();

    const pathName = window.location.pathname;
    if (pathName === "/payments/toss/success") {
        handleTossSuccess();
        return;
    }
    if (pathName === "/payments/toss/fail") {
        handleTossFail();
        return;
    }

    const cityButtons = document.querySelectorAll(".city-btn");
    cityButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            cityButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const code = btn.getAttribute("data-city");
            currentCityCode = code || "seoul";
            applyLanguage(currentLang);
            initKakaoMap(currentCityCode);
        });
    });

    const langButtons = document.querySelectorAll(".lang-btn");
    langButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const lang = btn.getAttribute("data-lang") || "ko";
            applyLanguage(lang);
        });
    });

    const btnRegisterUser = document.getElementById("btnRegisterUser");
    if (btnRegisterUser) {
        btnRegisterUser.addEventListener("click", () => {
            showRegisterModal("user");
        });
    }

    const btnRegisterOwner = document.getElementById("btnRegisterOwner");
    if (btnRegisterOwner) {
        btnRegisterOwner.addEventListener("click", () => {
            showRegisterModal("owner");
        });
    }

    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) {
        btnLogin.addEventListener("click", () => {
            showLoginModal();
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("registerName");
            const phoneInput = document.getElementById("registerPhone");
            const passwordInput = document.getElementById("registerPassword");
            const passwordConfirmInput = document.getElementById("registerPasswordConfirm");
            const userTypeInput = document.getElementById("userType");
            if (!nameInput || !phoneInput || !passwordInput || !passwordConfirmInput || !userTypeInput) {
                return;
            }
            if (passwordInput.value !== passwordConfirmInput.value) {
                alert(currentLang === "ru" ? "Пароли не совпадают" :
                    currentLang === "en" ? "Passwords do not match" : "비밀번호가 일치하지 않습니다.");
                return;
            }
            try {
                const res = await fetch("/api/auth/register-phone", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone: phoneInput.value,
                        password: passwordInput.value,
                        name: nameInput.value,
                        role: userTypeInput.value
                    })
                });
                if (!res.ok) {
                    alert(currentLang === "ru" ? "Ошибка регистрации" :
                        currentLang === "en" ? "Registration failed" : "회원가입 실패");
                    return;
                }
                const data = await res.json();
                if (data && data.token && data.user) {
                    setAuth(data.token, data.user);
                    closeModal("registerModal");
                }
            } catch (e) {
                alert(currentLang === "ru" ? "Сетевая ошибка" :
                    currentLang === "en" ? "Network error" : "네트워크 오류");
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const phoneInput = document.getElementById("loginPhone");
            const passwordInput = document.getElementById("loginPassword");
            if (!phoneInput || !passwordInput) {
                return;
            }
            try {
                const res = await fetch("/api/auth/login-phone", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone: phoneInput.value,
                        password: passwordInput.value
                    })
                });
                if (!res.ok) {
                    alert(currentLang === "ru" ? "Ошибка входа" :
                        currentLang === "en" ? "Login failed" : "로그인 실패");
                    return;
                }
                const data = await res.json();
                if (data && data.token && data.user) {
                    setAuth(data.token, data.user);
                    closeModal("loginModal");
                }
            } catch (e) {
                alert(currentLang === "ru" ? "Сетевая ошибка" :
                    currentLang === "en" ? "Network error" : "네트워크 오류");
            }
        });
    }

    const btnBecomeOwner = document.getElementById("btnBecomeOwner");
    if (btnBecomeOwner) {
        btnBecomeOwner.addEventListener("click", async () => {
            if (!authToken) {
                alert(currentLang === "ru" ? "Сначала войдите" :
                    currentLang === "en" ? "Please login first" : "먼저 로그인하세요.");
                return;
            }
            try {
                const res = await fetch("/api/profile/become-owner", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    }
                });
                if (!res.ok) {
                    alert(currentLang === "ru" ? "Не удалось изменить роль" :
                        currentLang === "en" ? "Failed to change role" : "역할 변경 실패");
                    return;
                }
                const data = await res.json();
                if (data && data.token && data.user) {
                    setAuth(data.token, data.user);
                    loadOwnerCafes();
                }
            } catch (e) {
                alert(currentLang === "ru" ? "Сетевая ошибка" :
                    currentLang === "en" ? "Network error" : "네트워크 오류");
            }
        });
    }

    const btnClientPremium = document.getElementById("btnClientPremium");
    if (btnClientPremium) {
        btnClientPremium.addEventListener("click", async () => {
            if (!authToken) {
                alert(currentLang === "ru" ? "Сначала войдите" :
                    currentLang === "en" ? "Please login first" : "먼저 로그인하세요.");
                return;
            }
            try {
                const res = await fetch("/api/payments/subscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    },
                    body: JSON.stringify({ plan: "client" })
                });
                if (!res.ok) {
                    alert(currentLang === "ru" ? "Не удалось оформить тариф" :
                        currentLang === "en" ? "Failed to start subscription" : "요금제 신청 실패");
                    return;
                }
                const data = await res.json();
                if (data && data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                    return;
                }
                alert(currentLang === "ru" ? "Заявка на клиентский премиум создана." :
                    currentLang === "en" ? "Client premium request created." : "클라이언트 프리미엄 신청이 생성되었습니다.");
            } catch (e) {
                alert(currentLang === "ru" ? "Сетевая ошибка" :
                    currentLang === "en" ? "Network error" : "네트워크 오류");
            }
        });
    }

    const btnCoffeePremium = document.getElementById("btnCoffeePremium");
    if (btnCoffeePremium) {
        btnCoffeePremium.addEventListener("click", async () => {
            if (!authToken) {
                alert(currentLang === "ru" ? "Сначала войдите" :
                    currentLang === "en" ? "Please login first" : "먼저 로그인하세요.");
                return;
            }
            try {
                const res = await fetch("/api/payments/subscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    },
                    body: JSON.stringify({ plan: "coffee" })
                });
                if (!res.ok) {
                    alert(currentLang === "ru" ? "Не удалось оформить тариф" :
                        currentLang === "en" ? "Failed to start subscription" : "요금제 신청 실패");
                    return;
                }
                const data = await res.json();
                if (data && data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                    return;
                }
                alert(currentLang === "ru" ? "Заявка на Coffee Premium создана." :
                    currentLang === "en" ? "Coffee Premium request created." : "커피 프리미엄 신청이 생성되었습니다.");
            } catch (e) {
                alert(currentLang === "ru" ? "Сетевая ошибка" :
                    currentLang === "en" ? "Network error" : "네트워크 오류");
            }
        });
    }

    const btnInvestPremium = document.getElementById("btnInvestPremium");
    if (btnInvestPremium) {
        btnInvestPremium.addEventListener("click", async () => {
            if (!authToken) {
                alert(currentLang === "ru" ? "Сначала войдите" :
                    currentLang === "en" ? "Please login first" : "먼저 로그인하세요.");
                return;
            }
            try {
                const res = await fetch("/api/payments/subscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    },
                    body: JSON.stringify({ plan: "invest" })
                });
                if (!res.ok) {
                    alert(currentLang === "ru" ? "Не удалось отправить заявку" :
                        currentLang === "en" ? "Failed to send request" : "신청 전송 실패");
                    return;
                }
                const data = await res.json();
                if (data && data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                    return;
                }
                alert(currentLang === "ru" ? "Заявка Invest Premium отправлена." :
                    currentLang === "en" ? "Invest Premium request sent." : "인베스트 프리미엄 신청이 전송되었습니다.");
            } catch (e) {
                alert(currentLang === "ru" ? "Сетевая ошибка" :
                    currentLang === "en" ? "Network error" : "네트워크 오류");
            }
        });
    }

    const ownerCafeForm = document.getElementById("ownerCafeForm");
    if (ownerCafeForm) {
        ownerCafeForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!authToken) {
                alert(currentLang === "ru" ? "Сначала войдите" :
                    currentLang === "en" ? "Please login first" : "먼저 로그인하세요.");
                return;
            }
            const nameInput = document.getElementById("ownerCafeName");
            const citySelect = document.getElementById("ownerCafeCity");
            const addressInput = document.getElementById("ownerCafeAddress");
            const phoneInput = document.getElementById("ownerCafePhone");
            const descInput = document.getElementById("ownerCafeDescription");
            if (!nameInput || !citySelect) {
                return;
            }
            try {
                const res = await fetch("/api/cafes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        cityCode: citySelect.value,
                        address: addressInput ? addressInput.value : "",
                        phone: phoneInput ? phoneInput.value : "",
                        description: descInput ? descInput.value : ""
                    })
                });
                if (!res.ok) {
                    alert(currentLang === "ru" ? "Не удалось создать кафе" :
                        currentLang === "en" ? "Failed to create cafe" : "카페 생성 실패");
                    return;
                }
                nameInput.value = "";
                if (addressInput) addressInput.value = "";
                if (phoneInput) phoneInput.value = "";
                if (descInput) descInput.value = "";
                loadOwnerCafes();
            } catch (e) {
                alert(currentLang === "ru" ? "Сетевая ошибка" :
                    currentLang === "en" ? "Network error" : "네트워크 오류");
            }
        });
    }

    applyLanguage(currentLang);
    initKakaoMap(currentCityCode);
    refreshProfileFromBackend();
    initAds();
    loadOwnerCafes();
});
