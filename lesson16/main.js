"use strict";

const jsonUrl = "https://jsondata.okiba.me/v1/json/yFXrE210903000829";
const newsWrapper = document.getElementById("js-news");

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
const createNewTab = data => {
  const tabUl = document.querySelector(".news__tabs");
  const tabFragment = document.createDocumentFragment();

  data.forEach( key => {
    const tabLi = createElementWithClassName("li", "tab");
    tabLi.textContent = key.category;
    tabLi.dataset.tab = key.id;
    if (key.selected) {
      tabLi.classList.add("is-active");
    }

    tabLi.addEventListener("click", tabSwitch);
    tabFragment.appendChild(tabLi);
  });

  tabUl.appendChild(tabFragment);
};

//news
const createNewContent = data => {
  const contentFragment = document.createDocumentFragment();

  data.forEach( key => {
    const newsContent = createElementWithClassName("div", "news__content");
    const contentUl = createElementWithClassName("ul", "js-news__lists");
    const titleFragment = document.createDocumentFragment();
    newsContent.dataset.content = key.id;

    key.article.forEach( array => {
      const contentLi = createElementWithClassName("li", "news__item");
      const a = document.createElement("a");
      a.textContent = array.title;
      a.href = "#";
      titleFragment.appendChild(contentLi).appendChild(a);
    });

    if (key.selected) {
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
  const tabs = document.querySelectorAll("[data-tab]");
  const contents = document.querySelectorAll("[data-content]");

  const handleClick = (e) => {
    const targetTab = e.target;
    const targetTabVal = targetTab.dataset.tab;
    e.preventDefault();
    hideNewsElements(tabs, contents);
    showNewsElements(targetTab, targetTabVal);
  };

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", (e) => handleClick(e));
  }
};

const showNewsElements = (tabElement, dataSetVal) => {
  const target = `[data-content="${dataSetVal}"]`;
  newsWrapper.querySelectorAll(target)[0].classList.add("is-show");
  tabElement.classList.add("is-active");
};

const hideNewsElements = (tabDataSetArray, contentDataSetArray) => {
  for (let i = 0; i < tabDataSetArray.length; i++) {
    tabDataSetArray[i].classList.remove("is-active");
    contentDataSetArray[i].classList.remove("is-show");
  }
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
