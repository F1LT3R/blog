---
layout: post
title: TypeScript?.. or JavaScript?
permalink: typescript-or-javascript
date: '2020-07-23 08:08:08'
feature_img: /img/feature/fighter-jet-jet-aircraft-army-87088.png
featured: true
categories:
- opinion
tags:
- TypeScript
- JavaScript
- Closures
- Object Composition
- 1st Class Functions
- Node.js
---

### TypeScript is JavaScript's Aircraft Carrier

To draw an analogy, JavaScript is a jump-jet and TypeScript is an aircraft carrier; And even though TypeScript is safe, it's still not safe enough to run a nuclear power plant.

I choose JavaScript! Why?  
  
1. Better composability
2. Faster development

### Type Safety Bugs

I spend about 1% of my time dealing with types and type related bugs in JavaScript. To be fair, I use Prettier, ESLint, & BDD with VS Code, so most type safety bugs get knocked down before production anyway.

Eric Elliot has a good post on this called, [The TypeScript Tax](https://medium.com/javascript-scene/the-typescript-tax-132ff4cb175b).

### Classes

TypeScript's classes don't get me excited, because I don't use classes. I prefer JavaScript object composition.

#### Enclosed Pure Object Composition 

I like to use Enclosed Pure Object Composition in place of Object Oriented Programming. Conceptually, the mental model is exactly the same, but with the added powers that first-class functions absorb in the Web's event based architecture. Everything I need from OOP can be done with plain JavaScript. No prototypes. No classes necessary.

For example: here is the Enclosed Object equivalent of a Class:

```js
// Counter.mjs

export const Counter = (count = 0) => ({
  add: () => (count += 1),
  get count() {
    return count;
  },
});

const counter = Counter(2);
counter.add();
counter.add();
console.log(counter.count); // 4
```

This kind of object composition is easier to reason about. It is more performant, and has a lighter memory footprint.

Let's compose...

```js
// Counters.mjs

import Counter from './Counter.mjs';

export const Counters = (...counters) => ({
  add: () => counters.map((counter) => counter.add()),
  get count() {
    return counters.map((counter) => counter.count);
  },
});

const counters = Counters(Counter(0), Counter(1));
counters.add();
console.log(counters.count); // [ 1, 2 ]
```

### Extensible Object Composition

We can make our pattern more extensible. Here is a similar object composition, allowing for the use of JavaScript's `this` keyword.

```js
// Employee.mjs

const methods = () => ({
  work() {
    this.product += this.productivity;
  },

  report() {
    console.log(
      `I'm ${this.name}, a ${this.role}.
       I produced ${this.product} units.`
    );
  }
});

export const Employee = name => ({
  name,
  role: 'worker',
  productivity: 2,
  product: 0,
  ...methods()
});

const al = Employee('Al');
al.work();
al.report();

// I'm Al, a worker. I produced 2 units.
```

Let's extend...


```js
// Manager.mjs

import Employee from './Employee.mjs'

const accept = () => ({
  accept({ role, productivity }) {
    Object.assign(this, {
      role,
      productivity
    });
  }
});

const al = Object.assign(
  Employee('Al'),
  accept()
);

const promotion = {
  role: 'manager',
  productivity: 1
};

al.accept(promotion);
al.work();
al.report();
// I'm Al, a manager. I produced 1 units.
```

JavaScript's `this` keyword is unnecessary. The same result can be achieved by passing the employee's state to the scope of the employee's methods.

```js
// Employee.mjs

const work = state => ({
  work: () => {
    state.product += state.productivity;
  }
});

export const Employee = name => {
  const employee = {
    name,
    role: 'worker',
    productivity: 2,
    product: 0
  };

  return Object.assign(
    employee,
    work(employee)
  );
};

const al = Employee('Al');
al.work();
console.log(al.product); // 2
```

### Anti-Fragile

Object composition in Vanilla JavaScript is anti-fragile. I don't have to keep changing my code when the language's class API surface shifts. I don't have to get things working again when packages in TypeScript's Node ecosystem deliver breaking changes, in exchange for fancier features or security enhancements. (This is not an anti-security statement).

#### Keep The Web Simple

I often wonder how many frontend engineers learn frameworks, libraries and supersets, yet never realize the awesome power of modern JavaScript. 

I love writing pure, enclosed objects, wrapped in the lexical scopes of first class functions, all the way down.; There's Very little magic, and a whole lot of beauty.

If you want learn more about the inner workings of the code patterns above, read Kyle Simpson's excellent book series called, [You Don't Know JS (Yet)](https://github.com/getify/You-Dont-Know-JS).

The following three books are particularly helpful:

1. [Scopes and Closures](https://www.amazon.com/dp/B08634PZ3N?tag=duckduckgo-brave-20&linkCode=osi&th=1&psc=1)
2. [This and Object Prototypes](https://www.amazon.com/You-Dont-Know-JS-Prototypes/dp/1491904151/ref=pd_sbs_14_4/142-5566885-7736938?_encoding=UTF8&pd_rd_i=1491904151&pd_rd_r=f28c61fb-1557-47f9-9aed-e29bdbac1b82&pd_rd_w=f7qyZ&pd_rd_wg=wwrV8&pf_rd_p=bdc67ba8-ab69-42ee-b8d8-8f5336b36a83&pf_rd_r=XJ882256VAPZ0WA58CE5&psc=1&refRID=XJ882256VAPZ0WA58CE5)
3. [ES6 & Beyond](https://www.amazon.com/Kyle-Simpson/dp/1491904240/ref=sr_1_3?dchild=1&keywords=you+dont+know+javascript&qid=1595438516&s=digital-text&sr=1-3-catcorr)

![You Don't Know JavaScript - Book Set](https://images-na.ssl-images-amazon.com/images/I/51llKt2oJEL._SX333_BO1,204,203,200_.jpg)
