const jsonUrl = "https://jsondata.okiba.me/v1/json/YbIZe211030061143";
const slideshowWrap = document.getElementById("js-slideshow");
const ul = document.getElementById("js-img-list");
let images = [];

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

const createLoader = () => {
  const loader = document.createElement("div");
  const loaderImage = document.createElement("img");
  loader.id = "js-loader";
  loaderImage.src = "img/loading-circle.gif";
  slideshowWrap.appendChild(loader).appendChild(loaderImage);
};

const loading = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loading");
};

const loaded = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loaded");
};

const fetcheDataInSecond = (sec, jsonUrl) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fetch(jsonUrl));
    }, sec);
  });
};

const fetcheImgData = async () => {
  const numOfSecond = 3000;
  try {
    const response = await fetcheDataInSecond(numOfSecond, jsonUrl);
    const json = await response.json();
    return json.images;
  } catch (e) {
    slideshowWrap.style.margin = 0;
    slideshowWrap.textContent = "データの取得ができませんでした。";
    console.error(e);
  } finally {
    loaded();
  }
};

const createListsOfImg = (imgData) => {
  const fragment = document.createDocumentFragment();
  imgData.forEach((imgVal, index) => {
    const li = createElementWithClassName("li", "slideshow__img");
    const img = document.createElement("img");
    img.src = imgVal.src;

    //とりあえず最初のインデックスを表示
    index === 0 && li.classList.add("is-show");

    fragment.appendChild(li).appendChild(img);
  });
  ul.appendChild(fragment);
};

const createArrowBtnForSlideshow = () => {
  createNextBtn();
  createBackBtn();
};

const createNextBtn = () => {
  const nextBtn = createElementWithClassName("button", "btn");
  nextBtn.id = "js-next-btn";
  nextBtn.textContent = ">";
  ul.insertAdjacentElement("afterend", nextBtn);
  nextBtn.addEventListener(
    "click",
    () => {
      clickBtnEvents("nextElementSibling");
    },
    false
  );
};

const createBackBtn = () => {
  const backBtn = createElementWithClassName("button", "btn");
  backBtn.id = "js-back-btn";
  backBtn.textContent = "<";
  backBtn.disabled = true;
  ul.insertAdjacentElement("beforebegin", backBtn);
  backBtn.addEventListener(
    "click",
    () => {
      clickBtnEvents("previousElementSibling");
    },
    false
  );
};

const clickBtnEvents = (switchDirection) => {
  switchImgForBtn(switchDirection);
  changeIndicator(switchDirection);
  switchDisableForBtn();
  getCurrentPageNum();
};

const switchImgForBtn = (switchDirection) => {
  const currentImg = document.querySelector(".is-show");
  if (currentImg[switchDirection]) {
    currentImg.classList.remove("is-show");
    currentImg[switchDirection].classList.add("is-show");
  }
};

const changeIndicator = (switchDirection) => {
  const currentIndicator = document.querySelector(".is-active");
  if (currentIndicator[switchDirection]) {
    currentIndicator.classList.remove("is-active");
    currentIndicator[switchDirection].classList.add("is-active");
  }
};

const createArrayOfImgLists = () => {
  const imgLists = document.querySelectorAll(".slideshow__img");
  const arrayOfImg = Array.from(imgLists);
  return (images = arrayOfImg);
};

const getCurrentImgIndex = () => {
  const isShowImg = document.querySelector(".is-show");
  const currentImgIndex = images.indexOf(isShowImg);
  return currentImgIndex;
};

const switchDisableForBtn = () => {
  const nextBtn = document.getElementById("js-next-btn");
  const backBtn = document.getElementById("js-back-btn");

  if (getCurrentImgIndex() === 0) {
    backBtn.disabled = true;
  } else {
    backBtn.disabled = false;
  }

  if (getCurrentImgIndex() === images.length - 1) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
};

const createNumPagination = () => {
  const pagination = createElementWithClassName("p", "number-pagination");
  slideshowWrap.insertAdjacentElement("afterend", pagination);
  getCurrentPageNum();
};

const getCurrentPageNum = () => {
  const pagination = document.querySelector(".number-pagination");
  pagination.textContent = `${getCurrentImgIndex() + 1}/${images.length}`;
};

const createIndicatorForSlideshow = () => {
  createIndicator();
  addEventToIndicator();
};

const createIndicator = () => {
  const pagination = createElementWithClassName("div", "indicators");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < images.length; i++) {
    const indicator = createElementWithClassName("sapn", "indicator");
    //最初のインデックスをアクティブにする
    i === 0 && indicator.classList.add("is-active");
    fragment.appendChild(indicator);
  }
  pagination.appendChild(fragment);
  slideshowWrap.insertAdjacentElement("afterend", pagination);
};

const addEventToIndicator = () => {
  const indicator = document.querySelector(".indicators");
  indicator.addEventListener(
    "click",
    (e) => {
      clickIndicatorEvents(e);
    },
    false
  );
};

const clickIndicatorEvents = (e) => {
  switchActiveIndicator(e);
  switchImgForIndicator(e);
  switchDisableForBtn();
  getCurrentPageNum();
};

const switchActiveIndicator = (e) => {
  const activeIndicator = document.querySelector(".is-active");
  const targetIndicator = e.target;
  activeIndicator.classList.remove("is-active");
  targetIndicator.classList.add("is-active");
};

const switchImgForIndicator = (e) => {
  const currentImg = document.querySelector(".is-show");
  const targetIndicator = e.target;
  const indexOfTargetIndicator = createArrayOfIndicators().indexOf(
    targetIndicator
  );
  currentImg.classList.remove("is-show");
  images[indexOfTargetIndicator].classList.add("is-show");
};

const createArrayOfIndicators = () => {
  const indicator = document.querySelectorAll(".indicator");
  const arrayOfIndicator = Array.from(indicator);
  return arrayOfIndicator;
};

const init = async () => {
  createLoader();
  loading();
  let imgData;
  try {
    imgData = await fetcheImgData();
  } catch (e) {
    console.error(e);
  } finally {
    console.log("処理が完了しました。");
  }
  if (imgData.length !== 0) {
    createListsOfImg(imgData);
    createArrayOfImgLists();
    createArrowBtnForSlideshow();
    createNumPagination();
    createIndicatorForSlideshow();
  } else {
    slideshowWrap.textContent = "データがありません。";
  }
};
init();
