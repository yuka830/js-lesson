"use strict";

import { differenceInDays } from "date-fns";

const jsonUrl = "https://jsondata.okiba.me/v1/json/ifwSK211027002739";
const newsWrapper = document.getElementById("js-news");
const tabUl = document.getElementById("js-news-tabs");

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

//comment-icon
const creatCommentIcon = (element) => {
  const commentSpan = createElementWithClassName("span", "comment-icon");
  const commentImg = document.createElement("img");
  commentImg.src = "./img/comment.png";
  commentSpan.appendChild(commentImg);
  element.appendChild(commentSpan);
};

//new-label
const creatNewLabel = (element) => {
  const newLabel = createElementWithClassName("span", "new-label");
  newLabel.textContent = "NEW!";
  element.appendChild(newLabel);
};

//news-img
const creatNewsImg = (element, category) => {
  const imgWrapper = createElementWithClassName("div", "news__img");
  const newsImg = document.createElement("img");
  newsImg.src = `./img/${category}.png`;
  imgWrapper.appendChild(newsImg);
  element.appendChild(imgWrapper);
};

//tab
const createNewTab = (newsUiItems) => {
  const tabFragment = document.createDocumentFragment();

  newsUiItems.forEach((newsUiItem, index) => {
    const tabLi = createElementWithClassName("li", "tab");
    tabLi.textContent = newsUiItem.category;
    tabLi.dataset.category = newsUiItem.category;
    index === 0 && tabLi.classList.add("is-active");

    tabLi.addEventListener("click", tabSwitch);
    tabFragment.appendChild(tabLi);
  });

  tabUl.appendChild(tabFragment);
};

//news
const createArticleTitles = ({ articles }) => {
  const titleFragment = document.createDocumentFragment();
  articles.forEach((article) => {
    const contentLi = createElementWithClassName("li", "news__item");
    const a = document.createElement("a");
    a.textContent = article.title;
    a.href = "#";
    titleFragment.appendChild(contentLi).appendChild(a);

    const distanceDate = differenceInDays(
      new Date(2021, 8, 14),
      new Date(article.date)
    );
    distanceDate <= 3 && creatNewLabel(contentLi);
    article.comments > 0 && creatCommentIcon(contentLi);
  });
  return titleFragment;
};

const createContentsItem = (newsUiItems) => {
  const contentFragment = document.createDocumentFragment();
  newsUiItems.forEach((newsUiItem, index) => {
    const newsContent = createElementWithClassName("div", "news__content");
    const elementForFlex = createElementWithClassName("div", "flex");
    const contentUl = createElementWithClassName("ul", "js-news__lists");
    const categoryName = newsUiItem.category;
    newsContent.classList.add(`js-${categoryName}`);
    //とりあえず最初のインデックスをアクティブなタブとする
    index === 0 && newsContent.classList.add("is-show");
    creatNewsImg(elementForFlex, categoryName);

    contentFragment
      .appendChild(newsContent)
      .appendChild(elementForFlex)
      .appendChild(contentUl)
      .appendChild(createArticleTitles(newsUiItem));
  });
  return contentFragment;
};

//news
const createNewContent = (newsUiItems) =>
  newsWrapper.appendChild(createContentsItem(newsUiItems));


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
  const dataCategory = eventTarget.dataset.category;
  eventTarget.classList.add("is-active");
  const target = `.js-${dataCategory}`;
  newsWrapper.querySelector(target).classList.add("is-show");
};

const initNewsElements = () => {
  const activeTab = document.querySelector(".is-active");
  const activeContent = document.querySelector(".is-show");
  activeTab.classList.remove("is-active");
  activeContent.classList.remove("is-show");
};

const fetchedNewsComponentData = async () => {
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
  const newsUiItems = await fetchedNewsComponentData();
  createNewTab(newsUiItems);
  createNewContent(newsUiItems);
};

init();
