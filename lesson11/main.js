"use strict";

const loading = () => {
  const wrapper = document.getElementById("js-wrapper");
  const loader = document.createElement("div");
  const loaderImage = document.createElement("img");
  loader.id = "loader";
  loader.classList.add("loading");
  loaderImage.src = "img/loading-circle.gif";
  wrapper.appendChild(loader).appendChild(loaderImage);
};

const loaded = () => {
  const loader = document.getElementById("loader");
  loader.classList.add("loaded");
};

window.onload = () => {
  loading();

  const fetchedData = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(listItems());
    }, 2500);
  });

  const listItems = async () => {
    const jsonUrl = "https://jsondata.okiba.me/v1/json/PBH3M210806155341";
    const response = await fetch(jsonUrl);
    const json = await response.json();
    return json.data;
  };

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

  const callLists = async () => {
    try {
      const listsContents = await fetchedData;
      return listsContents;
    } catch (error) {
      const wrapper = document.getElementById("js-wrapper");
      wrapper.textContent = "データの取得ができませんでした。";
      console.error(error);
    } finally {
      loaded();
    }
  };

  const init = async () => {
    const val = await callLists();
    createNewList(val);
  };

  init();
};
