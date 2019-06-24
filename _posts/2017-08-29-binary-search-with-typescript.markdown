---
layout: post
title: Binary Search with Typescript

feature_img: https://media2.giphy.com/media/deD6sPhPdGbRojquw4/giphy.gif?cid=790b76115d0cf91a30653259679665c5&rid=giphy.gif

# feature_img: /img/feature/binary-search-typescript-cover.png
featured: true
date: '2017-08-29 01:38:10'
tags:
- binary
- search
- typescript
- javascript
- computer-science
- code
- demo
---

"What is a Binary Search?", I was asked this week. “I have no idea!”, I replied. I was interested to see if I could understand what a Binary Search was and whether I could write a Binary Search with Typescript.

## TLDR;

You can try the [Binary Search Demo](https://f1lt3r.github.io/binary-search-in-typescript/) demo on Github pages:

[![Typescript Binary Search Screenshot](/img/posts/binary-search-typescript-play.png)](https://f1lt3r.github.io/binary-search-in-typescript/)

### Why Typescript?

Recently I have been taking the course [Understanding Typescript](https://www.udemy.com/understanding-typescript/) on Udemy with
[Maximilian Schwarzmüller](https://www.linkedin.com/in/maximilian-schwarzm%C3%BCller-66b152a5/). I am finding this course to be a wonderful introduction to Typescript. The course is extremely clear and well thought out. Putting the Binary Search together in Typescript was be a good way to practice what I was learning.

## What is a Binary Search?

The first Step was figuring out what a Binary Search was. A little Wikipedia reading and Youtube watching did the trick. [The Binary Search entry on Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm) helped me to understand the basic concept.

```typescript
const ary: number[] = [1, 2, ... 99, 100]
```

The concept is this: if you take an array of numbers, say from *1–100*, and you want to search for the number *27*, you do not need to pass through all 100 indexes of the array. That would not be the most efficient method.

Wouldn’t it be great if there was a way to chop out parts of the array that you knew you did not need to search?

Ah but there is…

[![Source: Wikipedia](/img/posts/440px-Binary_Search_Depiction.svg.png)](https://en.wikipedia.org/wiki/Binary_search_algorithm)

```typescript
const valueAtMiddle: number = ary[50]

if (valueAtMiddle > 27) {
    const reducedSearch: number[] = arg.slice(0, middle)
}
```

If I chop my array of 100 numbers in half at index *50*, and the value at the half-way point is greater than my target-number *27*, then I know that I don’t have to search the 2nd-half of the array.

Wonderful!

We can keep iterating through the array this way, chopping left, or chopping right, until we either find the value we want, or we run out of array to chop.

So I suppose *"Binary Search"* might get it’s name because it either searches *this-half* of the array or *that-half* of the array. But perhaps there is another good reason to call it a “Binary Search”, namely… it’s logarithm.

## Worst Case Performance

Before we get to the naming... lets look at another interesting feature of Binary Search. It follows something called "O(Log N)", which describes the [Worst Case Performance](https://en.wikipedia.org/wiki/Best,_worst_and_average_case) of the search algorithm.

> In computer science, best, worst, and average cases of a given algorithm express what the resource usage is at least, at most and on average, respectively. Usually the resource being considered is running time, i.e. time complexity, but it could also be memory or other resource.  
> [Wikipedia](https://en.wikipedia.org/wiki/Best,_worst_and_average_case)

But what on earth does *O(Log N)* actually mean?

Reading the Wikipedia page for [Big O Notation](https://en.wikipedia.org/wiki/Big_O_notation) was not a huge help to me (too many scary math symbols); but I found the following Youtube video by Matt Garland helped me understand *just-enough*, that I calculate the Worst Case Performance in JavaScript.

<iframe width="560" height="315" src="https://www.youtube.com/embed/kjDR1NBB9MU" frameborder="0" allowfullscreen></iframe>

What we are trying to get at when we talk about *"performance"* here? We are asking the question:

> "How many times do we need to iterate the search function before we can know whether the target value exists in the array?"

That’s a super-cool question!

If you watched the video above, or you are a computer science/math grad, you probably already have a good idea of the answer.

In short: the number of times you need to search the array, will be a logarithm of the length of the array. In JavaScript you can use `Math.log2(ary.length)` to know how many iterations you will need before you can safely stop searching the array.

```typescript
const ary: number[] = [1, 2, ..., 63, 100]
const worstCasePerformance: number = Math.log2(ary.length)
// 6.643856189774724

const maxIterations: number = Math.ceil(worstCasePerformance)
// 7
```

### What's In a Name?

And so back to the naming... this is why I think naming Binary Search for it’s logarithmic qualities is cute… because binary notation also follows O(Log N).

For example:

```typescript
// Binary [32, 16, 8, 4, 2, 1] (value of each binary digit)
// Index  [ 5,  4, 3, 2, 1, 0] (inverse index)
// Digits [ 1,  1, 1, 1, 1, 1] (binary number for "63")

const value: number = 0b111111  // Binary Number notation (ES6)

console.log(value)  // Logs "63"
```

Looking at this code example, you can see that the value of each binary digit doubles, from *right-to-left*. So the binary number `0b100000` has a *Base-10* value of *32* and the binary number `0b111111` has a Base-10 value of *63*. 

This means that the index position of each digit, from right-to-left, is the O(Log N) of it’s Base-10 value. :)

```typescript
const binaryValues = [32, 16, 8, 4, 2, 1]

Map each number to Log2
const ahha = binaryValues.map(Math.log2)

console.log(ahha)
// Logs [5, 4, 3, 2, 1, 0]
```

## Show Me The Code

With the understanding of the basic operations of a Binary Search, and enough knowledge of O(Log N) to get the job done, I started working on an approach to solving the problem in Typescript.

[Click here to try the Binary Search Demo](https://f1lt3r.github.io/binary-search-in-typescript/)

[![Typescript Binary Search Screenshot](/content/images/2017/09/binary-search-typescript-play.png)](https://f1lt3r.github.io/binary-search-in-typescript/)

### Exit Strategies

There are *3* kinds of exits available in my solution:

1. **Success:** Target found, returns index
2. **Failure #1:** Target not found - exits where no array is left to search
3. **Failure #2:** Target not found - exit when iterated past O(Log N)

I used a Typescript `ENUM` to specify which type of failure we would like to test when the script is run, this way we can switch between the exit strategies in [the Github pages demo](https://f1lt3r.github.io/binary-search-in-typescript/).

```typescript
enum FailExits {
    ologn,
    nochop
}

let exit = FailExits.ologn
let iterCount:number
let maxIterations: number
```

Now we have a counter, a max iteration variable and an exit strategy, we can create the recursive compare function that will do the more interesting work of stepping through the array. Here is the basic handling of the variables:

```typescript
const compare = (target: number, ary: number[], start: number, end: number): 
number[] | number | boolean => {
    // Find the range between the start and the end
    // (we want to chop this in half to reduce the search)
    const range: number = end - start
    
    // Our midPoint is the value of the half-way point...
    // Note: this could be a decimal!
    const midPoint: number = start + (range / 2)
    
    // Our midIndex must be an Integer to access the array index
    const midIndex: number = Math.floor(midPoint)
    
    // Finally get the value of the number half way through the array
    // This is what we will compare to our target value
    const midValue: number = ary[midIndex]
}
```

Once we have the search positions and the compare values, we can add the logic to we need to evaluate the next action. The rest of the function here handles the logic deciding whether we should exit or continue searching.

```typescript
const compare = (target: number, ary: number[], start: number, end: number): 
number[] | number | boolean => {
    
    ...
    
    // Fail: Exit Strategy 1 - If we iterated past O(Log N)
    if (iterCount > maxIterations && exit === FailExits.ologn) {
        return false
    }
    iterCount += 1

    // Sucess: We found the value we were looking for!
    if (midValue === target) {
        return midIndex
    }

    // Fail: Exit Strategy 2 - No more array to look in
    // If the start and the middle of the range have the same
    // array-index, then we know it's time to exit
    if (start === midIndex && exit === FailExits.nochop) {
        return false
    }

    // Continue: Chop Left
    // We know the index of the target value has to be in 
    // the lower half of the array (if it exists)
    if (target < midValue) {
        start = start
        end = midIndex
    }

    // Continue: Chop Right
    // We know the index of the target value has to be in 
    // the upper half of the array (if it exists)
    if (target > midValue) {
        start = midIndex
    }

    // This compare function calls itself again with the
    // new start and end values until it exits
    return compare(target, ary, start, end)
}
```

And that's it!

Check out [The Live Demo](https://f1lt3r.github.io/binary-search-in-typescript/) here and try tweaking the values to see what happens.

## Conclusion

### Using Typescript

Creating the Binary Search was a fun puzzle. Adding Typescript in the mix gave me the opportunity to learn some interesting things about how Typescript interacts with browser elements.

For example: there is such a thing as an `HTMLElement` type.

```typescript
const elem: HTMLElement document.getElementById('foo')
```

And I also did not know that some types have un-documented functions, that prohibit the use of dot-notation. 

```typescript
elem.addEventListener('click', (event: Event): void => {
    const checked: boolean = event.target.checked
    // ERROR: Property 'checked' does not exist on type EventTarget
    
    const checked: boolean = event.target['checked']
    // PASS!
}
```

This seems odd, so I am assuming there is something I have not yet learned about Typescript here.

### Alogithmic Efficiency

I also believe I could get a lot more performance out of the alogithm if my *start-index*, *end-index* and *target-value* existed outside of the `compare()` function.

And so this:

```typescript
const compare = (target: number, ary: number[], start: number, end: number) {
    compare(target, ary, start, end)
}
```

Might be better written like this:

```typescript
let target: number = 11
let ary: number[] = [1, ... 71]
let start: number = 0
let end: number = ary.length

// No variables passed into the function = less memory overhead
const compare = () {
    compare()
}
```

I think passing the array + values to the next `compare()` call will incur extra memory overhead. Not enough to worry about in a simple web page, but this could be a real concern if you were iterating large quanities of data server-side.

Thoughts, comments, ideas? Let me know what you think.
