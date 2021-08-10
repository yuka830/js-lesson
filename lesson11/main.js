"use strict";

const createLoader = () => {
  const wrapper = document.getElementById("js-wrapper");
  const loader = document.createElement("div");
  const loaderImage = document.createElement("img");
  loader.id = "loader";
  loader.classList.add("loading");
  loaderImage.src = "img/loading-circle.gif";
  wrapper.appendChild(loader).appendChild(loaderImage);
};

const loading = () => {
  const loader = document.getElementById("loader");
  loader.classList.add("loading");
};

const loaded = () => {
  const loader = document.getElementById("loader");
  loader.classList.add("loaded");
};

const jsonUrl = "https://jsondata.okiba.me/v1/json/PBH3M210806155341";

const createNewList = (data) => {
  const ul = document.getElementById("js-lists");
  const fragment = document.createDocumentFragment();

  data.forEach((key) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");

    a.href = `/${key.a}`;
    a.textContent = key.text;
    img.src = key.img;
    img.alt = key.alt;

    fragment
      .appendChild(li)
      .appendChild(a)
      .insertAdjacentElement("afterbegin", img);
  });
  ul.appendChild(fragment);
};

const fetchedData = async () => {
  try {
    const response = await fetch(jsonUrl);
    const json = await response.json();
    return json.data;
  } catch (error) {
    const wrapper = document.getElementById("js-wrapper");
    wrapper.textContent = "データの取得ができませんでした。";
    console.error(error);
  } finally {
    loaded();
  }
};

const init = async () => {
  const val = await fetchedData();
  createNewList(val);
};

createLoader();
loading();
init();
