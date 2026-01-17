let currentSlide = 0;
let currentLang = "ko";
let currentCityCode = "seoul";
let map;
let mapMarker;
let authToken = null;
let currentUser = null;
let currentEditingNewsId = null;
const KAKAO_JS_KEY = "YOUR_KAKAO_JAVASCRIPT_KEY";

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
            adTitle: "파트너 광고",
            adText: "카페와 브랜드의 프로모션을 확인하세요.",
            adButton: "자세히 보기",
            recommendTitle: "추천 지역",
            verifyChannelLabel: "인증 코드 수신 방법",
            verifyChannelSms: "SMS로 코드 받기",
            verifyChannelEmail: "이메일로 코드 받기",
            verifyChannelKakao: "Kakao로 코드 받기",
            verifyChannelFacebook: "Facebook으로 코드 받기",
            verifyCodePlaceholder: "인증 코드",
            verificationChannelHint: "인증 코드를 받을 채널을 선택하세요.",
            verifyChannelSmsHint: "입력한 휴대폰 번호로 SMS 인증 코드를 받습니다.",
            verifyChannelEmailHint: "입력한 이메일 주소로 인증 코드를 받습니다.",
            verifyChannelKakaoHint: "Kakao 계정과 연결된 번호로 인증 코드를 받습니다.",
            verifyChannelFacebookHint: "Facebook 계정과 연결된 연락처로 인증 코드를 받습니다."
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
        regions: {
            capital: "수도권",
            yeongnam: "영남권",
            honam: "호남권",
            chungcheong: "충청권",
            jeju_region: "제주/기타"
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
            quickText: "Booking is free on Kafe Booking.",
            citySelectTitle: "Choose city",
            selectedCityPrefix: "Selected city: ",
            adTitle: "Partner ads",
            adText: "Promotions from cafes and brands.",
            adButton: "Learn more",
            recommendTitle: "Recommendations",
            verifyChannelLabel: "Where to receive verification code",
            verifyChannelSms: "Get code via SMS",
            verifyChannelEmail: "Get code via email",
            verifyChannelKakao: "Get code via Kakao",
            verifyChannelFacebook: "Get code via Facebook",
            verifyCodePlaceholder: "Verification code",
            verificationChannelHint: "Choose how you want to receive the verification code.",
            verifyChannelSmsHint: "Code will be sent by SMS to the phone number you enter.",
            verifyChannelEmailHint: "Code will be sent to the email address you enter.",
            verifyChannelKakaoHint: "Code will be sent via your Kakao account.",
            verifyChannelFacebookHint: "Code will be sent via your Facebook account."
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
        regions: {
            capital: "Capital area",
            yeongnam: "Yeongnam",
            honam: "Honam",
            chungcheong: "Chungcheong",
            jeju_region: "Jeju/Other"
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
            quickText: "Бронирование столиков на платформе бесплатное.",
            citySelectTitle: "Выбор города",
            selectedCityPrefix: "Выбранный город: ",
            adTitle: "Реклама партнёров",
            adText: "Актуальные предложения кафе и брендов.",
            adButton: "Подробнее",
            recommendTitle: "Рекомендации по городу",
            verifyChannelLabel: "Куда отправить код подтверждения",
            verifyChannelSms: "Получить код по SMS",
            verifyChannelEmail: "Получить код на email",
            verifyChannelKakao: "Получить код через Kakao",
            verifyChannelFacebook: "Получить код через Facebook",
            verifyCodePlaceholder: "Код подтверждения",
            verificationChannelHint: "Выберите, куда отправить код подтверждения.",
            verifyChannelSmsHint: "Код придёт по SMS на указанный номер телефона.",
            verifyChannelEmailHint: "Код придёт на указанный адрес электронной почты.",
            verifyChannelKakaoHint: "Код будет отправлен через ваш профиль Kakao.",
            verifyChannelFacebookHint: "Код будет отправлен через ваш профиль Facebook."
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
        regions: {
            capital: "Столичный регион",
            yeongnam: "Регион Ённам",
            honam: "Регион Хонам",
            chungcheong: "Регион Чхунчхон",
            jeju_region: "Чеджу и др."
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
        const feedAdsContainer = document.getElementById("feedAdsContainer");
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
        if (!data.provider || data.provider === "local") {
            try {
                const adsRes = await fetch(
                    "/api/ads?city=" + encodeURIComponent(currentCityCode || ""),
                    { headers }
                );
                if (!adsRes.ok) {
                    return;
                }
                const adsData = await adsRes.json();
                const ads = adsData && adsData.ads ? adsData.ads : [];
                if (!ads.length) {
                    adBanner.classList.add("hidden");
                    if (feedAdsContainer) {
                        feedAdsContainer.innerHTML = "";
                    }
                    return;
                }
                adBanner.innerHTML = "";
                const list = document.createElement("div");
                list.className = "ad-local-list";
                ads.forEach((ad) => {
                    const item = document.createElement("div");
                    item.className = "ad-local-item";
                    const title = document.createElement("div");
                    title.className = "ad-local-title";
                    title.textContent = ad.title || "";
                    const text = document.createElement("div");
                    text.className = "ad-local-text";
                    text.textContent = ad.text || "";
                    item.appendChild(title);
                    item.appendChild(text);
                    if (ad.url) {
                        item.addEventListener("click", () => {
                            window.open(ad.url, "_blank");
                        });
                        item.classList.add("ad-local-clickable");
                    }
                    list.appendChild(item);
                });
                adBanner.appendChild(list);
                if (feedAdsContainer) {
                    feedAdsContainer.innerHTML = "";
                    ads.slice(0, 3).forEach((ad) => {
                        const item = document.createElement("div");
                        item.className = "feed-ad-item";
                        item.textContent = ad.title || "";
                        feedAdsContainer.appendChild(item);
                    });
                }
            } catch (e) {
            }
        }
    } catch (e) {
    }
}

async function initStats() {
    const totalEl = document.getElementById("statsTotalVisits");
    const dailyEl = document.getElementById("statsDailyVisits");
    if (!totalEl || !dailyEl) {
        return;
    }
    try {
        const res = await fetch("/api/stats/visits");
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        if (data.totalVisits !== undefined) {
            totalEl.textContent = String(data.totalVisits);
        }
        if (data.dailyVisits !== undefined) {
            dailyEl.textContent = String(data.dailyVisits);
        }
    } catch (e) {
    }
}

async function loadNews() {
    const listEl = document.getElementById("newsList");
    if (!listEl) {
        return;
    }
    try {
        const res = await fetch("/api/news?lang=" + encodeURIComponent(currentLang || ""));
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const items = data && data.news ? data.news : [];
        listEl.innerHTML = "";
        items.forEach((item) => {
            const li = document.createElement("li");
            const title = item.title || "";
            const text = item.text || "";
            if (title && text) {
                li.textContent = title + " — " + text;
            } else {
                li.textContent = title || text || "";
            }
            listEl.appendChild(li);
        });
    } catch (e) {
    }
}

async function loadFeedCafes() {
    const listEl = document.getElementById("feedCafesList");
    if (!listEl) {
        return;
    }
    try {
        const res = await fetch("/api/cafes?city=" + encodeURIComponent(currentCityCode || ""));
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const cafes = data && data.cafes ? data.cafes : [];
        listEl.innerHTML = "";
        cafes.slice(0, 5).forEach((cafe) => {
            const div = document.createElement("div");
            div.className = "feed-cafe-item";
            const name = document.createElement("div");
            name.textContent = cafe.name || "";
            const address = document.createElement("div");
            address.textContent = cafe.address || "";
            div.appendChild(name);
            if (cafe.address) {
                div.appendChild(address);
            }
            listEl.appendChild(div);
        });
    } catch (e) {
    }
}

async function loadSiteConfig() {
    try {
        const res = await fetch("/api/site-config");
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const emailLink = document.getElementById("contactEmailLink");
        const telegramLink = document.getElementById("footerTelegramLink");
        const instagramLink = document.getElementById("footerInstagramLink");
        const email = data.contactEmail || "vamp.09.94@gmail.com";
        if (emailLink) {
            emailLink.textContent = email;
            emailLink.href = "mailto:" + email;
        }
        if (telegramLink) {
            if (data.telegramUrl) {
                telegramLink.href = data.telegramUrl;
                telegramLink.classList.remove("hidden");
            } else {
                telegramLink.classList.add("hidden");
            }
        }
        if (instagramLink) {
            if (data.instagramUrl) {
                instagramLink.href = data.instagramUrl;
                instagramLink.classList.remove("hidden");
            } else {
                instagramLink.classList.add("hidden");
            }
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
    const adminPanel = document.getElementById("adminPanel");
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
        if (adminPanel) adminPanel.classList.add("hidden");
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
    if (adminPanel) {
        if (currentUser.isAdmin) {
            adminPanel.classList.remove("hidden");
        } else {
            adminPanel.classList.add("hidden");
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
    const feedRecommendText = document.getElementById("feedRecommendText");
    const adTitle = document.getElementById("adTitle");
    const adText = document.getElementById("adText");
    const adButton = document.getElementById("adButton");
    const codeChannelSelect = document.getElementById("registerCodeChannel");
    const codeInput = document.getElementById("registerPhoneCode");
    const verificationChannelLabelEl = document.getElementById("verificationChannelLabel");
    const verificationChannelHintEl = document.getElementById("verificationChannelHint");

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
    if (verificationChannelLabelEl && config.ui.verifyChannelLabel) {
        verificationChannelLabelEl.textContent = config.ui.verifyChannelLabel;
    }

    if (codeChannelSelect) {
        const smsOption = codeChannelSelect.querySelector("option[value='sms']");
        const emailOption = codeChannelSelect.querySelector("option[value='email']");
        const kakaoOption = codeChannelSelect.querySelector("option[value='kakao']");
        const facebookOption = codeChannelSelect.querySelector("option[value='facebook']");
        if (smsOption) smsOption.textContent = config.ui.verifyChannelSms;
        if (emailOption) emailOption.textContent = config.ui.verifyChannelEmail;
        if (kakaoOption) kakaoOption.textContent = config.ui.verifyChannelKakao;
        if (facebookOption) facebookOption.textContent = config.ui.verifyChannelFacebook;
    }
    if (codeInput && config.ui.verifyCodePlaceholder) {
        codeInput.placeholder = config.ui.verifyCodePlaceholder;
    }

    if (verificationChannelHintEl) {
        const baseHint = config.ui.verificationChannelHint || "";
        verificationChannelHintEl.textContent = baseHint;
    }

    const provinceButtons = document.querySelectorAll(".province-btn");
    if (config.regions) {
        provinceButtons.forEach((btn) => {
            const code = btn.getAttribute("data-province");
            const name = config.regions[code];
            if (name) {
                btn.textContent = name;
            }
        });
    }

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

    if (config.recommendations) {
        const rec = config.recommendations[currentCityCode];
        if (rec) {
            if (recommendText) {
                recommendText.textContent = rec;
            }
            if (feedRecommendText) {
                feedRecommendText.textContent = rec;
            }
        }
    }

    const langButtons = document.querySelectorAll(".lang-btn");
    langButtons.forEach((b) => {
        const langCode = b.getAttribute("data-lang");
        b.classList.toggle("active", langCode === lang);
    });

    renderProfile();
    loadNews();
}

function applyVerificationChannelHint() {
    const config = translations[currentLang];
    if (!config) return;
    const hintEl = document.getElementById("verificationChannelHint");
    const selectEl = document.getElementById("registerCodeChannel");
    if (!hintEl || !selectEl) return;
    const channel = selectEl.value || "sms";
    let text = config.ui.verificationChannelHint || "";
    if (channel === "sms" && config.ui.verifyChannelSmsHint) {
        text = config.ui.verifyChannelSmsHint;
    } else if (channel === "email" && config.ui.verifyChannelEmailHint) {
        text = config.ui.verifyChannelEmailHint;
    } else if (channel === "kakao" && config.ui.verifyChannelKakaoHint) {
        text = config.ui.verifyChannelKakaoHint;
    } else if (channel === "facebook" && config.ui.verifyChannelFacebookHint) {
        text = config.ui.verifyChannelFacebookHint;
    }
    hintEl.textContent = text;
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

async function loadAdminUsers() {
    const listEl = document.getElementById("adminUsersList");
    if (!listEl || !authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/users", {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const users = data && data.users ? data.users : [];
        listEl.innerHTML = "";
        users.forEach((user) => {
            const div = document.createElement("div");
            div.className = "admin-list-item";
            const plan = user.subscriptionPlan || "none";
            const role = user.role || "user";
            const name = user.name || "";
            const cityCode = user.cityCode || "";
            const flags = [];
            if (user.isAdmin) {
                flags.push("admin");
            }
            if (user.isInvestor) {
                flags.push("investor");
            }
            const flagsText = flags.length ? " [" + flags.join(", ") + "]" : "";
            const mainText = document.createElement("div");
            mainText.textContent =
                name +
                " (" +
                role +
                ")" +
                (cityCode ? " / " + cityCode : "") +
                " - plan: " +
                plan +
                flagsText;
            const buttonsWrap = document.createElement("div");
            buttonsWrap.className = "admin-user-plan-buttons";
            const plans = [
                { code: "none", label: "None" },
                { code: "client", label: "Client" },
                { code: "coffee", label: "Coffee" },
                { code: "invest", label: "Invest" }
            ];
            plans.forEach((p) => {
                const b = document.createElement("button");
                b.type = "button";
                b.className =
                    "admin-user-plan-btn" +
                    (plan === p.code ? " admin-user-plan-btn-active" : "");
                b.textContent = p.label;
                b.addEventListener("click", async () => {
                    await updateUserPlan(user._id, p.code);
                });
                buttonsWrap.appendChild(b);
            });
            div.appendChild(mainText);
            div.appendChild(buttonsWrap);
            listEl.appendChild(div);
        });
    } catch (e) {
    }
}

async function updateUserPlan(userId, plan) {
    if (!authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    const body =
        plan === "none"
            ? { subscriptionPlan: "none", subscriptionExpiresAt: null }
            : { subscriptionPlan: plan };
    try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(userId) + "/subscription", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            return;
        }
        await loadAdminUsers();
    } catch (e) {
    }
}

async function loadAdminCafes() {
    const listEl = document.getElementById("adminCafesList");
    if (!listEl || !authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/cafes", {
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
            div.className =
                "admin-list-item " +
                (cafe.isActive ? "admin-list-item-active" : "admin-list-item-inactive");
            const rowTop = document.createElement("div");
            rowTop.className = "admin-list-row-top";
            const mainText = document.createElement("div");
            const name = cafe.name || "";
            const cityCode = cafe.cityCode || "";
            mainText.textContent = name + (cityCode ? " (" + cityCode + ")" : "");
            const statusPill = document.createElement("div");
            statusPill.className = "admin-status-pill";
            const dot = document.createElement("span");
            dot.className =
                "admin-status-dot " +
                (cafe.isActive ? "admin-status-dot-active" : "admin-status-dot-inactive");
            const statusText = document.createElement("span");
            statusText.textContent = cafe.isActive ? "ON" : "OFF";
            statusPill.appendChild(dot);
            statusPill.appendChild(statusText);
            rowTop.appendChild(mainText);
            rowTop.appendChild(statusPill);
            div.appendChild(rowTop);
            div.addEventListener("click", async () => {
                await toggleCafeActive(cafe._id, !!cafe.isActive);
            });
            listEl.appendChild(div);
        });
    } catch (e) {
    }
}

async function toggleCafeActive(cafeId, current) {
    if (!authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/cafes/" + encodeURIComponent(cafeId), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken
            },
            body: JSON.stringify({ isActive: !current })
        });
        if (!res.ok) {
            return;
        }
        await loadAdminCafes();
    } catch (e) {
    }
}

async function loadAdminAds() {
    const listEl = document.getElementById("adminAdsList");
    if (!listEl || !authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/ads", {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const ads = data && data.ads ? data.ads : [];
        listEl.innerHTML = "";
        ads.forEach((ad) => {
            const div = document.createElement("div");
            div.className =
                "admin-list-item " +
                (ad.active ? "admin-list-item-active" : "admin-list-item-inactive");
            const rowTop = document.createElement("div");
            rowTop.className = "admin-list-row-top";
            const mainText = document.createElement("div");
            const title = ad.title || "";
            const cityCode = ad.cityCode || "";
            const weight = typeof ad.weight === "number" ? ad.weight : "";
            let main = title;
            if (cityCode) {
                main += " / " + cityCode;
            }
            if (weight !== "") {
                main += " (w=" + weight + ")";
            }
            mainText.textContent = main;
            const statusPill = document.createElement("div");
            statusPill.className = "admin-status-pill";
            const dot = document.createElement("span");
            dot.className =
                "admin-status-dot " +
                (ad.active ? "admin-status-dot-active" : "admin-status-dot-inactive");
            const statusText = document.createElement("span");
            statusText.textContent = ad.active ? "ON" : "OFF";
            statusPill.appendChild(dot);
            statusPill.appendChild(statusText);
            rowTop.appendChild(mainText);
            rowTop.appendChild(statusPill);
            div.appendChild(rowTop);
            div.addEventListener("click", async () => {
                await toggleAdActive(ad._id, !!ad.active);
            });
            listEl.appendChild(div);
        });
    } catch (e) {
    }
}

async function loadAdminNews() {
    const listEl = document.getElementById("adminNewsList");
    if (!listEl || !authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/news", {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const items = data && data.news ? data.news : [];
        listEl.innerHTML = "";
        items.forEach((item) => {
            const row = document.createElement("div");
            row.className = "admin-list-item admin-news-item";
            const title = item.title || "";
            const lang = item.lang || "";
            const isActive = item.isActive ? "on" : "off";

            const main = document.createElement("div");
            main.className = "admin-news-main";
            main.textContent =
                (lang ? "[" + lang.toUpperCase() + "] " : "") +
                title +
                " - " +
                isActive;
            main.addEventListener("click", async () => {
                await toggleNewsActive(item._id, !!item.isActive);
            });

            const controls = document.createElement("div");
            controls.className = "admin-news-controls";

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "admin-news-btn";
            editBtn.textContent = "✎";
            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const titleInput = document.getElementById("adminNewsTitle");
                const textInput = document.getElementById("adminNewsText");
                const langSelect = document.getElementById("adminNewsLang");
                const submitBtn = document.querySelector("#adminNewsForm button[type='submit']");
                if (titleInput && textInput && langSelect) {
                    titleInput.value = item.title || "";
                    textInput.value = item.text || "";
                    if (item.lang && (item.lang === "ru" || item.lang === "ko" || item.lang === "en")) {
                        langSelect.value = item.lang;
                    }
                    currentEditingNewsId = item._id;
                    if (submitBtn) {
                        submitBtn.textContent = "Сохранить изменения";
                    }
                }
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "admin-news-btn admin-news-btn-danger";
            deleteBtn.textContent = "✕";
            deleteBtn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const confirmDelete =
                    currentLang === "ru"
                        ? "Удалить новость?"
                        : currentLang === "en"
                        ? "Delete this news item?"
                        : "이 뉴스를 삭제할까요?";
                if (!window.confirm(confirmDelete)) {
                    return;
                }
                await deleteNews(item._id);
            });

            controls.appendChild(editBtn);
            controls.appendChild(deleteBtn);
            row.appendChild(main);
            row.appendChild(controls);
            listEl.appendChild(row);
        });
    } catch (e) {
    }
}

async function loadAdminVerifications() {
    const listEl = document.getElementById("adminVerificationsList");
    if (!listEl || !authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/verifications", {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const items = data && data.verifications ? data.verifications : [];
        listEl.innerHTML = "";
        items.forEach((item) => {
            const row = document.createElement("div");
            row.className = "admin-list-item";
            const main = document.createElement("div");
            const channel = item.channel || "sms";
            const dest = item.email || item.phone || "";
            const created = item.createdAt ? new Date(item.createdAt) : null;
            const expires = item.expiresAt ? new Date(item.expiresAt) : null;
            const createdStr = created ? created.toLocaleString() : "";
            const expiresStr = expires ? expires.toLocaleString() : "";
            main.textContent =
                "channel=" +
                channel +
                (dest ? " / " + dest : "") +
                (createdStr ? " / " + createdStr : "") +
                (expiresStr ? " → " + expiresStr : "") +
                " / attempts=" +
                (item.attempts || 0);
            const controls = document.createElement("div");
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.textContent = "Удалить";
            deleteBtn.addEventListener("click", async () => {
                if (
                    !window.confirm(
                        currentLang === "ru"
                            ? "Удалить запись верификации?"
                            : currentLang === "en"
                            ? "Delete this verification entry?"
                            : "이 인증 항목을 삭제할까요?"
                    )
                ) {
                    return;
                }
                try {
                    const delRes = await fetch(
                        "/api/admin/verifications/" + encodeURIComponent(item._id),
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: "Bearer " + authToken
                            }
                        }
                    );
                    if (!delRes.ok) {
                        return;
                    }
                    await loadAdminVerifications();
                } catch (e) {
                }
            });
            controls.appendChild(deleteBtn);
            row.appendChild(main);
            row.appendChild(controls);
            listEl.appendChild(row);
        });
    } catch (e) {
    }
}

async function toggleNewsActive(newsId, current) {
    if (!authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/news/" + encodeURIComponent(newsId), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken
            },
            body: JSON.stringify({ isActive: !current })
        });
        if (!res.ok) {
            return;
        }
        await loadAdminNews();
        await loadNews();
    } catch (e) {
    }
}

async function deleteNews(newsId) {
    if (!authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/news/" + encodeURIComponent(newsId), {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const titleInput = document.getElementById("adminNewsTitle");
        const textInput = document.getElementById("adminNewsText");
        const submitBtn = document.querySelector("#adminNewsForm button[type='submit']");
        if (currentEditingNewsId === newsId) {
            currentEditingNewsId = null;
            if (titleInput) titleInput.value = "";
            if (textInput) textInput.value = "";
            if (submitBtn) submitBtn.textContent = "Опубликовать новость";
        }
        await loadAdminNews();
        await loadNews();
    } catch (e) {
    }
}

async function toggleAdActive(adId, current) {
    if (!authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    try {
        const res = await fetch("/api/admin/ads/" + encodeURIComponent(adId), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken
            },
            body: JSON.stringify({ active: !current })
        });
        if (!res.ok) {
            return;
        }
        await loadAdminAds();
    } catch (e) {
    }
}

async function reloadAdminData() {
    await loadAdminUsers();
    await loadAdminCafes();
    await loadAdminAds();
    await loadAdminNews();
    await loadAdminVerifications();
}

async function adminLoginPrompt() {
    const password = window.prompt("Введите пароль администратора");
    if (!password) {
        return;
    }
    try {
        const res = await fetch("/api/auth/login-admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "vamp.09.94@gmail.com",
                password
            })
        });
        if (!res.ok) {
            alert(
                currentLang === "ru"
                    ? "Ошибка админ-входа"
                    : currentLang === "en"
                    ? "Admin login failed"
                    : "관리자 로그인 실패"
            );
            return;
        }
        const data = await res.json();
        if (data && data.token && data.user) {
            setAuth(data.token, data.user);
            await reloadAdminData();
        }
    } catch (e) {
        alert(
            currentLang === "ru"
                ? "Сетевая ошибка"
                : currentLang === "en"
                ? "Network error"
                : "네트워크 오류"
        );
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
            loadFeedCafes();
        });
    });

    const provinceButtons = document.querySelectorAll(".province-btn");
    function filterCitiesByProvince(province) {
        let firstVisible = null;
        cityButtons.forEach((btn) => {
            const p = btn.getAttribute("data-province");
            if (!province || p === province) {
                btn.style.display = "";
                if (!firstVisible) {
                    firstVisible = btn;
                }
            } else {
                btn.style.display = "none";
                btn.classList.remove("active");
            }
        });
        if (firstVisible) {
            cityButtons.forEach((b) => b.classList.remove("active"));
            firstVisible.classList.add("active");
            const code = firstVisible.getAttribute("data-city");
            currentCityCode = code || "seoul";
            applyLanguage(currentLang);
            initKakaoMap(currentCityCode);
        }
    }

    provinceButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            provinceButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const province = btn.getAttribute("data-province");
            filterCitiesByProvince(province);
        });
    });

    const activeProvince = document.querySelector(".province-btn.active");
    if (activeProvince) {
        const province = activeProvince.getAttribute("data-province");
        filterCitiesByProvince(province);
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const term = searchInput.value.toLowerCase().trim();
            const cityButtonsSearch = document.querySelectorAll(".city-btn");
            cityButtonsSearch.forEach((btn) => {
                const code = btn.getAttribute("data-city") || "";
                const text = btn.textContent || "";
                const match = !term || text.toLowerCase().includes(term) || code.toLowerCase().includes(term);
                btn.style.display = match ? "" : "none";
            });
            const cafeItems = document.querySelectorAll(".cafe-items .cafe-item");
            cafeItems.forEach((item) => {
                const text = item.innerText || "";
                const match = !term || text.toLowerCase().includes(term);
                item.style.display = match ? "" : "none";
            });
        });
    }

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
    const btnKakaoLogin = document.getElementById("btnKakaoLogin");
    if (btnLogin) {
        btnLogin.addEventListener("click", () => {
            showLoginModal();
        });
    }
    if (btnKakaoLogin) {
        btnKakaoLogin.addEventListener("click", async () => {
            if (!window.Kakao) {
                alert(
                    currentLang === "ru"
                        ? "Kakao SDK недоступен"
                        : currentLang === "en"
                        ? "Kakao SDK not available"
                        : "Kakao SDK를 사용할 수 없습니다."
                );
                return;
            }
            if (!window.Kakao.isInitialized()) {
                if (!KAKAO_JS_KEY || KAKAO_JS_KEY === "YOUR_KAKAO_JAVASCRIPT_KEY") {
                    alert(
                        currentLang === "ru"
                            ? "Kakao ключ не настроен"
                            : currentLang === "en"
                            ? "Kakao key is not configured"
                            : "Kakao 키가 설정되지 않았습니다."
                    );
                    return;
                }
                window.Kakao.init(KAKAO_JS_KEY);
            }
            window.Kakao.Auth.login({
                scope: "profile_nickname,account_email",
                success() {
                    window.Kakao.API.request({
                        url: "/v2/user/me",
                        success: async (res) => {
                            try {
                                const kakaoId = res && res.id ? String(res.id) : null;
                                const profile =
                                    res &&
                                    res.kakao_account &&
                                    res.kakao_account.profile
                                        ? res.kakao_account.profile
                                        : null;
                                const nickname = profile && profile.nickname ? profile.nickname : "";
                                const email =
                                    res &&
                                    res.kakao_account &&
                                    res.kakao_account.email
                                        ? res.kakao_account.email
                                        : "";
                                if (!kakaoId) {
                                    alert(
                                        currentLang === "ru"
                                            ? "Не удалось получить профиль Kakao"
                                            : currentLang === "en"
                                            ? "Failed to get Kakao profile"
                                            : "Kakao 프로필을 가져오지 못했습니다."
                                    );
                                    return;
                                }
                                const response = await fetch("/api/auth/login-kakao", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        kakaoId,
                                        email,
                                        name: nickname
                                    })
                                });
                                if (!response.ok) {
                                    alert(
                                        currentLang === "ru"
                                            ? "Ошибка входа через Kakao"
                                            : currentLang === "en"
                                            ? "Kakao login failed"
                                            : "Kakao 로그인 실패"
                                    );
                                    return;
                                }
                                const data = await response.json();
                                if (data && data.token && data.user) {
                                    setAuth(data.token, data.user);
                                    closeModal("loginModal");
                                }
                            } catch (e) {
                                alert(
                                    currentLang === "ru"
                                        ? "Сетевая ошибка"
                                        : currentLang === "en"
                                        ? "Network error"
                                        : "네트워크 오류"
                                );
                            }
                        },
                        fail() {
                            alert(
                                currentLang === "ru"
                                    ? "Не удалось получить профиль Kakao"
                                    : currentLang === "en"
                                    ? "Failed to get Kakao profile"
                                    : "Kakao 프로필을 가져오지 못했습니다."
                            );
                        }
                    });
                },
                fail() {
                    alert(
                        currentLang === "ru"
                            ? "Вход через Kakao отменён или не удался"
                            : currentLang === "en"
                            ? "Kakao login was cancelled or failed"
                            : "Kakao 로그인이 취소되었거나 실패했습니다."
                    );
                }
            });
        });
    }

    const closeButtons = document.querySelectorAll(".modal .close");
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal-id");
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("registerName");
            const emailInput = document.getElementById("registerEmail");
            const phoneInput = document.getElementById("registerPhone");
            const passwordInput = document.getElementById("registerPassword");
            const passwordConfirmInput = document.getElementById("registerPasswordConfirm");
            const userTypeInput = document.getElementById("userType");
            const codeInput = document.getElementById("registerPhoneCode");
            const channelSelect = document.getElementById("registerCodeChannel");
            if (!nameInput || !emailInput || !phoneInput || !passwordInput || !passwordConfirmInput || !userTypeInput || !codeInput) {
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
                        email: emailInput.value,
                        phone: phoneInput.value,
                        password: passwordInput.value,
                        name: nameInput.value,
                        role: userTypeInput.value,
                        code: codeInput.value,
                        channel: channelSelect ? channelSelect.value : "sms"
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

    const btnSendCode = document.getElementById("btnSendCode");
    if (btnSendCode) {
        btnSendCode.addEventListener("click", async () => {
            const phoneInput = document.getElementById("registerPhone");
            const emailInput = document.getElementById("registerEmail");
            const channelSelect = document.getElementById("registerCodeChannel");
            const channel = channelSelect ? channelSelect.value : "sms";
            if (channel === "email") {
                if (!emailInput || !emailInput.value) {
                    alert(currentLang === "ru" ? "Введите email" :
                        currentLang === "en" ? "Enter email" : "이메일을 입력하세요.");
                    return;
                }
            } else {
                if (!phoneInput || !phoneInput.value) {
                    alert(currentLang === "ru" ? "Введите номер телефона" :
                        currentLang === "en" ? "Enter phone number" : "전화번호를 입력하세요.");
                    return;
                }
            }
            try {
                const res = await fetch("/api/auth/request-phone-code", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        channel === "email"
                            ? {
                                  email: emailInput.value,
                                  channel: "email"
                              }
                            : {
                                  phone: phoneInput.value,
                                  channel
                              }
                    )
                });
                if (!res.ok) {
                    alert(currentLang === "ru" ? "Не удалось отправить код" :
                        currentLang === "en" ? "Failed to send code" : "코드 전송 실패");
                    return;
                }
                const successMessage =
                    currentLang === "ru"
                        ? channel === "email"
                            ? "Код отправлен. Проверьте email."
                            : "Код отправлен. Проверьте SMS."
                        : currentLang === "en"
                        ? channel === "email"
                            ? "Code sent. Check your email."
                            : "Code sent. Check SMS."
                        : channel === "email"
                        ? "코드가 전송되었습니다. 이메일을 확인하세요."
                        : "코드가 전송되었습니다. 문자를 확인하세요.";
                alert(successMessage);
            } catch (e) {
                alert(currentLang === "ru" ? "Сетевая ошибка" :
                    currentLang === "en" ? "Network error" : "네트워크 오류");
            }
        });
    }

    const codeChannelSelect = document.getElementById("registerCodeChannel");
    if (codeChannelSelect) {
        codeChannelSelect.addEventListener("change", () => {
            applyVerificationChannelHint();
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const loginInput = document.getElementById("loginIdentifier");
            const passwordInput = document.getElementById("loginPassword");
            if (!loginInput || !passwordInput) {
                return;
            }
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        login: loginInput.value,
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

    const logoTitle = document.querySelector(".logo h1");
    if (logoTitle) {
        logoTitle.addEventListener("dblclick", () => {
            adminLoginPrompt();
        });
    }

    const adminTabButtons = document.querySelectorAll(".admin-tab-btn");
    const adminUsersTab = document.getElementById("adminUsersTab");
    const adminCafesTab = document.getElementById("adminCafesTab");
    const adminAdsTab = document.getElementById("adminAdsTab");
    const adminNewsTab = document.getElementById("adminNewsTab");
    const adminVerificationsTab = document.getElementById("adminVerificationsTab");
    const adminConfigTab = document.getElementById("adminConfigTab");
    adminTabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const tab = btn.getAttribute("data-tab");
            adminTabButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            if (adminUsersTab && adminCafesTab && adminAdsTab && adminNewsTab && adminVerificationsTab && adminConfigTab) {
                adminUsersTab.classList.remove("active");
                adminCafesTab.classList.remove("active");
                adminAdsTab.classList.remove("active");
                adminNewsTab.classList.remove("active");
                adminVerificationsTab.classList.remove("active");
                adminConfigTab.classList.remove("active");
                if (tab === "users") {
                    adminUsersTab.classList.add("active");
                    loadAdminUsers();
                } else if (tab === "cafes") {
                    adminCafesTab.classList.add("active");
                    loadAdminCafes();
                } else if (tab === "ads") {
                    adminAdsTab.classList.add("active");
                    loadAdminAds();
                } else if (tab === "news") {
                    adminNewsTab.classList.add("active");
                    loadAdminNews();
                } else if (tab === "verifications") {
                    adminVerificationsTab.classList.add("active");
                    loadAdminVerifications();
                } else if (tab === "config") {
                    adminConfigTab.classList.add("active");
                }
            }
        });
    });

    const adminAdForm = document.getElementById("adminAdForm");
    if (adminAdForm) {
        adminAdForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!authToken || !currentUser || !currentUser.isAdmin) {
                alert(
                    currentLang === "ru"
                        ? "Требуется вход администратора"
                        : currentLang === "en"
                        ? "Admin login required"
                        : "관리자 로그인이 필요합니다"
                );
                return;
            }
            const titleInput = document.getElementById("adminAdTitle");
            const textInput = document.getElementById("adminAdText");
            const cityInput = document.getElementById("adminAdCityCode");
            const urlInput = document.getElementById("adminAdUrl");
            const weightInput = document.getElementById("adminAdWeight");
            if (!titleInput) {
                return;
            }
            const payload = {
                title: titleInput.value,
                text: textInput ? textInput.value : "",
                cityCode: cityInput ? cityInput.value || "all" : "all",
                url: urlInput ? urlInput.value : ""
            };
            if (weightInput && weightInput.value) {
                const parsed = Number(weightInput.value);
                if (Number.isFinite(parsed)) {
                    payload.weight = parsed;
                }
            }
            try {
                const res = await fetch("/api/admin/ads", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) {
                    alert(
                        currentLang === "ru"
                            ? "Не удалось создать рекламу"
                            : currentLang === "en"
                            ? "Failed to create ad"
                            : "광고 생성 실패"
                    );
                    return;
                }
                if (titleInput) {
                    titleInput.value = "";
                }
                if (textInput) {
                    textInput.value = "";
                }
                if (cityInput) {
                    cityInput.value = "";
                }
                if (urlInput) {
                    urlInput.value = "";
                }
                if (weightInput) {
                    weightInput.value = "";
                }
                await loadAdminAds();
            } catch (e) {
                alert(
                    currentLang === "ru"
                        ? "Сетевая ошибка"
                        : currentLang === "en"
                        ? "Network error"
                        : "네트워크 오류"
                );
            }
        });
    }

    const adminConfigForm = document.getElementById("adminConfigForm");
    if (adminConfigForm) {
        adminConfigForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!authToken || !currentUser || !currentUser.isAdmin) {
                alert(
                    currentLang === "ru"
                        ? "Требуется вход администратора"
                        : currentLang === "en"
                        ? "Admin login required"
                        : "관리자 로그인이 필요합니다"
                );
                return;
            }
            const emailInput = document.getElementById("adminContactEmail");
            const telegramInput = document.getElementById("adminTelegramUrl");
            const instagramInput = document.getElementById("adminInstagramUrl");
            try {
                const res = await fetch("/api/admin/site-config", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    },
                    body: JSON.stringify({
                        contactEmail: emailInput ? emailInput.value : "",
                        telegramUrl: telegramInput ? telegramInput.value : "",
                        instagramUrl: instagramInput ? instagramInput.value : ""
                    })
                });
                if (!res.ok) {
                    alert(
                        currentLang === "ru"
                            ? "Не удалось сохранить контакты"
                            : currentLang === "en"
                            ? "Failed to save contacts"
                            : "연락처 저장 실패"
                    );
                    return;
                }
                await loadSiteConfig();
                alert(
                    currentLang === "ru"
                        ? "Контакты обновлены."
                        : currentLang === "en"
                        ? "Contacts updated."
                        : "연락처가 업데이트되었습니다."
                );
            } catch (e) {
                alert(
                    currentLang === "ru"
                        ? "Сетевая ошибка"
                        : currentLang === "en"
                        ? "Network error"
                        : "네트워크 오류"
                );
            }
        });
    }

    const adminNewsForm = document.getElementById("adminNewsForm");
    if (adminNewsForm) {
        adminNewsForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!authToken || !currentUser || !currentUser.isAdmin) {
                alert(
                    currentLang === "ru"
                        ? "Требуется вход администратора"
                        : currentLang === "en"
                        ? "Admin login required"
                        : "관리자 로그인이 필요합니다"
                );
                return;
            }
            const titleInput = document.getElementById("adminNewsTitle");
            const textInput = document.getElementById("adminNewsText");
            const langSelect = document.getElementById("adminNewsLang");
            if (!titleInput || !textInput || !langSelect) {
                return;
            }
            try {
                const res = await fetch("/api/admin/news", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    },
                    body: JSON.stringify({
                        title: titleInput.value,
                        text: textInput.value,
                        lang: langSelect.value
                    })
                });
                if (!res.ok) {
                    alert(
                        currentLang === "ru"
                            ? "Не удалось создать новость"
                            : currentLang === "en"
                            ? "Failed to create news"
                            : "뉴스 생성 실패"
                    );
                    return;
                }
                titleInput.value = "";
                textInput.value = "";
                await loadAdminNews();
                await loadNews();
            } catch (e) {
                alert(
                    currentLang === "ru"
                        ? "Сетевая ошибка"
                        : currentLang === "en"
                        ? "Network error"
                        : "네트워크 오류"
                );
            }
        });
    }

    applyLanguage(currentLang);
    initKakaoMap(currentCityCode);
    refreshProfileFromBackend();
    initAds();
    loadOwnerCafes();
    reloadAdminData();
    loadFeedCafes();
    initStats();
    loadSiteConfig();
    loadNews();
});
