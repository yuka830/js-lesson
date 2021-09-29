"use strict";

const jsonUrl = "https://jsondata.okiba.me/v1/json/BFwf7210926001715";
const newsWrapper = document.getElementById("js-news");
const tabUl = document.getElementById("js-news-tabs");

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

//comment-icon
const commentIcon = createElementWithClassName("span", "comment-icon");

//new-label
const newLabel = createElementWithClassName("span", "new-label");
newLabel.textContent = "NEW!";

//news-img
const imgWrapper = createElementWithClassName("div", "news__img");

//tab
const createNewTab = (data) => {
  const tabFragment = document.createDocumentFragment();

  data.forEach((key,index) => {
    const tabLi = createElementWithClassName("li", "tab");
    tabLi.textContent = key.category;
    tabLi.dataset.id= key.id;
    if (index === 0) {
      tabLi.classList.add("is-active");
    }

    tabLi.addEventListener("click", tabSwitch);
    tabFragment.appendChild(tabLi);
  });

  tabUl.appendChild(tabFragment);
};

//news
const createNewContent = (data) => {
  const contentFragment = document.createDocumentFragment();

  data.forEach((key,index) => {
    const newsContent = createElementWithClassName("div", "news__content");
    const contentUl = createElementWithClassName("ul", "js-news__lists");
    const titleFragment = document.createDocumentFragment();
    newsContent.dataset.content = key.id;

    key.article.forEach((array) => {
      const contentLi = createElementWithClassName("li", "news__item");
      const a = document.createElement("a");
      a.textContent = array.title;
      a.href = "#";
      titleFragment.appendChild(contentLi).appendChild(a);
    });

    if (index === 0) {
      //とりあえず最初のインデックスをアクティブなタブとする
      newsContent.classList.add("is-show");
    }
    contentFragment
      .appendChild(newsContent)
      .appendChild(contentUl)
      .appendChild(titleFragment);
  });

  newsWrapper.appendChild(contentFragment);
};

//tabSwitch
const tabSwitch = () => {
  tabUl.addEventListener("click", (e) => handleClick(e));
};

const handleClick = (e) => {
  e.preventDefault();
  initNewsElements();
  showNewsElements(e);
};

const showNewsElements = (e) => {
  const eventTarget = e.target;
  const dataCategory = eventTarget.dataset.id;
  eventTarget.classList.add("is-active");
  const target = `[data-content="${dataCategory}"]`;
  newsWrapper.querySelector(target).classList.add("is-show");
};

const initNewsElements = () => {
  const activeTab = document.querySelector(".is-active");
  const activeContent = document.querySelector(".is-show");
  activeTab.classList.remove("is-active");
  activeContent.classList.remove("is-show");
};

const fetchedData = async () => {
  try {
    const response = await fetch(jsonUrl);
    const json = await response.json();
    return json.data;
  } catch (error) {
    newsWrapper.textContent = "データの取得ができませんでした。";
    console.error(error);
  } finally {
    console.log("処理が終了しました。");
  }
};

const init = async () => {
  const newsUiData = await fetchedData();
  createNewTab(newsUiData);
  createNewContent(newsUiData);
};

init();
