const jsonUrl = "https://jsondata.okiba.me/v1/json/YbIZe211030061143";
const wrapper = document.getElementById("js-wrapper");
const ul = document.getElementById("js-slideshow");
const numOfSecond = 3;

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
  wrapper.appendChild(loader).appendChild(loaderImage);
};

const loading = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loading");
};

const loaded = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loaded");
};

const fetcheDataInSecond = (sec) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fetch(jsonUrl));
    }, sec * 1000);
  });
};


const fetcheImgData = async () => {
  try {
    const response = await fetcheDataInSecond(numOfSecond);
    const json = await response.json();
    return json.images;
  } catch (error) {
    wrapper.textContent = "データの取得ができませんでした。";
    console.error(error);
  } finally {
    loaded();
  }
};

const init = async () => {
  createLoader();
  loading();
  const imgData = await fetcheImgData();
  createListsOfImg(imgData);
};

const createListsOfImg = (imgData) => {
  const fragment = document.createDocumentFragment();
  imgData.forEach((imgVal,index) => {
    const li = createElementWithClassName("li","slideshow-img");
    const img = document.createElement("img");
    img.src = imgVal.src;

    index === 0 && li.classList.add("is-show");

    fragment.appendChild(li).appendChild(img);
  })
ul.appendChild(fragment);
}

init();

