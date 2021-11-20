const jsonUrl = "https://jsondata.okiba.me/v1/json/YbIZe211030061143";
const slideshowWrap = document.getElementById("js-slideshow");
const ul = document.getElementById("js-img-list");
let imgArray = [];

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
      clickEvents("nextElementSibling");
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
      clickEvents("previousElementSibling");
    },
    false
  );
};

const clickEvents = (SwitchDirection) => {
  switchImgForBtn([SwitchDirection]);
  switchDotForBtn([SwitchDirection]);
  switchDisableForBtn();
  getCurrentPageNum();
};

const switchImgForBtn = (SwitchDirection) => {
  const currentImg = document.querySelector(".is-show");
  if (currentImg[SwitchDirection]) {
    currentImg.classList.remove("is-show");
    currentImg[SwitchDirection].classList.add("is-show");
  }
};

const switchDotForBtn = (SwitchDirection) => {
  const currentDot = document.querySelector(".is-active");
  if (currentDot[SwitchDirection]) {
    currentDot.classList.remove("is-active");
    currentDot[SwitchDirection].classList.add("is-active");
  }
};

const createArrayOfImgLists = () => {
  const images = document.querySelectorAll(".slideshow__img");
  const arrayOfImg = Array.from(images);
  return (imgArray = arrayOfImg);
};

const getCurrentImgIndex = () => {
  const isShowImg = document.querySelector(".is-show");
  const currentImgIndex = imgArray.indexOf(isShowImg);
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

  if (getCurrentImgIndex() === imgArray.length - 1) {
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
  pagination.textContent = `${getCurrentImgIndex() + 1}/${imgArray.length}`;
};

const createDotPagination = () => {
  const pagination = createElementWithClassName("div", "dot-pagination");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < imgArray.length; i++) {
    const dot = createElementWithClassName("sapn", "dot");
    //最初のインデックスをアクティブにする
    i === 0 && dot.classList.add("is-active");
    dot.addEventListener(
      "click",
      (e) => {
        switchDot(e);
        switchImgForDot(i);
        switchDisableForBtn();
        getCurrentPageNum();
      },
      false
    );
    fragment.appendChild(dot);
  }
  pagination.appendChild(fragment);
  slideshowWrap.insertAdjacentElement("afterend", pagination);
};

const switchDot = (e) => {
  const activeDot = document.querySelector(".is-active");
  const targetDot = e.target;
  activeDot.classList.remove("is-active");
  targetDot.classList.add("is-active");
};

const switchImgForDot = (index) => {
  const currentImg = document.querySelector(".is-show");
  const indexOfTargetDot = index;
  currentImg.classList.remove("is-show");
  imgArray[indexOfTargetDot].classList.add("is-show");
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
    createDotPagination();
  } else {
    slideshowWrap.textContent = "データがありません。";
  }
};
init();
