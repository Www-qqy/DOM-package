window.dom = {
  //---------------增-------------------------
  create(string) {
    // return document.createElement(tagName);
    const container = document.createElement("template"); //template标签可以容纳任意元素。而div有些元素不能容纳
    container.innerHTML = string.trim();
    // console.log(container);
    return container.content.firstChild;
  },
  //在一个节点之后添加节点
  after(node, node2) {
    //因为只有insertBefore这个API，所以：插在node的下一个节点的前面。
    node.parentNode.insertBefore(node2, node.nextSibling);
    //经检验，如果node节点是最后一个节点，也是可以插入的。
  },
  //在一个节点之前添加节点
  before(node, node2) {
    node.parentNode.insertBefore(node2, node);
  },
  //给一个节点添加子节点
  append(parent, node) {
    parent.appendChild(node);
  },
  //给一个节点添加父节点
  wrap(node, parent) {
    dom.before(node, parent); //先把parent插到node前面，然后把node移动到parent的子节点位置
    dom.append(parent, node);
  },
  //---------------------删----------------------------
  //删除node节点
  remove(node) {
    node.parentNode.removeChild(node); //古老的写法，防止IE不支持。
    return node;
  },
  //删除node节点的所有儿子节点
  empty(node) {
    const array = [];
    let x = node.firstChild;
    while (x) {
      array.push(dom.remove(node.firstChild));
      x = node.firstChild;
    } //empty已被清空
    return array; //返回移除的节点
  },
  //-----------------------------改------------------------------------
  //如果提供三个参数，则为node节点添加属性名（name）和属性值（value），
  //如果提供前两个参数，则返回属性名对应的属性值
  //根据参数不同个数返回不同功能叫重载
  attr(node, name, value) {
    // 重载
    if (arguments.length === 3) {
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      return node.getAttribute(name);
    }
  },
  //两个参数，在node里添加文本内容,添加的内容会覆盖之前的内容
  //一个参数，获取node里的内容
  text(node, string) {
    // 适配
    if (arguments.length === 2) {
      if ("innerText" in node) {
        //判断有无innerText，为了适配IE
        node.innerText = string;
      } else {
        node.textContent = string;
      }
    } else if (arguments.length === 1) {
      if ("innerText" in node) {
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  //改html  同上
  html(node, string) {
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },
  //参数为三时，为node节点添加/修改样式，样式名（name）样式值（value）
  //参数为二时，要看name的类型，有可能是读也可能是写。
  style(node, name, value) {
    if (arguments.length === 3) {
      // dom.style(div, 'color', 'red')
      //如果变量做key的话，不能直接.key，要[key]。
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === "string") {
        // dom.style(div, 'color')
        return node.style[name];
      } else if (name instanceof Object) {
        // dom.style(div, {color: 'red'})
        const object = name;
        for (let key in object) {
          node.style[key] = object[key]; //color=red
        }
      }
    }
  },
  //为节点添加class，调用方式：dom.class.add(node,'blue')
  class: {
    //为节点添加className
    add(node, className) {
      node.classList.add(className);
    },
    //为节点删除className
    remove(node, className) {
      node.classList.remove(className);
    },
    //查询节点是否拥有className
    has(node, className) {
      return node.classList.contains(className);
    }
  },
  //当在node里面触发了eventName事件，调用fn函数
  on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  //--------------------------查----------------------------
  //查询在scope(范围)里面的selector，scope可省略。多个节点。记得加下标呦
  find(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  },
  //返回节点的父节点
  parent(node) {
    return node.parentNode;
  },
  //返回节点的子节点
  children(node) {
    return node.children;
  },
  //返回节点的兄弟节点
  siblings(node) {
    return Array.from(node.parentNode.children).filter(n => n !== node);
  },
  //返回节点的下一个节点（弟弟）
  next(node) {
    let x = node.nextSibling;
    while (x && x.nodeType === 3) {
      //如果是文本（nodeType === 3）（空格等），则再往下找
      x = x.nextSibling;
    }
    return x;
  },
  //返回哥哥节点
  previous(node) {
    let x = node.previousSibling;
    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }
    return x;
  },
  //遍历元素的所有节点，对该元素（nodeList）的每一个节点调用fn函数
  each(nodeList, fn) {
    for (let i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  //获取一个元素的排行（是父结点的第几个儿子）
  index(node) {
    const list = dom.children(node.parentNode);
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i] === node) {
        break;
      }
    }
    return i;
  }
};

// dom.create=function(){};
