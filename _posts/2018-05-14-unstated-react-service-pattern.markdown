---
layout: post
title: The Unstated React Service Pattern
permalink: unstated-react-service-pattern
feature_img: /img/feature/unstated-react-service-pattern.feature.jpg
date: '2018-05-15 02:50:23'
featured: false
categories:
- guide
tags:
- React
- Context API
- Service
- Props
- State
- JavaScript
- Pattern
---

This guide demonstrates a React pattern for sharing global state, without requiring any techniques like 😒 Prop-Drilling, 💲 [MobX](https://mobx.js.org), or tools like 🏀 [Apollo Link State](https://www.apollographql.com/docs/link/links/state/) and 🔥 [Redux](https://redux.js.org/).

> The above emojis were auto-selected by [Emoj](https://github.com/sindresorhus/emoj).

## The React Context API

Recently I found myself at an [Advanced React Training](https://reacttraining.com/) with Michael Jackson (no… not the King of Pop, the King of [React Router](https://github.com/ReactTraining/react-router) 😉). We spent a good deal of the time working through Higher Order components and the new React Context API.

Being so new to The React Way, (yet so familiar with frameworks like Angular), I was surprised that React didn’t ship with any built-in service architecture. React is a very different beast to other frameworks. It is intentionally designed to be all-state and no-service.

If you want to learn more about the React Context API, I recommend reading:

1. The React Docs: [The React Context API](https://reactjs.org/docs/context.html)
2. Blog: [How to use the new React Context API](https://hackernoon.com/how-to-use-the-new-react-context-api-fce011e7d87)

    _I found this blog post easier to understand than the examples in the React documentation — perhaps because I’m still on the React learning curve._

In my opinion, the fact that React is now shipping the Context API as a first-class citizen, means that a subscribing to global state (to use the term loosely), is no longer considered an anti-pattern. React is now providing a de-facto way of sharing state within the React tree without some of the limitations of higher order components.

> But, the React Context API does not provide a method of dependency injection.

## "Unstated" Dependency Injection

Dependency injection would allow us to instantiate multiple copies of a component with a discrete state that can be provided and consumed at any point in the app.

This pattern is useful for:

- Identical components that subscribe to different data sources with the same model, using the same methods and state properties
- Testing snapshots with mock states

![Unstated React Helper Logo](/img/posts/1_yViPeWhv8-eGP89lU9pdjg.png)

Thankfully, there is ["Unstated"](https://github.com/jamiebuilds/unstated) — a tiny dependency that provides a handy wrapper around the Context API for dependency injection. I want to encourage you to read the Unstated documentation and get a feel for what it does, as I will be using it in the code examples below: [Unstated README.md](https://github.com/jamiebuilds/unstated/blob/master/README.md).

## Unstated Injection Demo

This CodeSandbox shows how to use Unstated to create multiple instantiations and inject them into separate providers of the same component.

<iframe
     src="https://codesandbox.io/embed/p9w97jp9vj?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="React Shared Dependency Injection w/ &quot;Unstated&quot; "
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>


## Example: Creating a React Service with “Unstated”

So lets dig into things. My goal is make a reusable service module that I can inject into any part of the app. Our API Service must have the following requirements:

1. Must be a self-contained re-usable module
2. Can be Provided at any point in the React App
3. Can be Subscribed to anywhere in the React App _without need for prop-drilling_

To keep things simple, we will mock out an API Service with the following methods and props.

- boolean 'loggedIn'
- function 'logIn()'
- function 'logOut()'

The Api.js module might look something like this:

```jsx
/* Api.js */

import React from "react";
import { Provider, Subscribe, Container } from "unstated";

// Create a Container for our React Context. This container will
// hold state and methods just like a react component would:
export class ApiContainer extends Container {
  constructor() {
    super();

    // The state will be available to any component we inject
    // the Container instance into
    this.state = {
      loggedIn: false
    };
  }

  // These methods will also be avaiable anywhere we inject our
  // container context
  async login() {
    console.log("Logging in");
    this.setState({ loggedIn: true });
  }

  async logout() {
    console.log("Logging out");
    this.setState({ loggedIn: false });
  }
}

// Following the Singleton Service pattern (think Angular Service),
// we will instantiate the Container from within this module
const Api = new ApiContainer();

// Then we will wrap the provider and subscriber inside of functional
// React components. This simplifies the resuse of the module as we
// will be able to import this module as a depenency without having
// to import Unstated and/or create React Contexts  manually in the
// places that we want to Provide/Subscribe to the API Service.
export const ApiProvider = props => {
  // We leave the injector flexible, so you can inject a new dependency
  // at any time, eg: snapshot testing
  return <Provider inject={props.inject || [Api]}>{props.children}</Provider>;
};

export const ApiSubscribe = props => {
  // We also leave the subscribe "to" flexible, so you can have full
  // control over your subscripton from outside of the module
  return <Subscribe to={props.to || [Api]}>{props.children}</Subscribe>;
};

export default Api;

// IMPORT NOTE:
// With the above export structure, we have the ability to
// import like this:

// import Api, {ApiProvider, ApiSubscribe, ApiContainer}

// Api: Singleton Api instance, exported as default.
//      Contains your instantiated .state and methods.

// ApiProvider: Context Provider...
//      Publishes your React Context into the top of the
//      React App into the component tree.

// ApiSubscribe: Context Subsriber...
//      Subscribes to the higher Context from any place
//      lower than the point at which the Context was provided.

// ApiContainer:Context Container Class...
//      Used to instantiate new copy of your service if so desired.
//      Can be used for testing, or subsrcibing your class to a new
//      data source that uses the same data model/methods.
```

Now that we have our API service wrapped in module with Unstated, lets pull that into the top of our React App, inside of index.js:

```jsx
/* index.js */

import React from "react";
import { render } from "react-dom";
import Routes from "./Routes";

// We can now import Api and unstated as one module
// This is our Api "Service".
import { ApiProvider } from "./Api";

// We can provide the API Context at the root of the React App
// with the <Api.Provier> component we created in the Api module
class App extends React.Component {
  render() {
    return (
      <div>
        <ApiProvider>
          <Routes />
        </ApiProvider>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
```

The next piece of the puzzle is subscribing to the API Service from deep within the React App. To make our example a little more realistic, I am going to subscribe to the API service from down in the React components that get loaded by the router.

Lets subscribe to our API Service inside of Pages/Home.js:

```jsx
/* pages/Home.js */

import React from "react";

// Import our Api Service Subscriber
import { ApiSubscribe } from "../Api";

const Home = () => {
  return (
    // Subscrube to the API Container instance. We can now pass
    // `api` into our component and use it's state and methods
    // without prop-drilling
    <ApiSubscribe>
      {api => (
        <div>
          <h1>🏠 Home</h1>
          <pre>
            api.state.loggedIn = {api.state.loggedIn ? "👍 true" : "👎 false"}
          </pre>
          <button onClick={() => api.login()}>Login</button>
          <button onClick={() => api.logout()}>Logout</button>
        </div>
      )}
    </ApiSubscribe>
  );
};

export default Home;
```

After adding a few more Routes and subscribing to the same API Container, we have our pattern set up.

Take the the pattern for a quick spin in this CodeSandbox below. Test the following:

- Click **Login**: `state.loggedIn` prop gets updated in each route
- Click **Logout**: `state.loggedIn` prop gets updated in each route
- Click **Login/Logout**: from any route, the state is updated in all routes

<iframe
     src="https://codesandbox.io/embed/xo679ykm1o?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="API Service Wrapper w/ React Unstated &amp; Context API (v2.0.0)"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>

## Conclusion

Now we have a simple, re-usable React Service that uses the naturalized React Context API and the tiny Unstated module.

- No prop drilling required
- Dependency injection when needed

> I’m going to call this the "The Unstated React Service Pattern" (unless another name already exists, or you have a better one 😀).

I am new to React. Most of the apps I have built in the last four years have been Angular or Vue.js. If you are an experienced React dev and you see a better way to do this, kindly share the ❤️ and show us your approach in the comments.

Always ready to learn.