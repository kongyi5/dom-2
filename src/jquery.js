window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      elements = [createElement(selectorOrArrayOrTemplate)];
    } else {
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArray;
  }

  function createElement(string) {
    const container = document.createElment("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }

  // api 可以操作 elements
  const api = Object.create(jQuery.prototype); // 创建一个对象，这个对象的 __proto__ 为括号里面的东西
  Object.assign(api, {
    elements: elements,
    oldApi: selectorOrArray.oldApi,
  });
  // api.elements = elements
  // api.oldApi =  selectorOrArray.oldApi
  return api;
};
jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jquery: true,
  get(index) {
    return this.elements[index];
  },
  appendTo(children) {
    if (children instanceof Element) {
      this.get(0).appendChild(children);
    } else if (children instanceof HTMLCollection) {
      for (let i = 0; i < children.length; i++) {
        this.get(0).appendChild(children[i]);
      }
    } else if (children.jquery === true) {
      children.each((node) => this.get(0).appendChild(node));
    }
  },
  find(selector) {
    let array = [];
    for (let i = 0; i < elements.length; i++) {
      const elements2 = Array.from(elements[i].querySelectorAll(selector));
      array = array.concat(elements2);
    }
    array.oldApi = this; // this 是 旧 api
    return jQuery(array);
  },
  each(fn) {
    for (let i = 0; i < elements.length; i++) {
      fn.call(null, elements[i], i);
    }
    return this;
  },
  parent() {
    const array = [];
    this.each((node) => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode);
      }
    });
    return jQuery(array);
  },
  children() {
    const array = [];
    this.each((node) => {
      array.push(...node.children);
    });
    return jQuery(array);
  },
  // 闭包: 函数访问外部变量
  addClass(className) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add(className);
    }
    return this;
  },
  print() {
    console.log(elements);
  },
  end() {
    return this.oldApi; // this 是 新 api
  },
};
