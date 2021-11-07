const jsonUrl = "https://jsondata.okiba.me/v1/json/YbIZe211030061143";
const slideshowWrap = document.getElementById("js-slideshow");
const ul = document.getElementById("js-img-list");

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

const numOfSecond = 3000;
const fetcheDataInSecond = (sec, jsonUrl) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fetch(jsonUrl));
    }, sec);
  });
};

const fetcheImgData = async () => {
  try {
    const response = await fetcheDataInSecond(numOfSecond, jsonUrl);
    const json = await response.json();
    return json.images;
  } catch (error) {
    slideshowWrap.textContent = "データの取得ができませんでした。";
    console.error(error);
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
      goNext();
    },
    false
  );
};

const createBackBtn = () => {
  const backBtn = createElementWithClassName("button", "btn");
  backBtn.id = "js-back-btn";
  backBtn.textContent = "<";
  ul.insertAdjacentElement("beforebegin", backBtn);
  backBtn.addEventListener(
    "click",
    () => {
      goBack();
    },
    false
  );
};

const goNext = () => {
  const currentImg = document.querySelector(".is-show");
  if (currentImg.nextElementSibling) {
    currentImg.classList.remove("is-show");
    currentImg.nextElementSibling.classList.add("is-show");
  }
};

const goBack = () => {
  const currentImg = document.querySelector(".is-show");
  if (currentImg.previousElementSibling) {
    currentImg.classList.remove("is-show");
    currentImg.previousElementSibling.classList.add("is-show");
  }
};

const init = async () => {
  createLoader();
  loading();
  const imgData = await fetcheImgData();
  createListsOfImg(imgData);
  createArrowBtnForSlideshow();
};

init();
