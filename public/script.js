let currentSlide = 0;
let currentLang = "ko";
let currentCityCode = "seoul";
let map;
let mapMarker;
let highlightMarker;
let authToken = null;
let currentUser = null;
let currentEditingNewsId = null;
let currentCafeId = null;
let currentCafeContact = null;
let currentCafePostsOffset = 0;
let currentCafePostsHasMore = false;
let currentFeedCafes = [];
const CAFE_POSTS_PAGE_SIZE = 5;
const KAKAO_JS_KEY = window.KAKAO_JS_KEY || "YOUR_KAKAO_JAVASCRIPT_KEY";

const translations = {
    ko: {
        ui: {
            registerUser: "손님 회원가입",
            registerOwner: "카페 오너 회원가입",
            login: "로그인",
            quickTitle: "카페 소셜 피드",
            quickText: "좋아하는 카페를 구독하고 소식을 빠르게 받아보세요.",
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
            verificationChannelFacebookHint: "Facebook 계정과 연결된 연락처로 인증 코드를 받습니다.",
            registerCityPlaceholder: "도시 (직접 입력)",
            headerCitySearchPlaceholder: "도시 검색"
        },
        days: {
            mon: "월",
            tue: "화",
            wed: "수",
            thu: "목",
            fri: "금",
            sat: "토",
            sun: "일"
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
            gumi: "구미",
            andong: "안동시",
            ansan: "안산시",
            anseong: "안성시",
            anyang: "안양시",
            asan: "아산시",
            wonju: "원주시",
            iksan: "익산시",
            icheon: "이천시",
            yeongju: "영주시",
            yeongcheon: "영천시",
            yeosu: "여수시",
            gangneung: "강릉시",
            gwangju_gg: "광주시(경기도)",
            gwangmyeong: "광명시",
            gwangyang: "광양시",
            gwacheon: "과천시",
            gyeryong: "계룡시",
            gyeongju: "경주시",
            gyeongsan: "경산시",
            gimje: "김제시",
            gimpo: "김포시",
            gimhae: "김해시",
            gimcheon: "김천시",
            geoje: "거제시",
            gongju: "공주시",
            gunpo: "군포시",
            gunsan: "군산시",
            guri: "구리시",
            miryang: "밀양시",
            mokpo: "목포시",
            mungyeong: "문경시",
            naju: "나주시",
            namwon: "남원시",
            namyangju: "남양주시",
            nonsan: "논산시",
            osan: "오산시",
            boryeong: "보령시",
            bucheon: "부천시",
            paju: "파주시",
            pyeongtaek: "평택시",
            pocheon: "포천시",
            samcheok: "삼척시",
            sangju: "상주시",
            sacheon: "사천시",
            siheung: "시흥시",
            seogwipo: "서귀포시",
            sokcho: "속초시",
            seosan: "서산시",
            suncheon: "순천시",
            dangjin: "당진시",
            dongducheon: "동두천시",
            donghae: "동해시",
            tongyeong: "통영시",
            taebaek: "태백시",
            hanam: "하남시",
            hwaseong: "화성시",
            jecheon: "제천시",
            jinju: "진주시",
            jinhae: "진해시",
            jeongeup: "정읍시",
            cheonan: "천안시",
            chungju: "충주시",
            chuncheon: "춘천시",
            uiwang: "의왕시",
            uijeongbu: "의정부시",
            yangju: "양주시",
            yangsan: "양산시"
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
            quickTitle: "Cafe social feed",
            quickText: "Follow cafes, read updates and share your experience.",
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
            verifyChannelFacebookHint: "Code will be sent via your Facebook account.",
            registerCityPlaceholder: "City (you can type it yourself)",
            headerCitySearchPlaceholder: "Search city"
        },
        days: {
            mon: "Mon",
            tue: "Tue",
            wed: "Wed",
            thu: "Thu",
            fri: "Fri",
            sat: "Sat",
            sun: "Sun"
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
            gumi: "Gumi",
            andong: "Andong",
            ansan: "Ansan",
            anseong: "Anseong",
            anyang: "Anyang",
            asan: "Asan",
            wonju: "Wonju",
            iksan: "Iksan",
            icheon: "Icheon",
            yeongju: "Yeongju",
            yeongcheon: "Yeongcheon",
            yeosu: "Yeosu",
            gangneung: "Gangneung",
            gwangju_gg: "Gwangju (Gyeonggi)",
            gwangmyeong: "Gwangmyeong",
            gwangyang: "Gwangyang",
            gwacheon: "Gwacheon",
            gyeryong: "Gyeryong",
            gyeongju: "Gyeongju",
            gyeongsan: "Gyeongsan",
            gimje: "Gimje",
            gimpo: "Gimpo",
            gimhae: "Gimhae",
            gimcheon: "Gimcheon",
            geoje: "Geoje",
            gongju: "Gongju",
            gunpo: "Gunpo",
            gunsan: "Gunsan",
            guri: "Guri",
            miryang: "Miryang",
            mokpo: "Mokpo",
            mungyeong: "Mungyeong",
            naju: "Naju",
            namwon: "Namwon",
            namyangju: "Namyangju",
            nonsan: "Nonsan",
            osan: "Osan",
            boryeong: "Boryeong",
            bucheon: "Bucheon",
            paju: "Paju",
            pyeongtaek: "Pyeongtaek",
            pocheon: "Pocheon",
            samcheok: "Samcheok",
            sangju: "Sangju",
            sacheon: "Sacheon",
            siheung: "Siheung",
            seogwipo: "Seogwipo",
            sokcho: "Sokcho",
            seosan: "Seosan",
            suncheon: "Suncheon",
            dangjin: "Dangjin",
            dongducheon: "Dongducheon",
            donghae: "Donghae",
            tongyeong: "Tongyeong",
            taebaek: "Taebaek",
            hanam: "Hanam",
            hwaseong: "Hwaseong",
            jecheon: "Jecheon",
            jinju: "Jinju",
            jinhae: "Jinhae",
            jeongeup: "Jeongeup",
            cheonan: "Cheonan",
            chungju: "Chungju",
            chuncheon: "Chuncheon",
            uiwang: "Uiwang",
            uijeongbu: "Uijeongbu",
            yangju: "Yangju",
            yangsan: "Yangsan"
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
            quickTitle: "Лента кафе и подписки",
            quickText: "Подписывайтесь на любимые кафе, читайте новости и оставляйте отзывы.",
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
            verifyChannelFacebookHint: "Код будет отправлен через ваш профиль Facebook.",
            registerCityPlaceholder: "Город (можно вводить вручную)",
            headerCitySearchPlaceholder: "Поиск города"
        },
        days: {
            mon: "Пн",
            tue: "Вт",
            wed: "Ср",
            thu: "Чт",
            fri: "Пт",
            sat: "Сб",
            sun: "Вс"
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
            gumi: "Куми",
            andong: "Андон",
            ansan: "Ансан",
            anseong: "Ансон",
            anyang: "Анян",
            asan: "Асан",
            wonju: "Вонджу",
            iksan: "Иксан",
            icheon: "Ичхон",
            yeongju: "Йонджу",
            yeongcheon: "Йончхон",
            yeosu: "Йосу",
            gangneung: "Каннын",
            gwangju_gg: "Кванджу (Кёнгидо)",
            gwangmyeong: "Кванмён",
            gwangyang: "Кванъян",
            gwacheon: "Квачхон",
            gyeryong: "Керён",
            gyeongju: "Кёнджу",
            gyeongsan: "Кёнсан",
            gimje: "Кимдже",
            gimpo: "Кимпхо",
            gimhae: "Кимхэ",
            gimcheon: "Кимчхон",
            geoje: "Кодже",
            gongju: "Конджу",
            gunpo: "Кунпхо",
            gunsan: "Кунсан",
            guri: "Кури",
            miryang: "Мирян",
            mokpo: "Мокпхо",
            mungyeong: "Мунгён",
            naju: "Наджу",
            namwon: "Намвон",
            namyangju: "Намъянджу",
            nonsan: "Нонсан",
            osan: "Осан",
            boryeong: "Порён",
            bucheon: "Пучхон",
            paju: "Пхаджу",
            pyeongtaek: "Пхёнтхэк",
            pocheon: "Пхочхон",
            samcheok: "Самчхок",
            sangju: "Санджу",
            sacheon: "Сачхон",
            siheung: "Сихын",
            seogwipo: "Согвипхо",
            sokcho: "Сокчхо",
            seosan: "Сосан",
            suncheon: "Сунчхон",
            dangjin: "Танджин",
            dongducheon: "Тондучхон",
            donghae: "Тонхэ",
            tongyeong: "Тхонъён",
            taebaek: "Тхэбэк",
            hanam: "Ханам",
            hwaseong: "Хвасон",
            jecheon: "Чечхон",
            jinju: "Чинджу",
            jinhae: "Чинхэ",
            jeongeup: "Чонып",
            cheonan: "Чхонан",
            chungju: "Чхунджу",
            chuncheon: "Чхунчхон",
            uiwang: "Ыйван",
            uijeongbu: "Ыйджонбу",
            yangju: "Янджу",
            yangsan: "Янсан"
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

function addOwnerMenuRow(container) {
    const row = document.createElement("div");
    row.className = "owner-cafe-menu-item-row";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "owner-cafe-menu-name";
    nameInput.placeholder = "Название";
    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.className = "owner-cafe-menu-price";
    priceInput.placeholder = "Цена, ₩";
    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.className = "owner-cafe-menu-category";
    categoryInput.placeholder = "Категория";
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "owner-cafe-menu-remove";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
        if (container.children.length > 1) {
            container.removeChild(row);
        } else {
            nameInput.value = "";
            priceInput.value = "";
            categoryInput.value = "";
        }
    });
    row.appendChild(nameInput);
    row.appendChild(priceInput);
    row.appendChild(categoryInput);
    row.appendChild(removeBtn);
    container.appendChild(row);
}

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

function initOwnerProfileSummary() {
    const summaryEl = document.getElementById("ownerProfileSummary");
    if (!summaryEl) {
        return;
    }
    const cafeForm = document.getElementById("ownerCafeForm");
    const cafesList = document.getElementById("ownerCafesList");
    const stickyBar = document.querySelector(".owner-mobile-sticky");
    const controls = [cafeForm, cafesList, stickyBar];
    function setOwnerControlsVisible(visible) {
        controls.forEach((el) => {
            if (!el) return;
            if (visible) {
                el.classList.remove("hidden");
            } else {
                el.classList.add("hidden");
            }
        });
    }
    if (!currentUser) {
        summaryEl.textContent =
            currentLang === "ru"
                ? "Войдите в аккаунт владельца, чтобы управлять кафе."
                : currentLang === "en"
                ? "Login as a cafe owner to manage your cafes."
                : "카페 사장님 계정으로 로그인하면 카페를 관리할 수 있습니다.";
        setOwnerControlsVisible(false);
        return;
    }
    const role = currentUser.role || "user";
    const name = currentUser.name || "";
    const phone = currentUser.phone || "";
    const email = currentUser.email || "";
    if (role !== "owner") {
        summaryEl.textContent =
            currentLang === "ru"
                ? "Ваш аккаунт пока не отмечен как владелец кафе."
                : currentLang === "en"
                ? "Your account is not marked as a cafe owner yet."
                : "현재 계정은 카페 사장님으로 등록되어 있지 않습니다.";
        setOwnerControlsVisible(false);
        return;
    }
    const parts = [];
    if (name) {
        parts.push(name);
    }
    if (email) {
        parts.push(email);
    }
    if (phone) {
        parts.push(phone);
    }
    summaryEl.textContent = parts.join(" · ");
    setOwnerControlsVisible(true);
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
    const adBanners = document.querySelectorAll(".ad-banner");
    const mainIntegration = document.getElementById("mainIntegrationAd");
    if (!adBanners.length && !mainIntegration) {
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
            adBanners.forEach((banner) => banner.classList.add("hidden"));
            if (mainIntegration) {
                mainIntegration.innerHTML = "";
            }
            return;
        }
        if (data.provider === "adsense" && data.adsenseClientId && data.adsenseSlotId) {
            const adsenseContainers = [];
            adBanners.forEach((banner) => {
                adsenseContainers.push(banner);
            });
            if (mainIntegration) {
                adsenseContainers.push(mainIntegration);
            }
            adsenseContainers.forEach((container) => {
                container.innerHTML = "";
                const ins = document.createElement("ins");
                ins.className = "adsbygoogle";
                ins.style.display = "block";
                ins.setAttribute("data-ad-client", data.adsenseClientId);
                ins.setAttribute("data-ad-slot", data.adsenseSlotId);
                ins.setAttribute("data-ad-format", "auto");
                ins.setAttribute("data-full-width-responsive", "true");
                container.appendChild(ins);
            });
            if (!window.adsbygoogle) {
                const s = document.createElement("script");
                s.async = true;
                s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(data.adsenseClientId);
                s.crossOrigin = "anonymous";
                document.head.appendChild(s);
                s.onload = () => {
                    try {
                        window.adsbygoogle = window.adsbygoogle || [];
                        adsenseContainers.forEach(() => {
                            window.adsbygoogle.push({});
                        });
                    } catch (e) {}
                };
            } else {
                try {
                    window.adsbygoogle = window.adsbygoogle || [];
                    adsenseContainers.forEach(() => {
                        window.adsbygoogle.push({});
                    });
                } catch (e) {}
            }
            return;
        }
        const feedAdsContainer = document.getElementById("feedAdsContainer");
        const firstBanner = adBanners[0];
        if (data.provider === "kakao" && data.kakaoUnitId && data.kakaoScriptUrl) {
            if (firstBanner) {
                firstBanner.innerHTML = "";
                const container = document.createElement("div");
                container.id = data.kakaoUnitId;
                firstBanner.appendChild(container);
            }
            const s = document.createElement("script");
            s.async = true;
            s.src = data.kakaoScriptUrl;
            document.head.appendChild(s);
            return;
        }
        if (data.provider === "naver" && data.naverUnitId && data.naverScriptUrl) {
            if (firstBanner) {
                firstBanner.innerHTML = "";
                const container = document.createElement("div");
                container.id = data.naverUnitId;
                firstBanner.appendChild(container);
            }
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
                    adBanners.forEach((banner) => banner.classList.add("hidden"));
                    if (feedAdsContainer) {
                        feedAdsContainer.innerHTML = "";
                    }
                    if (mainIntegration) {
                        mainIntegration.innerHTML = "";
                    }
                    return;
                }
                const mainBanner = firstBanner || null;
                if (mainBanner) {
                    mainBanner.innerHTML = "";
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
                    mainBanner.appendChild(list);
                }
                if (feedAdsContainer) {
                    feedAdsContainer.innerHTML = "";
                    ads.slice(0, 3).forEach((ad) => {
                        const item = document.createElement("div");
                        item.className = "feed-ad-item";
                        item.textContent = ad.title || "";
                        feedAdsContainer.appendChild(item);
                    });
                }
                if (mainIntegration) {
                    mainIntegration.innerHTML = "";
                    const mainAd = ads[0];
                    if (mainAd) {
                        const wrapper = document.createElement("div");
                        wrapper.className = "ad-local-item";
                        const title = document.createElement("div");
                        title.className = "ad-local-title";
                        title.textContent = mainAd.title || "";
                        const text = document.createElement("div");
                        text.className = "ad-local-text";
                        text.textContent = mainAd.text || "";
                        wrapper.appendChild(title);
                        wrapper.appendChild(text);
                        if (mainAd.url) {
                            wrapper.addEventListener("click", () => {
                                window.open(mainAd.url, "_blank");
                            });
                            wrapper.classList.add("ad-local-clickable");
                        }
                        mainIntegration.appendChild(wrapper);
                    }
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
        const sliced = items.slice(0, 5);
        listEl.innerHTML = "";
        sliced.forEach((item) => {
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
    try {
        const res = await fetch(
            "/api/cafes" +
                (currentCityCode ? "?city=" + encodeURIComponent(currentCityCode) : "")
        );
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const cafes = data && Array.isArray(data.cafes) ? data.cafes : [];
        currentFeedCafes = cafes;
        const config = translations[currentLang] || translations.ko;
        if (listEl) {
            listEl.innerHTML = "";
        }
        cafes.slice(0, 10).forEach((cafe) => {
            if (!listEl) {
                return;
            }
            const item = document.createElement("div");
            item.className = "feed-cafe-item";

            const thumbWrap = document.createElement("div");
            thumbWrap.className = "feed-cafe-thumb";

            const photos = Array.isArray(cafe.photos) ? cafe.photos : [];
            if (photos.length) {
                const lastPhoto = photos[photos.length - 1];
                if (lastPhoto && lastPhoto.url) {
                    const img = document.createElement("img");
                    img.src = lastPhoto.url;
                    img.alt = cafe.name || "";
                    thumbWrap.appendChild(img);
                }
            }

            const info = document.createElement("div");
            info.className = "feed-cafe-info";

            const nameEl = document.createElement("div");
            nameEl.className = "feed-cafe-name";
            nameEl.textContent = cafe.name || "";

            const cityCode = cafe.cityCode || "";
            const cityName =
                (config &&
                    config.cities &&
                    cityCode &&
                    config.cities[cityCode]) ||
                cityCode ||
                "";
            const cityEl = document.createElement("div");
            cityEl.className = "feed-cafe-city";
            cityEl.textContent = cityName;

            const addressEl = document.createElement("div");
            addressEl.className = "feed-cafe-address";
            addressEl.textContent = cafe.address || "";

            const metaEl = document.createElement("div");
            metaEl.className = "feed-cafe-meta";
            if (typeof cafe.subscribersCount === "number") {
                if (currentLang === "ru") {
                    metaEl.textContent = "Подписчики: " + cafe.subscribersCount;
                } else if (currentLang === "en") {
                    metaEl.textContent = "Subscribers: " + cafe.subscribersCount;
                } else {
                    metaEl.textContent = "구독자: " + cafe.subscribersCount;
                }
            }

            info.appendChild(nameEl);
            if (cityName) {
                info.appendChild(cityEl);
            }
            if (cafe.address) {
                info.appendChild(addressEl);
            }
            if (metaEl.textContent) {
                info.appendChild(metaEl);
            }

            item.appendChild(thumbWrap);
            item.appendChild(info);

            item.addEventListener("click", () => {
                if (cafe && cafe._id) {
                    window.location.href = "/cafe/" + encodeURIComponent(cafe._id);
                } else {
                    openCafePage(cafe);
                }
            });

            listEl.appendChild(item);
        });
        updateSearchResults("");
    } catch (e) {
    }
}

async function loadPromoPosts() {
    const block = document.getElementById("promoPostsBlock");
    if (!block) {
        return;
    }
    block.innerHTML = "";
    try {
        const res = await fetch(
            "/api/promo-posts" +
                (currentCityCode ? "?city=" + encodeURIComponent(currentCityCode) : "")
        );
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const posts = data && Array.isArray(data.posts) ? data.posts : [];
        if (!posts.length) {
            return;
        }
        posts.forEach((post) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "promo-post-chip";
            const cafeName = post.cafeName || "";
            const text = post.text || "";
            const shortText = text.length > 40 ? text.slice(0, 37) + "..." : text;
            chip.textContent = cafeName ? cafeName + ": " + shortText : shortText;
            chip.addEventListener("click", async () => {
                if (!post.cafe) {
                    return;
                }
                try {
                    const resCafe = await fetch(
                        "/api/cafes?id=" + encodeURIComponent(post.cafe)
                    );
                    if (!resCafe.ok) {
                        return;
                    }
                    const cafeData = await resCafe.json();
                    if (cafeData && cafeData.cafe) {
                        const cafe = cafeData.cafe;
                        if (cafe.cityCode) {
                            setCurrentCity(cafe.cityCode);
                        }
                        openCafePage(cafe);
                    }
                } catch (e) {
                }
            });
            block.appendChild(chip);
        });
    } catch (e) {
    }
}

function updateSearchResults(term) {
    const container = document.getElementById("searchResults");
    const list = document.getElementById("searchResultsList");
    if (!container || !list) {
        return;
    }
    const raw = term || "";
    const value = raw.toLowerCase().trim();
    const tokens = value
        ? value
              .split(/[,\s]+/)
              .map((t) => t.trim())
              .filter((t) => t.length > 0)
        : [];
    const cafesSource = Array.isArray(currentFeedCafes) ? currentFeedCafes : [];
    const config = translations[currentLang] || translations.ko;
    const citiesConfig = (config && config.cities) || {};
    const matches = cafesSource.filter((cafe) => {
        if (cafe.cityCode && currentCityCode && cafe.cityCode !== currentCityCode) {
            return false;
        }
        if (!tokens.length) {
            return true;
        }
        const cityCode = cafe.cityCode || "";
        const cityName =
            (cityCode && citiesConfig[cityCode]) || cityCode || "";
        const haystack = (
            (cafe.name || "") +
            " " +
            (cityName || "") +
            " " +
            (cafe.address || "")
        ).toLowerCase();
        return tokens.some((t) => haystack.includes(t));
    });
    list.innerHTML = "";
    if (!matches.length) {
        if (!tokens.length) {
            container.classList.add("hidden");
            return;
        }
        const query = raw.trim();
        let message = "";
        if (currentLang === "ru") {
            message = 'Нет информации по запросу "' + query + '"';
        } else if (currentLang === "en") {
            message = 'No results for "' + query + '"';
        } else {
            message = '"' + query + '"에 대한 검색 결과가 없습니다.';
        }
        const item = document.createElement("div");
        item.className = "search-result-item";
        item.textContent = message;
        item.style.cursor = "default";
        list.appendChild(item);
        container.classList.remove("hidden");
        return;
    }
    matches.slice(0, 10).forEach((cafe) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "search-result-item";
        const cityCode = cafe.cityCode || "";
        const cityName =
            (cityCode && citiesConfig[cityCode]) || cityCode || "";
        let label = cafe.name || "";
        if (cityName) {
            label += " · " + cityName;
        }
        btn.textContent = label;
        btn.addEventListener("click", () => {
            if (cafe && cafe._id) {
                window.location.href = "/cafe/" + encodeURIComponent(cafe._id);
            } else {
                openCafePage(cafe);
            }
        });
        list.appendChild(btn);
    });
    container.classList.remove("hidden");
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
        const adminEmailInput = document.getElementById("adminContactEmail");
        const adminTelegramInput = document.getElementById("adminTelegramUrl");
        const adminInstagramInput = document.getElementById("adminInstagramUrl");
        if (adminEmailInput) {
            adminEmailInput.value = data.contactEmail || "";
        }
        if (adminTelegramInput) {
            adminTelegramInput.value = data.telegramUrl || "";
        }
        if (adminInstagramInput) {
            adminInstagramInput.value = data.instagramUrl || "";
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
    const ownerPanel = document.getElementById("ownerPanel");
    const adminPanel = document.getElementById("adminPanel");
    const subscriptionsList = document.getElementById("profileSubscriptionsList");
    const profilePhoneEl = document.getElementById("profilePhone");
    const headerAuthBtn = document.getElementById("btnOpenAuth");
    const ownerDashboardBtn = document.getElementById("btnOwnerDashboard");
    const adminDashboardBtn = document.getElementById("btnAdminDashboard");
    if (!statusEl) {
        return;
    }
    if (!currentUser) {
        statusEl.textContent = currentLang === "ru" ? "Вы не авторизованы." :
            currentLang === "en" ? "You are not logged in." : "로그인하지 않았습니다.";
        if (btnBecomeOwner) btnBecomeOwner.classList.add("hidden");
        if (ownerPanel) ownerPanel.classList.add("hidden");
        if (adminPanel) adminPanel.classList.add("hidden");
        if (subscriptionsList) subscriptionsList.innerHTML = "";
        if (profilePhoneEl) {
            profilePhoneEl.textContent = "";
        }
        if (headerAuthBtn) {
            const cfg = translations[currentLang] || translations.ko;
            if (cfg && cfg.ui && cfg.ui.login) {
                headerAuthBtn.textContent = cfg.ui.login;
            } else {
                headerAuthBtn.textContent = "Login";
            }
        }
        if (ownerDashboardBtn) {
            ownerDashboardBtn.classList.add("hidden");
        }
        if (adminDashboardBtn) {
            adminDashboardBtn.classList.add("hidden");
        }
        return;
    }
    const role = currentUser.role || "user";
    const name = currentUser.name || "";
    if (currentLang === "ru") {
        statusEl.textContent = "Привет, " + name + ". Роль: " + role + ".";
    } else if (currentLang === "en") {
        statusEl.textContent = "Hello, " + name + ". Role: " + role + ".";
    } else {
        statusEl.textContent = "안녕하세요, " + name + "님. 역할: " + role + ".";
    }
    if (btnBecomeOwner) {
        if (role === "owner") {
            btnBecomeOwner.classList.add("hidden");
        } else {
            btnBecomeOwner.classList.remove("hidden");
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
        if (currentUser.isAdmin && window.location.pathname === "/") {
            adminPanel.classList.remove("hidden");
        } else {
            adminPanel.classList.add("hidden");
        }
    }
    if (ownerDashboardBtn) {
        if (role === "owner") {
            ownerDashboardBtn.classList.remove("hidden");
        } else {
            ownerDashboardBtn.classList.add("hidden");
        }
    }
    if (adminDashboardBtn) {
        if (currentUser.isAdmin) {
            adminDashboardBtn.classList.remove("hidden");
        } else {
            adminDashboardBtn.classList.add("hidden");
        }
    }
    if (profilePhoneEl) {
        const phone = currentUser.phone || currentUser.phoneNumber || "";
        if (phone) {
            if (currentLang === "ru") {
                profilePhoneEl.textContent = "Телефон: " + phone;
            } else if (currentLang === "en") {
                profilePhoneEl.textContent = "Phone: " + phone;
            } else {
                profilePhoneEl.textContent = "전화번호: " + phone;
            }
        } else {
            profilePhoneEl.textContent = "";
        }
    }
    if (headerAuthBtn) {
        let label = "";
        if (name) {
            const parts = String(name).split(/\s+/).filter(Boolean);
            label = parts.length ? parts[0] : name;
        }
        if (!label) {
            const phone = currentUser.phone || currentUser.phoneNumber || "";
            if (phone) {
                label = phone;
            }
        }
        if (!label) {
            if (currentLang === "ru") {
                label = "Профиль";
            } else if (currentLang === "en") {
                label = "Profile";
            } else {
                label = "프로필";
            }
        }
        headerAuthBtn.textContent = label;
    }
    if (subscriptionsList) {
        loadMySubscriptions();
    }
}

async function loadMySubscriptions() {
    const listEl = document.getElementById("profileSubscriptionsList");
    if (!listEl || !authToken) {
        return;
    }
    try {
        const res = await fetch("/api/my/subscriptions", {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const items = data && data.subscriptions ? data.subscriptions : [];
        listEl.innerHTML = "";
        items.forEach((sub) => {
            const cafe = sub.cafe || {};
            const div = document.createElement("div");
            div.className = "profile-subscription-item";
            const name = cafe.name || "";
            const cityCode = cafe.cityCode || "";
            const address = cafe.address || "";
            const parts = [];
            if (name) {
                parts.push(name);
            }
            if (cityCode) {
                parts.push("(" + cityCode + ")");
            }
            if (address) {
                parts.push(address);
            }
            div.textContent = parts.join(" ");
            listEl.appendChild(div);
        });
    } catch (e) {
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

const provinceCityMap = {
    capital: [
        "seoul",
        "incheon",
        "suwon",
        "seongnam",
        "goyang",
        "yongin",
        "ansan",
        "anseong",
        "anyang",
        "icheon",
        "gwangju_gg",
        "gwangmyeong",
        "gwacheon",
        "gimpo",
        "gunpo",
        "guri",
        "namyangju",
        "osan",
        "bucheon",
        "paju",
        "pyeongtaek",
        "pocheon",
        "siheung",
        "dongducheon",
        "hanam",
        "hwaseong",
        "uiwang",
        "uijeongbu",
        "yangju"
    ],
    yeongnam: [
        "busan",
        "daegu",
        "ulsan",
        "changwon",
        "pohang",
        "gumi",
        "andong",
        "yeongju",
        "yeongcheon",
        "gyeongju",
        "gyeongsan",
        "gimcheon",
        "mungyeong",
        "sangju",
        "miryang",
        "sacheon",
        "gimhae",
        "geoje",
        "jinju",
        "jinhae",
        "tongyeong",
        "yangsan"
    ],
    honam: [
        "gwangju",
        "jeonju",
        "iksan",
        "gimje",
        "gunsan",
        "namwon",
        "jeongeup",
        "yeosu",
        "gwangyang",
        "mokpo",
        "naju",
        "suncheon"
    ],
    chungcheong: [
        "daejeon",
        "cheongju",
        "asan",
        "gyeryong",
        "gongju",
        "nonsan",
        "boryeong",
        "seosan",
        "dangjin",
        "cheonan",
        "jecheon",
        "chungju"
    ],
    jeju_region: [
        "jeju",
        "seogwipo",
        "gangneung",
        "wonju",
        "samcheok",
        "sokcho",
        "donghae",
        "taebaek",
        "chuncheon"
    ]
};

function resolveCityCodeFromInput(value) {
    if (!value) {
        return "";
    }
    const trimmed = String(value).trim();
    if (!trimmed) {
        return "";
    }
    const lower = trimmed.toLowerCase();
    for (const langKey of Object.keys(translations)) {
        const cfg = translations[langKey];
        if (!cfg || !cfg.cities) {
            continue;
        }
        const entries = Object.entries(cfg.cities);
        for (let i = 0; i < entries.length; i++) {
            const code = entries[i][0];
            const label = entries[i][1];
            if (typeof label === "string" && label.toLowerCase() === lower) {
                return code;
            }
        }
    }
    const currentCfg = translations[currentLang];
    if (currentCfg && currentCfg.cities && currentCfg.cities[trimmed]) {
        return trimmed;
    }
    return trimmed;
}

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
    const subtitle = document.getElementById("registerSubtitle");
    if (!modal || !userTypeInput || !title) return;
    if (type === "owner" || type === "user") {
        userTypeInput.value = type;
    } else {
        userTypeInput.value = "user";
    }
    if (currentLang === "ko") {
        title.textContent = type === "owner" ? "카페 사장님 회원가입" : "일반 회원가입";
        if (subtitle) {
            subtitle.textContent =
                type === "owner"
                    ? "카페 페이지를 만들고 손님들과 소통해 보세요."
                    : "좋아하는 카페를 구독하고 소식을 받아보세요.";
        }
    } else if (currentLang === "en") {
        title.textContent = type === "owner" ? "Sign up (Cafe owner)" : "Sign up (Guest)";
        if (subtitle) {
            subtitle.textContent =
                type === "owner"
                    ? "Create a cafe page and talk with your guests."
                    : "Follow cafes you love and read their updates.";
        }
    } else {
        title.textContent = type === "owner" ? "Регистрация владельца кафе" : "Регистрация гостя";
        if (subtitle) {
            subtitle.textContent =
                type === "owner"
                    ? "Добавьте своё кафе и общайтесь с гостями в ленте."
                    : "Подписывайтесь на кафе и делитесь впечатлениями.";
        }
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
    if (!id) {
        return;
    }
    openCafeModal({ _id: id });
}

async function openCafeModal(cafe) {
    const modal = document.getElementById("cafeModal");
    const titleEl = document.getElementById("cafeModalTitle");
    const metaEl = document.getElementById("cafeModalMeta");
    const subscribeBtn = document.getElementById("btnCafeSubscribe");
    const postsList = document.getElementById("cafePostsList");
    const descriptionEl = document.getElementById("cafeModalDescription");
    const bookingInfoEl = document.getElementById("cafeBookingInfo");
    if (!modal || !titleEl || !metaEl || !subscribeBtn || !postsList) {
        return;
    }
    const cafeId = cafe && cafe._id ? cafe._id : null;
    if (!cafeId) {
        return;
    }
    currentCafeId = cafeId;
    currentCafeContact = {
        name: cafe.name || "",
        phone: cafe.phone || "",
        address: cafe.address || ""
    };
    currentCafePostsOffset = 0;
    currentCafePostsHasMore = false;
    const parts = [];
    if (cafe.name) {
        titleEl.textContent = cafe.name;
    } else {
        titleEl.textContent = "Cafe";
    }
    const config = translations[currentLang] || translations.ko;
    if (cafe.cityCode) {
        const cityCode = cafe.cityCode;
        const readableCity =
            config &&
            config.cities &&
            cityCode &&
            config.cities[cityCode]
                ? config.cities[cityCode]
                : cityCode;
        parts.push(readableCity);
    }
    if (cafe.address) {
        parts.push(cafe.address);
    }
    metaEl.textContent = parts.join(" · ");
    if (descriptionEl) {
        descriptionEl.textContent = cafe.description || "";
    }
    if (bookingInfoEl) {
        bookingInfoEl.textContent = "";
    }
    if (authToken) {
        subscribeBtn.disabled = false;
    } else {
        subscribeBtn.disabled = false;
    }
    await updateCafeSubscribersCount();
    await loadCafePosts(true);
    modal.style.display = "block";
}

async function openCafePage(cafe) {
    const panel = document.getElementById("cafeDetailPanel");
    const nameEl = document.getElementById("cafeDetailName");
    const metaEl = document.getElementById("cafeDetailMeta");
    const descEl = document.getElementById("cafeDetailDescription");
    const openingEl = document.getElementById("cafeDetailOpeningHours");
    const avgEl = document.getElementById("cafeDetailAverageCheck");
    const menuEl = document.getElementById("cafeDetailMenu");
    if (!panel || !nameEl || !metaEl || !descEl || !openingEl || !avgEl) {
        return;
    }
    const cafeId = cafe && cafe._id ? cafe._id : null;
    if (!cafeId) {
        return;
    }
    currentCafeId = cafeId;
    currentCafeContact = {
        name: cafe.name || "",
        phone: cafe.phone || "",
        address: cafe.address || ""
    };
    currentCafePostsOffset = 0;
    currentCafePostsHasMore = false;
    const cafeName = cafe.name || "Cafe";
    nameEl.textContent = cafeName;
    const config = translations[currentLang] || translations.ko;
    const parts = [];
    if (cafe.cityCode) {
        const cityCode = cafe.cityCode;
        const readableCity =
            config &&
            config.cities &&
            cityCode &&
            config.cities[cityCode]
                ? config.cities[cityCode]
                : cityCode;
        parts.push(readableCity);
    }
    if (cafe.address) {
        parts.push(cafe.address);
    }
    const metaText = parts.join(" · ");
    metaEl.textContent = metaText;
    const descriptionText = cafe.description || "";
    descEl.textContent = descriptionText;
    const baseTitle = "CoffeBooking";
    if (typeof document !== "undefined") {
        const titleParts = [cafeName];
        if (metaText) {
            titleParts.push(metaText);
        }
        titleParts.push(baseTitle);
        document.title = titleParts.join(" · ");
        const descMeta =
            document.querySelector('meta[name="description"]') ||
            document.createElement("meta");
        descMeta.setAttribute("name", "description");
        const descContent =
            descriptionText ||
            (metaText
                ? cafeName + " — " + metaText
                : cafeName + " — кафе в Корее на платформе CoffeBooking");
        descMeta.setAttribute("content", descContent);
        if (!descMeta.parentNode && document.head) {
            document.head.appendChild(descMeta);
        }
        const urlMeta =
            document.querySelector('meta[property="og:url"]') ||
            document.createElement("meta");
        urlMeta.setAttribute("property", "og:url");
        urlMeta.setAttribute("content", window.location.href);
        if (!urlMeta.parentNode && document.head) {
            document.head.appendChild(urlMeta);
        }
        const ogTitleMeta =
            document.querySelector('meta[property="og:title"]') ||
            document.createElement("meta");
        ogTitleMeta.setAttribute("property", "og:title");
        ogTitleMeta.setAttribute("content", cafeName + " · " + baseTitle);
        if (!ogTitleMeta.parentNode && document.head) {
            document.head.appendChild(ogTitleMeta);
        }
        const ogDescMeta =
            document.querySelector('meta[property="og:description"]') ||
            document.createElement("meta");
        ogDescMeta.setAttribute("property", "og:description");
        ogDescMeta.setAttribute("content", descContent);
        if (!ogDescMeta.parentNode && document.head) {
            document.head.appendChild(ogDescMeta);
        }
        const ogImageMeta =
            document.querySelector('meta[property="og:image"]') ||
            document.createElement("meta");
        ogImageMeta.setAttribute("property", "og:image");
        const photos = Array.isArray(cafe.photos) ? cafe.photos : [];
        if (photos.length && photos[0].url) {
            ogImageMeta.setAttribute("content", photos[0].url);
        } else {
            ogImageMeta.setAttribute("content", "");
        }
        if (!ogImageMeta.parentNode && document.head) {
            document.head.appendChild(ogImageMeta);
        }
    }
    const hoursText = formatCafeOpeningHours(cafe.openingHours);
    if (hoursText) {
        if (currentLang === "ru") {
            openingEl.textContent = "Часы работы: " + hoursText;
        } else if (currentLang === "en") {
            openingEl.textContent = "Opening hours: " + hoursText;
        } else {
            openingEl.textContent = "영업 시간: " + hoursText;
        }
    } else {
        openingEl.textContent = "";
    }
    if (typeof cafe.averageCheck === "number" && cafe.averageCheck > 0) {
        const value = cafe.averageCheck;
        if (currentLang === "ru") {
            avgEl.textContent = "Средний чек: " + value + "₩";
        } else if (currentLang === "en") {
            avgEl.textContent = "Average bill: " + value + "₩";
        } else {
            avgEl.textContent = "평균 객단가: " + value + "₩";
        }
    } else {
        avgEl.textContent = "";
    }
    const pageBookingInfo = document.getElementById("cafePageBookingInfo");
    if (pageBookingInfo) {
        pageBookingInfo.textContent = "";
    }
    const detailCountEl = document.getElementById("cafePageSubscribersCount");
    if (detailCountEl) {
        detailCountEl.textContent = "";
    }
    if (menuEl) {
        menuEl.innerHTML = "";
        const items = Array.isArray(cafe.menu) ? cafe.menu : [];
        if (items.length) {
            const track = document.createElement("div");
            track.className = "cafe-menu-carousel-track";
            items.forEach((item) => {
                const row = document.createElement("div");
                row.className = "cafe-detail-menu-item cafe-menu-card";
                const title = document.createElement("div");
                title.className = "cafe-detail-menu-title";
                title.textContent = item.name || "";
                const meta = document.createElement("div");
                meta.className = "cafe-detail-menu-meta";
                const parts = [];
                if (typeof item.price === "number") {
                    parts.push(item.price + "₩");
                }
                if (item.category) {
                    parts.push(item.category);
                }
                meta.textContent = parts.join(" · ");
                row.appendChild(title);
                if (meta.textContent) {
                    row.appendChild(meta);
                }
                track.appendChild(row);
            });
            menuEl.appendChild(track);
            if (items.length > 1) {
                const controls = document.createElement("div");
                controls.className = "cafe-menu-carousel-controls";
                const prevBtn = document.createElement("button");
                prevBtn.type = "button";
                prevBtn.className = "btn btn-outline btn-small cafe-menu-prev";
                prevBtn.textContent = "‹";
                const nextBtn = document.createElement("button");
                nextBtn.type = "button";
                nextBtn.className = "btn btn-outline btn-small cafe-menu-next";
                nextBtn.textContent = "›";
                const scrollAmount = 180;
                prevBtn.addEventListener("click", () => {
                    track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                });
                nextBtn.addEventListener("click", () => {
                    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
                });
                controls.appendChild(prevBtn);
                controls.appendChild(nextBtn);
                menuEl.appendChild(controls);
            }
        } else {
            if (currentLang === "ru") {
                menuEl.textContent = "Меню этого кафе появится здесь. Попросите владельца заполнить его.";
            } else if (currentLang === "en") {
                menuEl.textContent = "Cafe menu will be shown here once the owner adds it.";
            } else {
                menuEl.textContent = "사장님이 메뉴를 추가하면 이곳에 표시됩니다.";
            }
        }
    }
    panel.classList.remove("hidden");
    await updateCafeSubscribersCount();
    await loadCafePosts(true);
}

function formatCafeOpeningHours(raw) {
    if (!raw) {
        return "";
    }
    if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            try {
                const obj = JSON.parse(trimmed);
                const daysOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
                const config = translations[currentLang] || translations.ko;
                const daysNames = (config && config.days) || {};
                const parts = [];
                daysOrder.forEach((code) => {
                    const value = obj[code];
                    if (!value) {
                        return;
                    }
                    const label = daysNames[code] || code;
                    parts.push(label + ": " + value);
                });
                if (parts.length) {
                    return parts.join(" · ");
                }
            } catch (e) {
            }
        }
        return trimmed;
    }
    if (typeof raw === "object" && raw) {
        const daysOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const config = translations[currentLang] || translations.ko;
        const daysNames = (config && config.days) || {};
        const parts = [];
        daysOrder.forEach((code) => {
            const value = raw[code];
            if (!value) {
                return;
            }
            const label = daysNames[code] || code;
            parts.push(label + ": " + value);
        });
        return parts.join(" · ");
    }
    return "";
}

async function updateCafeSubscribersCount() {
    const modalEl = document.getElementById("cafeSubscribersCount");
    const pageEl = document.getElementById("cafePageSubscribersCount");
    if (!currentCafeId || (!modalEl && !pageEl)) {
        return;
    }
    try {
        const res = await fetch(
            "/api/cafes/" + encodeURIComponent(currentCafeId) + "/subscribers"
        );
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const count =
            data && typeof data.count === "number"
                ? data.count
                : 0;
        let text = "";
        if (currentLang === "ru") {
            text = "Подписчики: " + count;
        } else if (currentLang === "en") {
            text = "Subscribers: " + count;
        } else {
            text = "구독자: " + count;
        }
        if (modalEl) {
            modalEl.textContent = text;
        }
        if (pageEl) {
            pageEl.textContent = text;
        }
    } catch (e) {
    }
}

async function loadCafePosts(reset = true) {
    const modalList = document.getElementById("cafePostsList");
    const pageList = document.getElementById("cafePagePostsList");
    const targets = [];
    if (modalList) targets.push(modalList);
    if (pageList) targets.push(pageList);
    if (!targets.length || !currentCafeId) {
        return;
    }
    if (reset) {
        currentCafePostsOffset = 0;
        currentCafePostsHasMore = false;
        targets.forEach((t) => {
            t.innerHTML = "";
        });
    }
    try {
        const res = await fetch(
            "/api/cafes/" +
                encodeURIComponent(currentCafeId) +
                "/posts?limit=" +
                encodeURIComponent(CAFE_POSTS_PAGE_SIZE) +
                "&offset=" +
                encodeURIComponent(currentCafePostsOffset)
        );
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const posts = data && data.posts ? data.posts : [];
        currentCafePostsHasMore = !!data.hasMore;
        currentCafePostsOffset += posts.length;
        posts.forEach((post) => {
            const item = document.createElement("div");
            item.className = "cafe-post-item";

            const textEl = document.createElement("div");
            textEl.className = "cafe-post-text";
            textEl.textContent = post.text || "";

            const photosWrap = document.createElement("div");
            photosWrap.className = "cafe-post-photos";
            const photos = Array.isArray(post.photos) ? post.photos : [];
            photos.forEach((p) => {
                if (p && p.url) {
                    const img = document.createElement("img");
                    img.src = p.url;
                    img.alt = "";
                    photosWrap.appendChild(img);
                }
            });

            const metaRow = document.createElement("div");
            metaRow.className = "cafe-post-meta";
            const parts = [];
            const created = post.createdAt ? new Date(post.createdAt) : null;
            if (created && !Number.isNaN(created.getTime())) {
                parts.push(created.toLocaleString());
            }
            if (typeof post.likesCount === "number") {
                parts.push(
                    (currentLang === "ru"
                        ? "Лайки: "
                        : currentLang === "en"
                        ? "Likes: "
                        : "좋아요: ") + post.likesCount
                );
            }
            if (typeof post.rating === "number" && post.rating > 0) {
                parts.push(
                    (currentLang === "ru"
                        ? "Рейтинг: "
                        : currentLang === "en"
                        ? "Rating: "
                        : "평점: ") + post.rating
                );
            }
            metaRow.textContent = parts.join(" · ");

            const actionsRow = document.createElement("div");
            actionsRow.className = "cafe-post-actions";

            if (currentUser && currentUser.role === "owner") {
                const ownerControls = document.createElement("div");
                ownerControls.className = "cafe-post-owner-controls";

                const priorityLabel = document.createElement("span");
                priorityLabel.textContent =
                    currentLang === "ru"
                        ? "Приоритет:"
                        : currentLang === "en"
                        ? "Priority:"
                        : "우선순위:";

                const priorityInput = document.createElement("input");
                priorityInput.type = "number";
                priorityInput.className = "cafe-post-priority-input";
                priorityInput.value =
                    typeof post.priority === "number" ? String(post.priority) : "0";

                const promoteToggle = document.createElement("button");
                promoteToggle.type = "button";
                promoteToggle.className = "btn btn-outline btn-small";
                const updatePromoteLabel = () => {
                    promoteToggle.textContent =
                        currentLang === "ru"
                            ? post.isPromoted
                                ? "Снять рекламу"
                                : "Продвинуть"
                            : currentLang === "en"
                            ? post.isPromoted
                                ? "Unpromote"
                                : "Promote"
                            : post.isPromoted
                            ? "광고 해제"
                            : "광고 승격";
                };
                updatePromoteLabel();

                promoteToggle.addEventListener("click", async () => {
                    if (!authToken || !currentCafeId) return;
                    try {
                        const resUpdate = await fetch(
                            "/api/cafes/" +
                                encodeURIComponent(currentCafeId) +
                                "/posts/" +
                                encodeURIComponent(post._id),
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + authToken
                                },
                                body: JSON.stringify({ isPromoted: !post.isPromoted })
                            }
                        );
                        if (!resUpdate.ok) {
                            return;
                        }
                        await loadCafePosts(true);
                    } catch (e) {
                    }
                });

                const savePriorityBtn = document.createElement("button");
                savePriorityBtn.type = "button";
                savePriorityBtn.className = "btn btn-outline btn-small";
                savePriorityBtn.textContent =
                    currentLang === "ru"
                        ? "Сохранить приоритет"
                        : currentLang === "en"
                        ? "Save priority"
                        : "우선순위 저장";
                savePriorityBtn.addEventListener("click", async () => {
                    if (!authToken || !currentCafeId) return;
                    const val = Number(priorityInput.value);
                    if (!Number.isFinite(val)) {
                        return;
                    }
                    try {
                        const resUpdate = await fetch(
                            "/api/cafes/" +
                                encodeURIComponent(currentCafeId) +
                                "/posts/" +
                                encodeURIComponent(post._id),
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + authToken
                                },
                                body: JSON.stringify({ priority: val })
                            }
                        );
                        if (!resUpdate.ok) {
                            return;
                        }
                        await loadCafePosts(true);
                    } catch (e) {
                    }
                });

                const deleteBtn = document.createElement("button");
                deleteBtn.type = "button";
                deleteBtn.className = "btn btn-outline btn-small";
                deleteBtn.textContent =
                    currentLang === "ru"
                        ? "Удалить"
                        : currentLang === "en"
                        ? "Delete"
                        : "삭제";
                deleteBtn.addEventListener("click", async () => {
                    if (!authToken || !currentCafeId) return;
                    const confirmText =
                        currentLang === "ru"
                            ? "Удалить этот пост?"
                            : currentLang === "en"
                            ? "Delete this post?"
                            : "이 게시글을 삭제하시겠습니까?";
                    if (!window.confirm(confirmText)) {
                        return;
                    }
                    try {
                        const resDel = await fetch(
                            "/api/cafes/" +
                                encodeURIComponent(currentCafeId) +
                                "/posts/" +
                                encodeURIComponent(post._id),
                            {
                                method: "DELETE",
                                headers: {
                                    Authorization: "Bearer " + authToken
                                }
                            }
                        );
                        if (!resDel.ok) {
                            return;
                        }
                        await loadCafePosts(true);
                    } catch (e) {
                    }
                });

                ownerControls.appendChild(priorityLabel);
                ownerControls.appendChild(priorityInput);
                ownerControls.appendChild(savePriorityBtn);
                ownerControls.appendChild(promoteToggle);
                ownerControls.appendChild(deleteBtn);
                actionsRow.appendChild(ownerControls);
            }

            const likeBtn = document.createElement("button");
            likeBtn.type = "button";
            likeBtn.className = "btn btn-secondary btn-small";
            likeBtn.textContent =
                currentLang === "ru"
                    ? "Лайк"
                    : currentLang === "en"
                    ? "Like"
                    : "좋아요";
            likeBtn.addEventListener("click", async () => {
                if (!authToken) {
                    alert(
                        currentLang === "ru"
                            ? "Сначала войдите"
                            : currentLang === "en"
                            ? "Please login first"
                            : "먼저 로그인하세요."
                    );
                    return;
                }
                try {
                    const resLike = await fetch(
                        "/api/cafes/" +
                            encodeURIComponent(currentCafeId) +
                            "/posts/" +
                            encodeURIComponent(post._id) +
                            "/like",
                        {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer " + authToken
                            }
                        }
                    );
                    if (!resLike.ok) {
                        return;
                    }
                    await loadCafePosts(true);
                } catch (e) {
                }
            });

            const ratingInput = document.createElement("input");
            ratingInput.type = "number";
            ratingInput.min = "1";
            ratingInput.max = "5";
            ratingInput.value = "5";
            ratingInput.className = "cafe-post-rating-input";

            const rateBtn = document.createElement("button");
            rateBtn.type = "button";
            rateBtn.className = "btn btn-secondary btn-small";
            rateBtn.textContent =
                currentLang === "ru"
                    ? "Оценить"
                    : currentLang === "en"
                    ? "Rate"
                    : "평가하기";
            rateBtn.addEventListener("click", async () => {
                if (!authToken) {
                    alert(
                        currentLang === "ru"
                            ? "Сначала войдите"
                            : currentLang === "en"
                            ? "Please login first"
                            : "먼저 로그인하세요."
                    );
                    return;
                }
                const value = Number(ratingInput.value);
                if (!Number.isFinite(value) || value < 1 || value > 5) {
                    return;
                }
                try {
                    const resRate = await fetch(
                        "/api/cafes/" +
                            encodeURIComponent(currentCafeId) +
                            "/posts/" +
                            encodeURIComponent(post._id) +
                            "/rate",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + authToken
                            },
                            body: JSON.stringify({ rating: value })
                        }
                    );
                    if (!resRate.ok) {
                        return;
                    }
                    await loadCafePosts(true);
                } catch (e) {
                }
            });

            const commentInput = document.createElement("input");
            commentInput.type = "text";
            commentInput.className = "cafe-post-comment-input";
            if (currentLang === "ru") {
                commentInput.placeholder = "Комментарий";
            } else if (currentLang === "en") {
                commentInput.placeholder = "Comment";
            } else {
                commentInput.placeholder = "댓글";
            }

            const commentBtn = document.createElement("button");
            commentBtn.type = "button";
            commentBtn.className = "btn btn-secondary btn-small";
            commentBtn.textContent =
                currentLang === "ru"
                    ? "Отправить"
                    : currentLang === "en"
                    ? "Send"
                    : "전송";
            commentBtn.addEventListener("click", async () => {
                if (!authToken) {
                    alert(
                        currentLang === "ru"
                            ? "Сначала войдите"
                            : currentLang === "en"
                            ? "Please login first"
                            : "먼저 로그인하세요."
                    );
                    return;
                }
                const text = commentInput.value.trim();
                if (!text) {
                    return;
                }
                try {
                    const resComment = await fetch(
                        "/api/cafes/" +
                            encodeURIComponent(currentCafeId) +
                            "/posts/" +
                            encodeURIComponent(post._id) +
                            "/comment",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + authToken
                            },
                            body: JSON.stringify({ text })
                        }
                    );
                    if (!resComment.ok) {
                        return;
                    }
                    commentInput.value = "";
                    await loadCafePosts(true);
                } catch (e) {
                }
            });

            actionsRow.appendChild(likeBtn);
            actionsRow.appendChild(ratingInput);
            actionsRow.appendChild(rateBtn);
            actionsRow.appendChild(commentInput);
            actionsRow.appendChild(commentBtn);

            const commentsList = document.createElement("div");
            commentsList.className = "cafe-post-comments";
            const comments = Array.isArray(post.comments) ? post.comments : [];
            comments.forEach((c) => {
                const row = document.createElement("div");
                row.className = "cafe-post-comment-row";
                let text = c.text || "";
                const created = c.createdAt ? new Date(c.createdAt) : null;
                if (created && !Number.isNaN(created.getTime())) {
                    text += " (" + created.toLocaleString() + ")";
                }
                row.textContent = text;
                commentsList.appendChild(row);
            });

            item.appendChild(textEl);
            if (photosWrap.childNodes.length) {
                item.appendChild(photosWrap);
            }
            item.appendChild(metaRow);
            item.appendChild(actionsRow);
            item.appendChild(commentsList);

            targets.forEach((t) => {
                t.appendChild(item.cloneNode(true));
            });
        });
        const loadMoreButtons = [];
        const btnModal = document.getElementById("btnCafePostsLoadMore");
        const btnPage = document.getElementById("btnCafePagePostsLoadMore");
        if (btnModal) loadMoreButtons.push(btnModal);
        if (btnPage) loadMoreButtons.push(btnPage);
        loadMoreButtons.forEach((btn) => {
            if (!posts.length && currentCafePostsOffset === 0 && !currentCafePostsHasMore) {
                btn.classList.add("hidden");
            } else {
                btn.classList.toggle("hidden", !currentCafePostsHasMore);
            }
        });
    } catch (e) {
    }
}

function applyLanguage(lang) {
    const config = translations[lang];
    if (!config) return;
    currentLang = lang;

    const btnOpenAuth = document.getElementById("btnOpenAuth");
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

    const registerCityInput = document.getElementById("registerCity");
    const citySuggestions = document.getElementById("registerCitySuggestions");
    const headerCitySearch = document.getElementById("headerCitySearch");

    if (btnOpenAuth) btnOpenAuth.textContent = config.ui.login;
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

    if (registerCityInput && config.ui.registerCityPlaceholder) {
        registerCityInput.placeholder = config.ui.registerCityPlaceholder;
    }
    if (headerCitySearch && config.ui.headerCitySearchPlaceholder) {
        headerCitySearch.placeholder = config.ui.headerCitySearchPlaceholder;
    }
    if (citySuggestions && config.cities) {
        citySuggestions.innerHTML = "";
        Object.keys(config.cities).forEach((code) => {
            const option = document.createElement("option");
            option.value = config.cities[code];
            citySuggestions.appendChild(option);
        });
    }

    if (verificationChannelHintEl) {
        const baseHint = config.ui.verificationChannelHint || "";
        verificationChannelHintEl.textContent = baseHint;
    }

    const headerProvinceSelect = document.getElementById("headerProvinceSelect");
    const headerCitySelect = document.getElementById("headerCitySelect");
    if (headerProvinceSelect && headerCitySelect && provinceCityMap) {
        const provinces = Object.keys(provinceCityMap);
        headerProvinceSelect.innerHTML = "";
        provinces.forEach((code) => {
            const option = document.createElement("option");
            option.value = code;
            const name =
                (config.regions && config.regions[code]) ||
                code;
            option.textContent = name;
            headerProvinceSelect.appendChild(option);
        });
        let selectedProvince = "";
        provinces.forEach((code) => {
            const list = provinceCityMap[code] || [];
            if (!selectedProvince && list.indexOf(currentCityCode) !== -1) {
                selectedProvince = code;
            }
        });
        if (!selectedProvince && provinces.length) {
            selectedProvince = provinces[0];
        }
        if (selectedProvince) {
            headerProvinceSelect.value = selectedProvince;
        }
        headerCitySelect.innerHTML = "";
        const cities = provinceCityMap[selectedProvince] || [];
        cities.forEach((code) => {
            const option = document.createElement("option");
            option.value = code;
            const name =
                (config.cities && config.cities[code]) ||
                code;
            option.textContent = name;
            headerCitySelect.appendChild(option);
        });
        let selectedCity = "";
        if (currentCityCode && cities.indexOf(currentCityCode) !== -1) {
            selectedCity = currentCityCode;
        } else if (cities.length) {
            selectedCity = cities[0];
        }
        if (selectedCity) {
            headerCitySelect.value = selectedCity;
        }
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
                let suffix = "";
                if (currentLang === "ru") {
                    suffix = " · последние 10 кафе в выбранном городе";
                } else if (currentLang === "en") {
                    suffix = " · last 10 cafes in the selected city";
                } else if (currentLang === "ko") {
                    suffix = " · 선택한 도시의 최근 등록 카페 10곳";
                }
                feedRecommendText.textContent = rec + suffix;
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

function setCurrentCity(code) {
    const selected = code || "seoul";
    currentCityCode = selected;
    const topCitySelect = document.getElementById("topCitySelect");
    if (topCitySelect) {
        topCitySelect.value = selected;
    }
    const cityButtonsSync = document.querySelectorAll(".city-btn");
    cityButtonsSync.forEach((btn) => {
        const btnCode = btn.getAttribute("data-city");
        btn.classList.toggle("active", btnCode === selected);
    });
    applyLanguage(currentLang);
    initKakaoMap(currentCityCode);
    loadFeedCafes();
    loadPromoPosts();
}

async function loadOwnerCafes() {
    const listEl = document.getElementById("ownerCafesList");
    const statCafesEl = document.getElementById("ownerStatCafes");
    const statSubsEl = document.getElementById("ownerStatSubscribers");
    const statPostsEl = document.getElementById("ownerStatPosts");
    if (!listEl || !authToken) {
        if (statCafesEl) statCafesEl.textContent = "0";
        if (statSubsEl) statSubsEl.textContent = "0";
        if (statPostsEl) statPostsEl.textContent = "0";
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

        if (statCafesEl) {
            statCafesEl.textContent = String(cafes.length);
        }

        let totalSubscribers = 0;
        let totalPosts = 0;

        cafes.forEach((cafe) => {
            const item = document.createElement("div");
            item.className = "owner-cafe-item";

            const title = document.createElement("div");
            title.className = "owner-cafe-title";
            title.textContent = cafe.name + (cafe.cityCode ? " (" + cafe.cityCode + ")" : "");

            const photosWrap = document.createElement("div");
            photosWrap.className = "owner-cafe-photos";
            const photos = Array.isArray(cafe.photos) ? cafe.photos : [];
            if (photos.length) {
                const lastPhoto = photos[photos.length - 1];
                if (lastPhoto && lastPhoto.url) {
                    const img = document.createElement("img");
                    img.src = lastPhoto.url;
                    img.alt = cafe.name || "";
                    photosWrap.appendChild(img);
                }
            }

            const controls = document.createElement("div");
            controls.className = "owner-cafe-controls";

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";

            const uploadBtn = document.createElement("button");
            uploadBtn.type = "button";
            uploadBtn.className = "btn btn-secondary btn-small";
            if (currentLang === "ru") {
                uploadBtn.textContent = "Загрузить фото";
            } else if (currentLang === "en") {
                uploadBtn.textContent = "Upload photo";
            } else {
                uploadBtn.textContent = "사진 업로드";
            }

            uploadBtn.addEventListener("click", async () => {
                if (!fileInput.files || !fileInput.files[0]) {
                    return;
                }
                const formData = new FormData();
                formData.append("photo", fileInput.files[0]);
                try {
                    const uploadRes = await fetch(
                        "/api/cafes/" + encodeURIComponent(cafe._id) + "/photos",
                        {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer " + authToken
                            },
                            body: formData
                        }
                    );
                    if (!uploadRes.ok) {
                        return;
                    }
                    await loadOwnerCafes();
                } catch (e) {
                }
            });

            controls.appendChild(fileInput);
            controls.appendChild(uploadBtn);

            item.appendChild(title);
            item.appendChild(photosWrap);
            item.appendChild(controls);
            listEl.appendChild(item);

            item.addEventListener("click", async () => {
                currentCafeId = cafe._id;
                const stickyLabel = document.getElementById("ownerStickyCafeLabel");
                const detailNameEl = document.getElementById("ownerCafeDetailName");
                const detailMetaEl = document.getElementById("ownerCafeDetailMeta");
                const detailDescEl = document.getElementById("ownerCafeDetailDescription");
                const detailBookingEl = document.getElementById("ownerCafeDetailBookingInfo");
                const detailMenuEl = document.getElementById("ownerCafeDetailMenu");
                const detailPhotosEl = document.getElementById("ownerCafeDetailPhotos");
                const cafeName = cafe.name || "Кафе";
                if (detailNameEl) {
                    detailNameEl.textContent = cafeName;
                }
                if (stickyLabel) {
                    stickyLabel.textContent = cafeName;
                }
                if (detailMetaEl) {
                    const cfg = translations[currentLang] || translations.ko;
                    const parts = [];
                    if (cafe.cityCode) {
                        const readable =
                            cfg && cfg.cities && cfg.cities[cafe.cityCode]
                                ? cfg.cities[cafe.cityCode]
                                : cafe.cityCode;
                        parts.push(readable);
                    }
                    if (cafe.address) {
                        parts.push(cafe.address);
                    }
                    if (cafe.phone) {
                        parts.push(cafe.phone);
                    }
                    detailMetaEl.textContent = parts.join(" · ");
                }
                if (detailDescEl) {
                    detailDescEl.textContent = cafe.description || "";
                }
                if (detailBookingEl) {
                    if (cafe.bookingInfo) {
                        detailBookingEl.textContent = cafe.bookingInfo;
                    } else {
                        detailBookingEl.textContent =
                            currentLang === "ru"
                                ? "Информация о бронировании или доставке не указана. Свяжитесь с владельцем напрямую."
                                : currentLang === "en"
                                ? "No booking or delivery info specified. Please contact the owner directly."
                                : "예약 또는 배달 정보가 없습니다. 매장에 직접 문의하세요.";
                    }
                }
                if (detailMenuEl) {
                    detailMenuEl.innerHTML = "";
                    const items = Array.isArray(cafe.menu) ? cafe.menu : [];
                    if (items.length) {
                        const track = document.createElement("div");
                        track.className = "cafe-menu-carousel-track";
                        items.forEach((item) => {
                            const row = document.createElement("div");
                            row.className = "cafe-detail-menu-item cafe-menu-card";
                            const title = document.createElement("div");
                            title.className = "cafe-detail-menu-title";
                            title.textContent = item.name || "";
                            const meta = document.createElement("div");
                            meta.className = "owner-cafe-detail-menu-meta";
                            const partsMenu = [];
                            if (typeof item.price === "number") {
                                partsMenu.push(item.price + "₩");
                            }
                            if (item.category) {
                                partsMenu.push(item.category);
                            }
                            meta.textContent = partsMenu.join(" · ");
                            row.appendChild(title);
                            if (meta.textContent) {
                                row.appendChild(meta);
                            }
                            track.appendChild(row);
                        });
                        detailMenuEl.appendChild(track);
                    } else {
                        if (currentLang === "ru") {
                            detailMenuEl.textContent =
                                "Здесь будет меню этого кафе. Добавьте позиции в форме слева.";
                        } else if (currentLang === "en") {
                            detailMenuEl.textContent =
                                "Cafe menu will appear here after you add items on the left.";
                        } else {
                            detailMenuEl.textContent =
                                "왼쪽 폼에서 메뉴를 추가하면 이곳에 표시됩니다.";
                        }
                    }
                }
                if (detailPhotosEl) {
                    detailPhotosEl.innerHTML = "";
                    const photos = Array.isArray(cafe.photos) ? cafe.photos : [];
                    photos.forEach((p) => {
                        if (p && p.url) {
                            const img = document.createElement("img");
                            img.src = p.url;
                            img.alt = cafe.name || "";
                            detailPhotosEl.appendChild(img);
                        }
                    });
                }

                if (window.kakao && kakao.maps && cafe.cityCode && cityCenters[cafe.cityCode]) {
                    const ownerMapContainer = document.getElementById("ownerMap");
                    if (ownerMapContainer) {
                        const centerInfo = cityCenters[cafe.cityCode];
                        const center = new kakao.maps.LatLng(centerInfo.lat, centerInfo.lng);
                        if (!map) {
                            map = new kakao.maps.Map(ownerMapContainer, {
                                center,
                                level: 5
                            });
                        } else {
                            map.setCenter(center);
                        }
                    }
                }

                await loadCafePosts(true);
            });

            (async () => {
                try {
                    const [subsRes, postsRes] = await Promise.all([
                        fetch("/api/cafes/" + encodeURIComponent(cafe._id) + "/subscribers"),
                        fetch(
                            "/api/cafes/" +
                                encodeURIComponent(cafe._id) +
                                "/posts?limit=1&offset=0"
                        )
                    ]);
                    if (subsRes.ok) {
                        const subsData = await subsRes.json();
                        if (typeof subsData.count === "number") {
                            totalSubscribers += subsData.count;
                        }
                    }
                    if (postsRes.ok) {
                        const postsData = await postsRes.json();
                        if (typeof postsData.total === "number") {
                            totalPosts += postsData.total;
                        } else if (Array.isArray(postsData.posts)) {
                            totalPosts += postsData.posts.length;
                        }
                    }
                    if (statSubsEl) {
                        statSubsEl.textContent = String(totalSubscribers);
                    }
                    if (statPostsEl) {
                        statPostsEl.textContent = String(totalPosts);
                    }
                } catch (e) {
                }
            })();
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
            div.className = "admin-list-item admin-list-item-collapsible admin-list-item-collapsed";
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
            
            // Header Row
            const headerRow = document.createElement("div");
            headerRow.style.display = "flex";
            headerRow.style.justifyContent = "space-between";
            headerRow.style.alignItems = "center";
            headerRow.style.width = "100%";

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
            
            const actionsDiv = document.createElement("div");
            actionsDiv.className = "admin-actions";
            actionsDiv.style.marginLeft = "10px";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Изменить";
            editBtn.className = "btn btn-small";
            editBtn.style.marginRight = "5px";
            editBtn.onclick = (e) => { e.stopPropagation(); editAdminUser(user); };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Удалить";
            deleteBtn.className = "btn btn-small btn-danger";
            deleteBtn.onclick = (e) => { e.stopPropagation(); deleteAdminUser(user._id); };

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            headerRow.appendChild(mainText);
            headerRow.appendChild(actionsDiv);

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

            const bodyWrap = document.createElement("div");
            bodyWrap.className = "admin-list-body";
            bodyWrap.appendChild(buttonsWrap);

            const flagsWrap = document.createElement("div");
            flagsWrap.className = "admin-user-flags";

            const adminToggle = document.createElement("button");
            adminToggle.type = "button";
            adminToggle.className =
                "admin-user-flag-btn" + (user.isAdmin ? " admin-user-flag-btn-active" : "");
            adminToggle.textContent = user.isAdmin ? "Админ: вкл" : "Админ: выкл";
            adminToggle.addEventListener("click", async (e) => {
                e.stopPropagation();
                await toggleUserAdmin(user);
            });

            const investorToggle = document.createElement("button");
            investorToggle.type = "button";
            investorToggle.className =
                "admin-user-flag-btn" +
                (user.isInvestor ? " admin-user-flag-btn-active" : "");
            investorToggle.textContent = user.isInvestor ? "Инвестор: вкл" : "Инвестор: выкл";
            investorToggle.addEventListener("click", async (e) => {
                e.stopPropagation();
                await toggleUserInvestor(user);
            });

            flagsWrap.appendChild(adminToggle);
            flagsWrap.appendChild(investorToggle);
            bodyWrap.appendChild(flagsWrap);

            const toggleHint = document.createElement("div");
            toggleHint.className = "admin-list-item-toggle";
            toggleHint.textContent = "Нажмите, чтобы развернуть";

            div.appendChild(headerRow);
            div.appendChild(toggleHint);
            div.appendChild(bodyWrap);

            mainText.addEventListener("click", () => {
                const collapsed = div.classList.contains("admin-list-item-collapsed");
                if (collapsed) {
                    div.classList.remove("admin-list-item-collapsed");
                    toggleHint.textContent = "Нажмите, чтобы свернуть";
                } else {
                    div.classList.add("admin-list-item-collapsed");
                    toggleHint.textContent = "Нажмите, чтобы развернуть";
                }
            });

            listEl.appendChild(div);
        });
    } catch (e) {
    }
}

async function deleteAdminUser(id) {
    if(!confirm("Удалить пользователя?")) return;
    try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(id), {
            method: "DELETE",
            headers: { Authorization: "Bearer " + authToken }
        });
        if(res.ok) loadAdminUsers();
        else alert("Ошибка удаления");
    } catch(e) { console.error(e); }
}

async function editAdminUser(user) {
    const newName = prompt("Имя:", user.name);
    if(newName === null) return;
    const newRole = prompt("Role (user/owner):", user.role);
    if(newRole === null) return;
    try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(user._id), {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken 
            },
            body: JSON.stringify({ name: newName, role: newRole })
        });
        if(res.ok) loadAdminUsers();
        else alert("Ошибка изменения");
    } catch(e) { console.error(e); }
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

async function toggleUserAdmin(user) {
    if (!authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    const body = { isAdmin: !user.isAdmin };
    try {
        const res = await fetch(
            "/api/admin/users/" + encodeURIComponent(user._id) + "/subscription",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authToken
                },
                body: JSON.stringify(body)
            }
        );
        if (!res.ok) {
            return;
        }
        await loadAdminUsers();
    } catch (e) {
    }
}

async function toggleUserInvestor(user) {
    if (!authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    const body = { isInvestor: !user.isInvestor };
    try {
        const res = await fetch(
            "/api/admin/users/" + encodeURIComponent(user._id) + "/subscription",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authToken
                },
                body: JSON.stringify(body)
            }
        );
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
                "admin-list-item admin-list-item-collapsible admin-list-item-collapsed " +
                (cafe.isActive ? "admin-list-item-active" : "admin-list-item-inactive");
            
            const rowTop = document.createElement("div");
            rowTop.className = "admin-list-row-top";
            
            // Info wrapper
            const infoWrap = document.createElement("div");
            infoWrap.style.flex = "1";
            infoWrap.style.display = "flex";
            infoWrap.style.alignItems = "center";

            const mainText = document.createElement("div");
            const name = cafe.name || "";
            const cityCode = cafe.cityCode || "";
            const promotedText = cafe.isPromoted ? " [PROMO]" : "";
            mainText.textContent = name + (cityCode ? " (" + cityCode + ")" : "") + promotedText;
            if(cafe.isPromoted) mainText.style.fontWeight = "bold";

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
            
            infoWrap.appendChild(mainText);
            infoWrap.appendChild(statusPill);

            // Actions wrapper
            const actionsDiv = document.createElement("div");
            actionsDiv.className = "admin-actions";
            actionsDiv.style.marginLeft = "10px";

            const promoBtn = document.createElement("button");
            promoBtn.textContent = cafe.isPromoted ? "Снять промо" : "Продвигать";
            promoBtn.className = "btn btn-small " + (cafe.isPromoted ? "btn-warning" : "btn-success");
            promoBtn.style.marginRight = "5px";
            promoBtn.onclick = (e) => { e.stopPropagation(); togglePromoteCafe(cafe._id, cafe.isPromoted); };

            const editBtn = document.createElement("button");
            editBtn.textContent = "Изменить";
            editBtn.className = "btn btn-small";
            editBtn.style.marginRight = "5px";
            editBtn.onclick = (e) => { e.stopPropagation(); editAdminCafe(cafe); };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Удалить";
            deleteBtn.className = "btn btn-small btn-danger";
            deleteBtn.onclick = (e) => { e.stopPropagation(); deleteAdminCafe(cafe._id); };

            actionsDiv.appendChild(promoBtn);
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            rowTop.appendChild(infoWrap);
            rowTop.appendChild(actionsDiv);

            const bodyWrap = document.createElement("div");
            bodyWrap.className = "admin-list-body";

            const toggleBtn = document.createElement("button");
            toggleBtn.type = "button";
            toggleBtn.className = "admin-news-btn";
            toggleBtn.textContent = cafe.isActive ? "Выключить" : "Включить";
            toggleBtn.addEventListener("click", async (e) => {
                e.stopPropagation();
                await toggleCafeActive(cafe._id, !!cafe.isActive);
            });

            bodyWrap.appendChild(toggleBtn);

            const toggleHint = document.createElement("div");
            toggleHint.className = "admin-list-item-toggle";
            toggleHint.textContent = "Нажмите, чтобы развернуть";

            div.appendChild(rowTop);
            div.appendChild(toggleHint);
            div.appendChild(bodyWrap);

            rowTop.addEventListener("click", () => {
                const collapsed = div.classList.contains("admin-list-item-collapsed");
                if (collapsed) {
                    div.classList.remove("admin-list-item-collapsed");
                    toggleHint.textContent = "Нажмите, чтобы свернуть";
                } else {
                    div.classList.add("admin-list-item-collapsed");
                    toggleHint.textContent = "Нажмите, чтобы развернуть";
                }
            });

            listEl.appendChild(div);
        });
    } catch (e) {
    }
}

async function deleteAdminCafe(id) {
    if(!confirm("Удалить кафе?")) return;
    try {
        const res = await fetch("/api/admin/cafes/" + encodeURIComponent(id), {
            method: "DELETE",
            headers: { Authorization: "Bearer " + authToken }
        });
        if(res.ok) loadAdminCafes();
        else alert("Ошибка удаления");
    } catch(e) { console.error(e); }
}

async function editAdminCafe(cafe) {
    const newName = prompt("Название:", cafe.name);
    if(newName === null) return;
    const newCity = prompt("Код города:", cafe.cityCode);
    if(newCity === null) return;
    try {
        const res = await fetch("/api/admin/cafes/" + encodeURIComponent(cafe._id), {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken 
            },
            body: JSON.stringify({ name: newName, cityCode: newCity })
        });
        if(res.ok) loadAdminCafes();
        else alert("Ошибка изменения");
    } catch(e) { console.error(e); }
}

async function togglePromoteCafe(id, currentStatus) {
    try {
        const res = await fetch("/api/admin/cafes/" + encodeURIComponent(id), {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken 
            },
            body: JSON.stringify({ isPromoted: !currentStatus })
        });
        if(res.ok) loadAdminCafes();
        else alert("Ошибка обновления промо статуса");
    } catch(e) { console.error(e); }
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
                "admin-list-item admin-list-item-collapsible admin-list-item-collapsed " +
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

            const bodyWrap = document.createElement("div");
            bodyWrap.className = "admin-list-body";

            const toggleBtn = document.createElement("button");
            toggleBtn.type = "button";
            toggleBtn.className = "admin-news-btn";
            toggleBtn.textContent = ad.active ? "Выключить" : "Включить";
            toggleBtn.addEventListener("click", async (e) => {
                e.stopPropagation();
                await toggleAdActive(ad._id, !!ad.active);
            });

            bodyWrap.appendChild(toggleBtn);

            const toggleHint = document.createElement("div");
            toggleHint.className = "admin-list-item-toggle";
            toggleHint.textContent = "Нажмите, чтобы развернуть";

            div.appendChild(rowTop);
            div.appendChild(toggleHint);
            div.appendChild(bodyWrap);

            rowTop.addEventListener("click", () => {
                const collapsed = div.classList.contains("admin-list-item-collapsed");
                if (collapsed) {
                    div.classList.remove("admin-list-item-collapsed");
                    toggleHint.textContent = "Нажмите, чтобы свернуть";
                } else {
                    div.classList.add("admin-list-item-collapsed");
                    toggleHint.textContent = "Нажмите, чтобы развернуть";
                }
            });

            listEl.appendChild(div);
        });
    } catch (e) {
    }
}

async function loadAdminPromoStats(cityCode) {
    const summaryEl = document.getElementById("adminPromoStatsSummary");
    const byCityEl = document.getElementById("adminPromoStatsByCity");
    const topPostsEl = document.getElementById("adminPromoStatsTopPosts");
    const filterSelect = document.getElementById("adminPromoStatsCityFilter");
    if (!summaryEl || !byCityEl || !topPostsEl || !authToken || !currentUser || !currentUser.isAdmin) {
        return;
    }
    summaryEl.innerHTML = "";
    byCityEl.innerHTML = "";
    topPostsEl.innerHTML = "";
    try {
        const url =
            "/api/admin/promo-stats" +
            (cityCode ? "?city=" + encodeURIComponent(cityCode) : "");
        const res = await fetch(url, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        });
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        const totalPromos = typeof data.totalPromos === "number" ? data.totalPromos : 0;
        const byCity = Array.isArray(data.byCity) ? data.byCity : [];
        const topPosts = Array.isArray(data.topPosts) ? data.topPosts : [];

        const summaryRow = document.createElement("div");
        summaryRow.className = "admin-list-item";
        summaryRow.textContent = "Всего активных промо-постов: " + totalPromos;
        summaryEl.appendChild(summaryRow);

        if (filterSelect && !filterSelect.dataset.initialized) {
            const selectedValue = cityCode || "";
            filterSelect.innerHTML = "";
            const optionAll = document.createElement("option");
            optionAll.value = "";
            optionAll.textContent = "Все города";
            filterSelect.appendChild(optionAll);
            byCity.forEach((item) => {
                const code = item._id || "";
                if (!code) {
                    return;
                }
                const option = document.createElement("option");
                option.value = code;
                option.textContent = code;
                filterSelect.appendChild(option);
            });
            filterSelect.value = selectedValue;
            filterSelect.dataset.initialized = "1";
        }

        if (byCity.length) {
            const maxCount = byCity.reduce((max, item) => {
                const value =
                    typeof item.count === "number" && item.count > 0
                        ? item.count
                        : 0;
                return value > max ? value : max;
            }, 0);
            byCity.forEach((item) => {
                const row = document.createElement("div");
                row.className = "admin-list-item admin-promo-bar-row";
                const city = item._id || "(без города)";
                const label = document.createElement("div");
                label.className = "admin-promo-bar-label";
                label.textContent = city;
                const outer = document.createElement("div");
                outer.className = "admin-promo-bar-outer";
                const inner = document.createElement("div");
                inner.className = "admin-promo-bar-inner";
                const countValue =
                    typeof item.count === "number" && item.count > 0
                        ? item.count
                        : 0;
                const width =
                    maxCount > 0 ? Math.max(4, (countValue / maxCount) * 100) : 0;
                inner.style.width = width + "%";
                outer.appendChild(inner);
                const valueEl = document.createElement("div");
                valueEl.className = "admin-promo-bar-value";
                valueEl.textContent = String(countValue);
                row.appendChild(label);
                row.appendChild(outer);
                row.appendChild(valueEl);
                byCityEl.appendChild(row);
            });
        }

        if (topPosts.length) {
            topPosts.forEach((post) => {
                const row = document.createElement("div");
                row.className = "admin-list-item";
                const likesCount = typeof post.likesCount === "number" ? post.likesCount : 0;
                const ratingCount = typeof post.ratingCount === "number" ? post.ratingCount : 0;
                const ratingSum = typeof post.ratingSum === "number" ? post.ratingSum : 0;
                const rating =
                    ratingCount > 0 ? (ratingSum / ratingCount).toFixed(2) : "0";
                const text = post.text || "";
                const shortText = text.length > 60 ? text.slice(0, 57) + "..." : text;
                row.textContent =
                    "Лайков: " + likesCount + ", рейтинг: " + rating + " — " + shortText;
                topPostsEl.appendChild(row);
            });
        }
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
            row.className = "admin-list-item admin-list-item-collapsible admin-list-item-collapsed";
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
            controls.className = "admin-list-body";
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.textContent = "Удалить";
            deleteBtn.addEventListener("click", async (e) => {
                e.stopPropagation();
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

            const toggleHint = document.createElement("div");
            toggleHint.className = "admin-list-item-toggle";
            toggleHint.textContent = "Нажмите, чтобы развернуть";

            row.appendChild(main);
            row.appendChild(toggleHint);
            row.appendChild(controls);

            main.addEventListener("click", () => {
                const collapsed = row.classList.contains("admin-list-item-collapsed");
                if (collapsed) {
                    row.classList.remove("admin-list-item-collapsed");
                    toggleHint.textContent = "Нажмите, чтобы свернуть";
                } else {
                    row.classList.add("admin-list-item-collapsed");
                    toggleHint.textContent = "Нажмите, чтобы развернуть";
                }
            });
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
    await loadAdminPromoStats();
}

async function adminLoginPrompt() {
    const email = window.prompt("Email:");
    if (!email) return;
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
                email,
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
    if (pathName.startsWith("/cafe/")) {
        const id = pathName.split("/").filter(Boolean)[1];
        if (id) {
            fetch("/api/cafes?id=" + encodeURIComponent(id))
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("not found");
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data && data.cafe) {
                        const cafe = data.cafe;
                        if (cafe.cityCode) {
                            setCurrentCity(cafe.cityCode);
                        }
                        openCafePage(cafe);
                    }
                })
                .catch(() => {
                    // ignore
                });
        }
    }
    if (pathName === "/payments/toss/success") {
        handleTossSuccess();
        return;
    }
    if (pathName === "/payments/toss/fail") {
        handleTossFail();
        return;
    }

    if (pathName === "/owner") {
        initOwnerProfileSummary();
    }
    if (pathName === "/admin.html") {
        const cityFilter = document.getElementById("adminPromoStatsCityFilter");
        if (cityFilter) {
            cityFilter.addEventListener("change", () => {
                const value = cityFilter.value || "";
                loadAdminPromoStats(value || undefined);
            });
        }
    }

    const cityButtons = document.querySelectorAll(".city-btn");
    cityButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            cityButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const code = btn.getAttribute("data-city") || "seoul";
            setCurrentCity(code);
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
            const code = firstVisible.getAttribute("data-city") || "seoul";
            setCurrentCity(code);
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

    const topCitySelect = document.getElementById("topCitySelect");
    if (topCitySelect) {
        topCitySelect.value = currentCityCode;
        topCitySelect.addEventListener("change", () => {
            const code = topCitySelect.value || "seoul";
            setCurrentCity(code);
        });
    }

    const headerProvinceSelect = document.getElementById("headerProvinceSelect");
    const headerCitySelect = document.getElementById("headerCitySelect");
    if (headerProvinceSelect && headerCitySelect && provinceCityMap) {
        headerProvinceSelect.addEventListener("change", () => {
            const province = headerProvinceSelect.value;
            const cities = provinceCityMap[province] || [];
            const nextCity = cities.length ? cities[0] : "seoul";
            setCurrentCity(nextCity);
        });
        headerCitySelect.addEventListener("change", () => {
            const code = headerCitySelect.value || "seoul";
            setCurrentCity(code);
        });
    }

    function applyCitySearch(term) {
        const raw = term || "";
        const value = raw.toLowerCase().trim();
        const tokens = value
            ? value
                  .split(/[,\s]+/)
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0)
            : [];
        const cityButtonsSearch = document.querySelectorAll(".city-btn");
        const cafeItems = document.querySelectorAll(".cafe-items .cafe-item");
        cityButtonsSearch.forEach((btn) => {
            btn.classList.remove("search-highlight");
        });
        cafeItems.forEach((item) => {
            item.classList.remove("search-highlight");
        });
        const matchedCityCodes = [];
        cityButtonsSearch.forEach((btn) => {
            const codeAttr = btn.getAttribute("data-city") || "";
            const code = codeAttr.toLowerCase();
            const text = (btn.textContent || "").toLowerCase();
            const match =
                !tokens.length ||
                tokens.some((t) => text.includes(t) || code.includes(t));
            btn.style.display = match ? "" : "none";
            if (match && tokens.length) {
                btn.classList.add("search-highlight");
                if (codeAttr && matchedCityCodes.indexOf(codeAttr) === -1) {
                    matchedCityCodes.push(codeAttr);
                }
            }
        });
        const matchedCafeItems = [];
        cafeItems.forEach((item) => {
            const text = (item.innerText || "").toLowerCase();
            const match =
                !tokens.length || tokens.some((t) => text.includes(t));
            item.style.display = match ? "" : "none";
            if (match && tokens.length) {
                item.classList.add("search-highlight");
                matchedCafeItems.push(item);
            }
        });
        if (!tokens.length) {
            if (highlightMarker) {
                highlightMarker.setMap(null);
            }
            return;
        }
        if (matchedCityCodes.length) {
            const nextCity = matchedCityCodes[0];
            setCurrentCity(nextCity);
            if (window.kakao && kakao.maps && cityCenters[nextCity]) {
                const centerInfo = cityCenters[nextCity];
                const position = new kakao.maps.LatLng(centerInfo.lat, centerInfo.lng);
                if (!highlightMarker) {
                    const svg =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">' +
                        '<circle cx="16" cy="16" r="8" fill="#f97316" stroke="#ffffff" stroke-width="2"/></svg>';
                    const imageSrc = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
                    const imageSize = new kakao.maps.Size(32, 32);
                    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
                    highlightMarker = new kakao.maps.Marker({
                        position,
                        image: markerImage,
                        zIndex: 10
                    });
                } else {
                    highlightMarker.setPosition(position);
                }
                highlightMarker.setMap(map);
                if (map && map.setLevel) {
                    map.setLevel(4);
                }
            }
        } else if (!matchedCityCodes.length && matchedCafeItems.length) {
            if (map && map.setLevel) {
                map.setLevel(4);
            }
        } else if (highlightMarker) {
            highlightMarker.setMap(null);
        }
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        const siteSearchButton = document.getElementById("siteSearchButton");
        const runSearch = (changeCity) => {
            const term = searchInput.value;
            if (changeCity) {
                const cityCode = resolveCityCodeFromInput(term);
                if (cityCode) {
                    setCurrentCity(cityCode);
                }
            }
            applyCitySearch(term);
            updateSearchResults(term);
        };
        searchInput.addEventListener("input", () => {
            runSearch(false);
        });
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                runSearch(true);
            }
        });
        if (siteSearchButton) {
            siteSearchButton.addEventListener("click", () => {
                runSearch(true);
            });
        }
    }

    const headerCitySearch = document.getElementById("headerCitySearch");
    const headerCitySearchButton = document.getElementById("headerCitySearchButton");
    if (headerCitySearch) {
        headerCitySearch.addEventListener("input", () => {
            applyCitySearch(headerCitySearch.value);
            updateSearchResults(headerCitySearch.value);
        });
        headerCitySearch.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                applyCitySearch(headerCitySearch.value);
                updateSearchResults(headerCitySearch.value);
            }
        });
    }
    if (headerCitySearchButton && headerCitySearch) {
        headerCitySearchButton.addEventListener("click", () => {
            applyCitySearch(headerCitySearch.value);
            updateSearchResults(headerCitySearch.value);
        });
    }

    const profileSettingsForm = document.getElementById("profileSettingsForm");
    if (profileSettingsForm) {
        profileSettingsForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!authToken || !currentUser) {
                showLoginModal();
                return;
            }
            const langSelect = document.getElementById("profileLangSelect");
            const citySelect = document.getElementById("profileCitySelect");
            const currentPasswordInput = document.getElementById("profileCurrentPassword");
            const newPasswordInput = document.getElementById("profileNewPassword");
            const newPasswordConfirmInput = document.getElementById("profileNewPasswordConfirm");
            if (!langSelect || !citySelect || !currentPasswordInput || !newPasswordInput || !newPasswordConfirmInput) {
                return;
            }
            const preferredLang = langSelect.value || currentLang;
            const cityCode = citySelect.value || currentCityCode;
            const currentPassword = currentPasswordInput.value || "";
            const newPassword = newPasswordInput.value || "";
            const newPasswordConfirm = newPasswordConfirmInput.value || "";

            if (newPassword || newPasswordConfirm) {
                if (newPassword !== newPasswordConfirm) {
                    alert(
                        currentLang === "ru"
                            ? "Новый пароль и подтверждение не совпадают"
                            : currentLang === "en"
                            ? "New password and confirmation do not match"
                            : "새 비밀번호와 확인이 일치하지 않습니다."
                    );
                    return;
                }
                if (!currentPassword) {
                    alert(
                        currentLang === "ru"
                            ? "Введите текущий пароль"
                            : currentLang === "en"
                            ? "Enter current password"
                            : "현재 비밀번호를 입력하세요."
                    );
                    return;
                }
            }

            const payload = {
                preferredLang,
                cityCode
            };
            if (currentPassword && newPassword) {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }

            try {
                const res = await fetch("/api/profile/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authToken
                    },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) {
                    try {
                        const data = await res.json();
                        const code = data && data.error ? data.error : "";
                        if (code === "invalid-current-password") {
                            alert(
                                currentLang === "ru"
                                    ? "Текущий пароль введён неверно"
                                    : currentLang === "en"
                                    ? "Current password is incorrect"
                                    : "현재 비밀번호가 올바르지 않습니다."
                            );
                        } else if (code === "password-too-short") {
                            alert(
                                currentLang === "ru"
                                    ? "Новый пароль слишком короткий (минимум 6 символов)"
                                    : currentLang === "en"
                                    ? "New password is too short (minimum 6 characters)"
                                    : "새 비밀번호가 너무 짧습니다. (최소 6자)"
                            );
                        } else if (code === "password-not-set") {
                            alert(
                                currentLang === "ru"
                                    ? "Для этого аккаунта ещё не задан пароль"
                                    : currentLang === "en"
                                    ? "Password is not set for this account yet"
                                    : "이 계정에는 아직 비밀번호가 설정되지 않았습니다."
                            );
                        } else if (code === "password-fields-required") {
                            alert(
                                currentLang === "ru"
                                    ? "Для смены пароля заполните оба поля: текущий и новый"
                                    : currentLang === "en"
                                    ? "Fill both current and new password fields to change password"
                                    : "비밀번호를 변경하려면 현재 비밀번호와 새 비밀번호를 모두 입력하세요."
                            );
                        } else if (code === "invalid-lang") {
                            alert(
                                currentLang === "ru"
                                    ? "Неверный язык интерфейса"
                                    : currentLang === "en"
                                    ? "Invalid interface language"
                                    : "잘못된 인터페이스 언어입니다."
                            );
                        } else {
                            alert(
                                currentLang === "ru"
                                    ? "Не удалось сохранить настройки профиля"
                                    : currentLang === "en"
                                    ? "Failed to save profile settings"
                                    : "프로필 설정을 저장하지 못했습니다."
                            );
                        }
                    } catch (parseErr) {
                        alert(
                            currentLang === "ru"
                                ? "Не удалось сохранить настройки профиля"
                                : currentLang === "en"
                                ? "Failed to save profile settings"
                                : "프로필 설정을 저장하지 못했습니다."
                        );
                    }
                    return;
                }
                const data = await res.json();
                if (data && data.user) {
                    setAuth(authToken, data.user);
                    applyLanguage(preferredLang);
                    if (cityCode) {
                        setCurrentCity(cityCode);
                    }
                }
                const modal = document.getElementById("profileSettingsModal");
                if (modal) {
                    modal.style.display = "none";
                }
                currentPasswordInput.value = "";
                newPasswordInput.value = "";
                newPasswordConfirmInput.value = "";
                alert(
                    currentLang === "ru"
                        ? "Настройки профиля сохранены"
                        : currentLang === "en"
                        ? "Profile settings saved"
                        : "프로필 설정이 저장되었습니다."
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

    const btnProfileDeleteAccount = document.getElementById("btnProfileDeleteAccount");
    if (btnProfileDeleteAccount) {
        btnProfileDeleteAccount.addEventListener("click", async () => {
            if (!authToken || !currentUser) {
                showLoginModal();
                return;
            }
            const message =
                currentLang === "ru"
                    ? "Удалить аккаунт и все связанные данные? Это действие необратимо."
                    : currentLang === "en"
                    ? "Delete your account and all related data? This action cannot be undone."
                    : "계정과 모든 관련 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.";
            if (!window.confirm(message)) {
                return;
            }
            try {
                const res = await fetch("/api/profile/me", {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + authToken
                    }
                });
                if (!res.ok) {
                    return;
                }
                setAuth(null, null);
                window.location.href = "/";
            } catch (e) {
            }
        });
    }

    const langButtons = document.querySelectorAll(".lang-btn");
    langButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const lang = btn.getAttribute("data-lang") || "ko";
            applyLanguage(lang);
        });
    });

    const btnOpenAuth = document.getElementById("btnOpenAuth");
    const btnKakaoLogin = document.getElementById("btnKakaoLogin");
    const btnProfileSettings = document.getElementById("btnProfileSettings");
    const btnOwnerDashboard = document.getElementById("btnOwnerDashboard");
    const adminDashboardBtn = document.getElementById("btnAdminDashboard");
    if (btnOpenAuth) {
        btnOpenAuth.addEventListener("click", () => {
            const pathName = window.location.pathname;
            if (pathName === "/admin.html") {
                adminLoginPrompt();
                return;
            }
            if (currentUser) {
                const profileSection = document.getElementById("profileSection");
                if (profileSection && profileSection.scrollIntoView) {
                    profileSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            } else {
                showLoginModal();
            }
        });
    }
    if (btnOwnerDashboard) {
        btnOwnerDashboard.addEventListener("click", () => {
            window.location.href = "/owner";
        });
    }
    if (adminDashboardBtn) {
        adminDashboardBtn.addEventListener("click", () => {
            if (!currentUser || !currentUser.isAdmin) {
                adminLoginPrompt();
                return;
            }
            window.location.href = "/admin.html";
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

    if (btnProfileSettings) {
        btnProfileSettings.addEventListener("click", () => {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            const modal = document.getElementById("profileSettingsModal");
            const langSelect = document.getElementById("profileLangSelect");
            const citySelect = document.getElementById("profileCitySelect");
            if (!modal || !langSelect || !citySelect) {
                return;
            }
            langSelect.value = currentLang;
            citySelect.innerHTML = "";
            const config = translations[currentLang] || translations.ko;
            if (config && config.cities) {
                Object.keys(config.cities).forEach((code) => {
                    const option = document.createElement("option");
                    option.value = code;
                    option.textContent = config.cities[code];
                    citySelect.appendChild(option);
                });
            }
            const userCity = currentUser.cityCode || currentCityCode || "seoul";
            if (userCity) {
                citySelect.value = userCity;
            }
            const passInputs = [
                document.getElementById("profileCurrentPassword"),
                document.getElementById("profileNewPassword"),
                document.getElementById("profileNewPasswordConfirm")
            ];
            passInputs.forEach((input) => {
                if (input) {
                    input.value = "";
                }
            });
            modal.style.display = "block";
        });
    }

    const btnOpenRegisterFromLogin = document.getElementById("btnOpenRegisterFromLogin");
    if (btnOpenRegisterFromLogin) {
        btnOpenRegisterFromLogin.addEventListener("click", () => {
            closeModal("loginModal");
            const registerModal = document.getElementById("registerModal");
            if (registerModal) {
                registerModal.style.display = "block";
            }
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
            const cityInput = document.getElementById("registerCity");
            const passwordInput = document.getElementById("registerPassword");
            const passwordConfirmInput = document.getElementById("registerPasswordConfirm");
            const userTypeInput = document.getElementById("userType");
            if (!nameInput || !emailInput || !passwordInput || !passwordConfirmInput || !userTypeInput) {
                return;
            }
            if (passwordInput.value !== passwordConfirmInput.value) {
                alert(currentLang === "ru" ? "Пароли не совпадают" :
                    currentLang === "en" ? "Passwords do not match" : "비밀번호가 일치하지 않습니다.");
                return;
            }
            try {
                const rawCity = cityInput ? cityInput.value : "";
                const cityCode = resolveCityCodeFromInput(rawCity);
                const res = await fetch("/api/auth/register-phone", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: emailInput.value,
                        phone: phoneInput ? phoneInput.value : "",
                        password: passwordInput.value,
                        name: nameInput.value,
                        role: userTypeInput.value,
                        cityCode,
                        preferredLang: currentLang
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
                    alert(
                        currentLang === "ru"
                            ? "Не удалось отправить код"
                            : currentLang === "en"
                            ? "Failed to send code"
                            : "코드 전송 실패"
                    );
                    return;
                }
                let devCode = null;
                try {
                    const data = await res.json();
                    if (data && data.devCode) {
                        devCode = String(data.devCode);
                        const codeInput = document.getElementById("registerPhoneCode");
                        if (codeInput) {
                            codeInput.value = devCode;
                        }
                    }
                } catch (e) {
                }
                let successMessage =
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
                if (devCode) {
                    if (currentLang === "ru") {
                        successMessage += " Тестовый код также автоматически подставлен в поле.";
                    } else if (currentLang === "en") {
                        successMessage += " Test code has also been filled into the field.";
                    } else {
                        successMessage += " 테스트 코드가 입력란에 자동으로 채워졌습니다.";
                    }
                }
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
                    try {
                        const errorData = await res.json();
                        const message =
                            errorData && errorData.error
                                ? errorData.error
                                : currentLang === "ru"
                                ? "Ошибка входа"
                                : currentLang === "en"
                                ? "Login failed"
                                : "로그인 실패";
                        alert(message);
                    } catch (parseErr) {
                        alert(
                            currentLang === "ru"
                                ? "Ошибка входа"
                                : currentLang === "en"
                                ? "Login failed"
                                : "로그인 실패"
                        );
                    }
                    return;
                }
                const data = await res.json();
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

    const ownerCafeMenuItems = document.getElementById("ownerCafeMenuItems");
    const ownerCafeMenuAdd = document.getElementById("ownerCafeMenuAdd");
    if (ownerCafeMenuItems && ownerCafeMenuAdd) {
        ownerCafeMenuAdd.addEventListener("click", () => {
            addOwnerMenuRow(ownerCafeMenuItems);
        });
        if (!ownerCafeMenuItems.children.length) {
            addOwnerMenuRow(ownerCafeMenuItems);
        }
    }

    const ownerCafeForm = document.getElementById("ownerCafeForm");
    if (ownerCafeForm) {
        const ownerStickyAddCafe = document.getElementById("ownerStickyAddCafe");
        if (ownerStickyAddCafe) {
            ownerStickyAddCafe.addEventListener("click", () => {
                ownerCafeForm.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
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
            const openingHoursInput = document.getElementById("ownerCafeOpeningHours");
            const averageCheckInput = document.getElementById("ownerCafeAverageCheck");
            const descInput = document.getElementById("ownerCafeDescription");
            const bookingInfoInput = document.getElementById("ownerCafeBookingInfo");
            if (!nameInput || !citySelect) {
                return;
            }
            const openingHoursValue =
                openingHoursInput && openingHoursInput.value
                    ? openingHoursInput.value
                    : "";
            const averageCheckValue =
                averageCheckInput && averageCheckInput.value
                    ? Number(averageCheckInput.value)
                    : 0;
            const menuItems = [];
            const menuContainer = document.getElementById("ownerCafeMenuItems");
            if (menuContainer) {
                const rows = menuContainer.querySelectorAll(".owner-cafe-menu-item-row");
                rows.forEach((row) => {
                    const nameInputEl = row.querySelector(".owner-cafe-menu-name");
                    const priceInputEl = row.querySelector(".owner-cafe-menu-price");
                    const categoryInputEl = row.querySelector(".owner-cafe-menu-category");
                    if (!nameInputEl) {
                        return;
                    }
                    const nameValue = nameInputEl.value ? nameInputEl.value.trim() : "";
                    if (!nameValue) {
                        return;
                    }
                    const item = { name: nameValue };
                    if (priceInputEl && priceInputEl.value) {
                        const priceNumber = Number(priceInputEl.value.replace(/\s/g, ""));
                        if (Number.isFinite(priceNumber)) {
                            item.price = priceNumber;
                        }
                    }
                    if (categoryInputEl && categoryInputEl.value) {
                        const categoryValue = categoryInputEl.value.trim();
                        if (categoryValue) {
                            item.category = categoryValue;
                        }
                    }
                    menuItems.push(item);
                });
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
                        openingHours: openingHoursValue,
                        averageCheck: averageCheckValue,
                        description: descInput ? descInput.value : "",
                        bookingInfo: bookingInfoInput ? bookingInfoInput.value : "",
                        menu: menuItems
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
                if (openingHoursInput) openingHoursInput.value = "";
                if (averageCheckInput) averageCheckInput.value = "";
                if (descInput) descInput.value = "";
                if (bookingInfoInput) bookingInfoInput.value = "";
                if (menuContainer) {
                    menuContainer.innerHTML = "";
                    addOwnerMenuRow(menuContainer);
                }
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
            if (
                adminUsersTab &&
                adminCafesTab &&
                adminAdsTab &&
                adminNewsTab &&
                adminVerificationsTab &&
                adminConfigTab
            ) {
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

    const btnAdminResetDb = document.getElementById("btnAdminResetDb");
    if (btnAdminResetDb) {
        btnAdminResetDb.addEventListener("click", async () => {
            if (!confirm("ВНИМАНИЕ! Вы уверены, что хотите удалить ВСЕ данные (кафе, пользователей, посты), кроме администраторов? Это действие необратимо.")) {
                return;
            }
            if (!authToken) return;
            try {
                const res = await fetch("/api/admin/reset-db", {
                    method: "POST",
                    headers: { Authorization: "Bearer " + authToken }
                });
                const data = await res.json();
                if (data.ok) {
                    alert(`База данных очищена.\nУдалено:\nКафе: ${data.deleted.cafes}\nПользователи: ${data.deleted.users}\nПосты: ${data.deleted.posts}`);
                    window.location.reload();
                } else {
                    alert("Ошибка при сбросе БД");
                }
            } catch (err) {
                console.error(err);
                alert("Ошибка сети");
            }
        });
    }

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

    const btnCafeSubscribe = document.getElementById("btnCafeSubscribe");
    async function handleCafeSubscribeClick() {
        if (!currentCafeId) {
            return;
        }
        if (!authToken) {
            alert(
                currentLang === "ru"
                    ? "Сначала войдите"
                    : currentLang === "en"
                    ? "Please login first"
                    : "먼저 로그인하세요."
            );
            return;
        }
        try {
            const res = await fetch(
                "/api/cafes/" + encodeURIComponent(currentCafeId) + "/subscribe",
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + authToken
                    }
                }
            );
            if (!res.ok) {
                return;
            }
            await updateCafeSubscribersCount();
            await loadMySubscriptions();
        } catch (e) {
        }
    }
    if (btnCafeSubscribe) {
        btnCafeSubscribe.addEventListener("click", handleCafeSubscribeClick);
    }
    const btnCafePageSubscribe = document.getElementById("btnCafePageSubscribe");
    if (btnCafePageSubscribe) {
        btnCafePageSubscribe.addEventListener("click", handleCafeSubscribeClick);
    }

    function handleCafeBookClick(targetId) {
        const infoEl = document.getElementById(targetId);
        if (!infoEl || !currentCafeContact) {
            return;
        }
        const parts = [];
        if (currentCafeContact.phone) {
            if (currentLang === "ru") {
                parts.push("Телефон для брони: " + currentCafeContact.phone);
            } else if (currentLang === "en") {
                parts.push("Phone for booking: " + currentCafeContact.phone);
            } else {
                parts.push("예약 전화번호: " + currentCafeContact.phone);
            }
        }
        if (currentCafeContact.address) {
            parts.push(currentCafeContact.address);
        }
        infoEl.textContent = parts.join(" · ");

        const emailLink = document.getElementById("contactEmailLink");
        const telegramLink = document.getElementById("footerTelegramLink");
        const instagramLink = document.getElementById("footerInstagramLink");
        const emailText =
            emailLink && emailLink.textContent
                ? emailLink.textContent
                : emailLink && emailLink.href && emailLink.href.startsWith("mailto:")
                ? emailLink.href.slice("mailto:".length)
                : "";
        const telegramUrl =
            telegramLink && !telegramLink.classList.contains("hidden")
                ? telegramLink.href
                : "";
        const instagramUrl =
            instagramLink && !instagramLink.classList.contains("hidden")
                ? instagramLink.href
                : "";

        const modal = document.createElement("div");
        modal.className = "modal";
        const titleText =
            currentLang === "ru"
                ? "Информация о бронировании"
                : currentLang === "en"
                ? "Booking information"
                : "예약 정보";
        const cafeName = currentCafeContact.name || "";
        const phoneText = currentCafeContact.phone || "";
        const addressText = currentCafeContact.address || "";

        let socialsHtml = "";
        if (emailText) {
            socialsHtml += "<p>Email: " + emailText + "</p>";
        }
        if (telegramUrl) {
            socialsHtml +=
                '<p>Telegram: <a href="' +
                telegramUrl +
                '" target="_blank" rel="noopener noreferrer">' +
                telegramUrl +
                "</a></p>";
        }
        if (instagramUrl) {
            socialsHtml +=
                '<p>Instagram: <a href="' +
                instagramUrl +
                '" target="_blank" rel="noopener noreferrer">' +
                instagramUrl +
                "</a></p>";
        }

        modal.innerHTML =
            '<div class="modal-content">' +
            '<span class="close" data-modal-id="dynamicBookingModal">&times;</span>' +
            "<h2>" +
            titleText +
            "</h2>" +
            (cafeName ? "<p>" + cafeName + "</p>" : "") +
            (addressText ? "<p>" + addressText + "</p>" : "") +
            (phoneText ? "<p>" + parts[0] + "</p>" : "") +
            socialsHtml +
            "</div>";
        document.body.appendChild(modal);
        modal.style.display = "block";
        const closeEl = modal.querySelector(".close");
        if (closeEl) {
            closeEl.addEventListener("click", () => {
                modal.remove();
            });
        }
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });
    }
    const btnCafeBook = document.getElementById("btnCafeBook");
    if (btnCafeBook) {
        btnCafeBook.addEventListener("click", () => {
            handleCafeBookClick("cafeBookingInfo");
        });
    }
    const btnCafePageBook = document.getElementById("btnCafePageBook");
    if (btnCafePageBook) {
        btnCafePageBook.addEventListener("click", () => {
            handleCafeBookClick("cafePageBookingInfo");
        });
    }

    const ownerCafeDetailBook = document.getElementById("ownerCafeDetailBook");
    if (ownerCafeDetailBook) {
        ownerCafeDetailBook.addEventListener("click", async () => {
            const modal = document.getElementById("ownerCafeBookingModal");
            const body = document.getElementById("ownerCafeBookingModalBody");
            const title = document.getElementById("ownerCafeBookingModalTitle");
            const nameEl = document.getElementById("ownerCafeDetailName");
            const metaEl = document.getElementById("ownerCafeDetailMeta");
            const bookingInfoEl = document.getElementById("ownerCafeDetailBookingInfo");
            if (!modal || !body || !title) {
                if (bookingInfoEl) {
                    bookingInfoEl.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }
            const cafeName = nameEl ? nameEl.textContent : "";
            const metaText = metaEl ? metaEl.textContent : "";
            const bookingText = bookingInfoEl ? bookingInfoEl.textContent : "";
            const titleText =
                currentLang === "ru"
                    ? "Бронирование столика"
                    : currentLang === "en"
                    ? "Table booking"
                    : "테이블 예약";
            title.textContent = titleText;
            body.innerHTML = "";
            if (cafeName) {
                const p = document.createElement("p");
                p.textContent = cafeName;
                body.appendChild(p);
            }
            if (metaText) {
                const p = document.createElement("p");
                p.textContent = metaText;
                body.appendChild(p);
            }
            if (bookingText) {
                const p = document.createElement("p");
                p.textContent = bookingText;
                body.appendChild(p);
            }
            try {
                const res = await fetch("/api/site-config");
                if (res.ok) {
                    const data = await res.json();
                    if (data.contactEmail) {
                        const p = document.createElement("p");
                        p.textContent =
                            (currentLang === "ru"
                                ? "Email для связи: "
                                : currentLang === "en"
                                ? "Contact email: "
                                : "문의 이메일: ") + data.contactEmail;
                        body.appendChild(p);
                    }
                    if (data.telegramUrl) {
                        const p = document.createElement("p");
                        const a = document.createElement("a");
                        a.href = data.telegramUrl;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        a.textContent = currentLang === "ru" ? "Telegram" : "Telegram";
                        p.appendChild(a);
                        body.appendChild(p);
                    }
                    if (data.instagramUrl) {
                        const p = document.createElement("p");
                        const a = document.createElement("a");
                        a.href = data.instagramUrl;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        a.textContent = "Instagram";
                        p.appendChild(a);
                        body.appendChild(p);
                    }
                }
            } catch (e) {
            }
            modal.style.display = "block";
        });
    }

    const ownerPostForm = document.getElementById("ownerPostForm");
    if (ownerPostForm) {
        const ownerStickyAddPost = document.getElementById("ownerStickyAddPost");
        if (ownerStickyAddPost) {
            ownerStickyAddPost.addEventListener("click", () => {
                ownerPostForm.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
        ownerPostForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!authToken) {
                alert(
                    currentLang === "ru"
                        ? "Сначала войдите"
                        : currentLang === "en"
                        ? "Please login first"
                        : "먼저 로그인하세요."
                );
                return;
            }
            if (!currentCafeId) {
                alert(
                    currentLang === "ru"
                        ? "Сначала выберите кафе из списка слева"
                        : currentLang === "en"
                        ? "Select a cafe from the list on the left first"
                        : "먼저 왼쪽 목록에서 카페를 선택하세요."
                );
                return;
            }
            const textInput = document.getElementById("ownerPostText");
            const imageInput = document.getElementById("ownerPostImage");
            if (!textInput || !imageInput) {
                return;
            }
            const text = (textInput.value || "").trim();
            if (!text) {
                alert(
                    currentLang === "ru"
                        ? "Введите текст поста"
                        : currentLang === "en"
                        ? "Enter post text"
                        : "게시글 내용을 입력하세요."
                );
                return;
            }

            const postPhotos = [];

            try {
                if (imageInput.files && imageInput.files[0]) {
                    const formData = new FormData();
                    formData.append("photo", imageInput.files[0]);
                    const uploadRes = await fetch(
                        "/api/cafes/" + encodeURIComponent(currentCafeId) + "/photos",
                        {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer " + authToken
                            },
                            body: formData
                        }
                    );
                    if (!uploadRes.ok) {
                        alert(
                            currentLang === "ru"
                                ? "Не удалось загрузить фото"
                                : currentLang === "en"
                                ? "Failed to upload photo"
                                : "사진을 업로드하지 못했습니다."
                        );
                        return;
                    }
                    try {
                        const uploaded = await uploadRes.json();
                        const uploadedPhotos =
                            uploaded && Array.isArray(uploaded.photos) ? uploaded.photos : [];
                        if (uploadedPhotos.length) {
                            const last = uploadedPhotos[uploadedPhotos.length - 1];
                            if (last && last.url) {
                                const photoPayload = { url: last.url };
                                if (last.originalName) {
                                    photoPayload.originalName = last.originalName;
                                }
                                if (last._id) {
                                    photoPayload.cafePhotoId = last._id;
                                }
                                postPhotos.push(photoPayload);
                            }
                        }
                    } catch (e) {
                    }
                }

                const res = await fetch(
                    "/api/cafes/" + encodeURIComponent(currentCafeId) + "/posts",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + authToken
                        },
                        body: JSON.stringify(
                            postPhotos.length ? { text, photos: postPhotos } : { text }
                        )
                    }
                );
                if (!res.ok) {
                    alert(
                        currentLang === "ru"
                            ? "Не удалось опубликовать пост"
                            : currentLang === "en"
                            ? "Failed to publish post"
                            : "게시글을 발행하지 못했습니다."
                    );
                    return;
                }
                textInput.value = "";
                imageInput.value = "";
                await loadCafePosts(true);
            } catch (err) {
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

    const btnCafePostsLoadMore = document.getElementById("btnCafePostsLoadMore");
    if (btnCafePostsLoadMore) {
        btnCafePostsLoadMore.addEventListener("click", () => {
            loadCafePosts(false);
        });
    }
    const btnCafePagePostsLoadMore = document.getElementById("btnCafePagePostsLoadMore");
    if (btnCafePagePostsLoadMore) {
        btnCafePagePostsLoadMore.addEventListener("click", () => {
            loadCafePosts(false);
        });
    }

    const btnCafeDetailClose = document.getElementById("btnCafeDetailClose");
    if (btnCafeDetailClose) {
        btnCafeDetailClose.addEventListener("click", () => {
            const panel = document.getElementById("cafeDetailPanel");
            if (panel) {
                panel.classList.add("hidden");
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
