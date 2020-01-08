---
layout: post
title: Coleman-Liau Readability Index
feature_img: https://images.unsplash.com/photo-1521714161819-15534968fc5f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80
date: '2018-03-03 17:38:51'
featured: false
categories:
- article
tags:
- coleman-liau
- readability
- writing
- readable-io
- node-js
---

I became fascinated with the Coleman-Liau readability index while testing various writing tools. Read about how I reverse engineered the Coleman-Liau algorithm to score the readability sentences.

During a spell of frequent writing, I tested a multitude of software tools promising to make my writing better.

The shortlist:

- Grammarly - Grammar, thesaurus features
- Readable.io - Readability Scores
- Scrivener - Organized Writing (Word on Steroids)
- Ulysses - A distraction free Scrivener with Markdown Syntax

All of these tools have different features to offer. All of these tools are great in their own way. But Readable.io was interesting because it provided statistics. The statistics in Readable.io help guide the writer, showing what grade level a reader needs to be to understand the writing.

## Enter Coleman-Liau

I hooked up the Readable.io API to Node.js to experiment with different portions of text.

You can check out the quick Readable.io Node.js repo I created here on Github: [https://github.com/F1LT3R/readable.io-api-example](https://github.com/F1LT3R/readable.io-api-example)

I kept firing text at the API and seeing what scores I got back. I followed up by reading what each of the scores meant in Wikipedia, and on the Readable.io blog.

From the text I used, I felt the Coleman-Liau Index was producing the most consistent results:

```plaintext
"The quick fox jumped over the lazy dog."
// Grade: 3.3
```

```plaintext
"The quick, sly omnivorous mammal jumped energetically over the sullen, sleepy canine."
// Grade: 16.5
```

The levels that are returned by Readable.io represent the educational grade a student would need to comfortably read the text without slowing down.

Because of the simplicity in how the The Coleman-Luau Index is calculated, it appears to have the broadest application to all types of writing, and all kinds of readers.

Other reading level indexes use more complicated methods, like counting syllables, which makes them more difficult to calculate with a computer program, and generally more difficult to use without a computer.


## According to Wikipedia

I became interested in how the Coleman-Liau index was being calculated and so I spent some time reading this Wikipedia article: [Coleman-Liau index](https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index). The article provided a formula to calculate the Coleman Liau Index and a text sample for demonstration:

```plaintext
"Existing computer programs that measure readability are based largely upon subroutines which estimate number of syllables, usually by counting vowels. The shortcoming in estimating syllables is that it necessitates keypunching the prose into the computer. There is no need to estimate syllables since word length in letters is a better predictor of readability than word length in syllables. Therefore, a new readability formula was computed that has for its predictors letters per 100 words and sentences per 100 words. Both predictors can be counted by an optical scanning device, and thus the formula makes it economically feasible for an organization such as the U.S. Office of Education to calibrate the readability of all textbooks for the public school system."
// Grade 14.5
```

The text above is an excerpt from the original paper by Coleman Liau called: [A Computer Readability Formula Designed for Machine Scoring.](http://dx.doi.org/10.1037/h0076540)

The algorithm goes something like this:

```
L = Letters ÷ Words × 100 = 639 ÷ 119 × 100 ≈ 537  
S = Sentences ÷ Words × 100 = 5 ÷ 119 × 100 ≈ 4.20  
CLI = 0.0588 x 537 - 0.296 x 4.20 - 15.8 = 14.5
```

The algorithm can be broken down like so:

```
L = The average number of letters per 100 words
S = The average number of sentences per 100  words
Magic Number #1 =  0.0588
Magic Number #2 =  0.296
Magic Number #2 =  15.8
Reading Grade = (Magic Number #1 * L) - (Magic Number #2 - S) - Magic Number #3
```

There are several frustrating things about the explaination on Wikipedia:

1. Three magic numbers exist in the algorithm. What do they represent? Why do they make the algorithm work? It would be nice if the Wikipedia article explained the reason for the magic numbers.
2. The Wikipedia article uses an approximation for the values of `L` and `S`, but does not point out that the `CLI`  is also an approximation. Running the  final line in a calculator gives me the following results: `0.0588 * 537 - 0.296 * 4.20 - 15.8 = 14.5324`.  Inconsistencies like this make it a little more difficult to know I was calculating correct results.
3. The article does not tell you whether symbolic characters are counted. An example of this is the two periods in the abbreviated word `U.S.`

## Is Readable.io Wrong?

What score does Readable.io give the sample text?

Answer: `14.0`

Who is right? Readble.io or Wikipedia? After some digging around, I found Readable.io to have incorrect results. By deleting the period symbols from the sample text, Readable.io gives the Coleman-Liau score: `14.7`, much closer to Wikipedia’s result of `14.5`.

The inaccuracy here is largely to do with the way that the Readiable.io is breaking down sentences. Let’s compare how a few different tools calculate this:

```
// The way I read things...
sentences = {
  1: "Existing computer programs that measure readability are based largely upon subroutines which estimate number of syllables, usually by counting vowels.",
  2: "The shortcoming in estimating syllables is that it necessitates keypunching the prose into the computer."
  3: "There is no need to estimate syllables since word length in letters is a better predictor of readability than word length in syllables."
  4: "Therefore, a new readability formula was computed that has for its predictors letters per 100 words and sentences per 100 words."
  5: "Both predictors can be counted by an optical scanning device, and thus the formula makes it economically feasible for an organization such as the U.S. Office of Education to calibrate the readability of all textbooks for the public school system."
}  
```

- Actual sentences: 5
- Readable.io sentence count: 7
- Ulysses sentence count: 6

I believe that Ulysses is counting the word “U.S.” as the break of a sentence.

```
// The way Ulyses reads things...
sentences = {
  ...
  5: "Both predictors can be counted by an optical scanning device, and thus the formula makes it economically feasible for an organization such as the U.S." // <-- BREAK
  6: "Office of Education to calibrate the readability of all textbooks for the public school system."
}  
```

Even more alarming, Readable.io measures the following text as having three sentences:

> “Everybody loves the U.S. Office of Education.”

```
// The way Readible.io reads things...
sentences = {
  ...
  5: "Both predictors can be counted by an optical scanning device, and thus the formula makes it economically feasible for an organization such as the U." // <-- BREAK
  6: "S.", // <-- BREAK
  7: "Office of Education to calibrate the readability of all textbooks for the public school system."
}  
```

Clearly the words: "Everybody loves the U.S. Office of Education", is one sentence. But Readable.io is counting each period as a new sentence. Counting every period as a new sentence is how Readable.io is dropping the grade from `14.5` to `14.0`, because one long sentence is broken into three very short sentences. Voilà! It just became more readable! (I kid)

Based on my implementation of the Coleman Liau algorithm, I think Readble.io is counting all comma symbols as letters. When I run the algorithm this way I get a score of: `13.932319999999997`, which I suspect is being rounded up to `14.0` by Readible.io.



### Where Do Sentences End?

The average reader can intuit where a sentence ends with ease. But to be fair to Readible.io and Ulyses, programming this level of compelx intuition is not easy.

When I try to think of how I would program for this, I want to throw my hands up and say: _'It’s too complex for me to figure out. Perhaps we just use machine learning?'_ And another part of me loves the challenge.

I tried for a couple of hours to come up with Regular Expressions that would satisfy the abbreviation use case. But I did not find a solution. I think it is likely that a solution to this problem would require a significantly complex knowledge of sentence structures.

Consider this paragraph:

```plaintext
“Would you like to fly to St. Lucia?" Mr. Martin asked.  
”I’m not sure!" replied Lucy, "is it nice?"  
“St. Lucia is lovely, Lucy," said Mr. Martin, "especially St. Jame's Bay along Chapel St."  
“Then we shall go to Chapel St., St. Jame's Bay, St. Lucia Mr. Martin!", she said.  
And so they left the U.S.A. They departed immediately.
```

How would you program an algorithm to count the sentences in this text?

Readable.io counts this as twenty sentences and provides a Coleman-Liau index of `-3.3`! I count six sentences. And Grammarly gives me a score of 100, meaning there are no errors by their reconing. Even though I would never intentionally write in such a confusing way, I did use Grammarly to send this text to proof readers, so it is as legit as I can make it.

Titles like “Mr.” and “Mrs.” are easy to calculate, except where some spritely British lad says, “Thanks, Mr. I appreciate it!”.  Because the period at the end of  “Mr.” represents the end of a sentence not the title and name "Mr. I". This is contrived, and not a proper sentence anyway, but you get the point: things get complex quickly.

A better example might be abbreviated Words like “U.S.A.” are also easy to calculate, except when they are at the end of a sentence. For example: “We love to party in the U.S.A. In the U.S.A. we love to party.”

I have always disliked when writers add two spaces to break every sentence, but for the sake a of decyphering English, that practice makes calculating the end of sentences much easier.

If I could re-invent the English language, I would make periods that demark sentences a different symbol than periods that demark titles and acronyms.

## The Original White Paper

I got hold of the original white-paper [Non-Native English Speaker Readability Metric: Reading Speed and Comprehension](http://psycnet.apa.org/record/1975-22007-001), to see if it could shed any light on the magic numbers used the algorithm.

After some help from my fabulous assistant who reads these kinds of things for a living, I came to understanding that the magic numbers are the result of calculating bodies of text against reading test results from some kind of human study. The numbers work as weights for average English text.

Seeing as this paper was written in the 1970's and language is always changing, I would suppose that such a simplistic algorithm for grade level evaluation should be taken with a pinch of salt.

That being said, having such a simple algorithm does provide a way of comparing relative bodies of text with great ease; albeit with the caveat that minor inaccuracies will produce a little noise among the signal.

## My Implementation of The Coleman-Liau Algorithm

I started building out an implementation of the Coleman-Liau index with ESNext in Node.js. I started by splitting a single string into sentences, and then sentences into words. But I found that it was easier to determine word endings by splitting the text into words first, and sentences later. This is because the space character `“ "` always represents the boundary of word. This methodology picks up various symbols along the way, but these seem easier to deal with at a word-level than a sentence level.

After running into the problem of the text: “The U.S. Office of Education”, I decided it was best to feed the sentences into the algorithm in an array of lines. If I want to come back at a later time with some magic way of splitting sentences, I can do that. But I had bigger fish to fry.

I wanted to know:

- Exactly how the Wikipedia article writer got to a score of `14.5` from the sample text.
- If the Wikipedia algorithm was taken directly from the original white-paper or was an approximation.

My implementation has the following architecture:

- Pass an array of sentences to the routine
- Split the words at the space character " "
- Clean all the words of dangling symbols like comma "," and period "."
- Count the number of letters
- Calculate L (The average number of letters per 100 words)
- Calculate S (The average number of sentences per 100 words)
- Calculate CLI (0.0588 * L - 0.296 * S - 15.8)

Removing all symbols that were not letters of the alphabet from the words, I was able to count the exact same number of letters and words as the Wikipedia article.

Like the Wikipedia article, my algorithm produced:

- A letter count of `639`
- A word count of `119`
- An L value of `536.9747899159663` or `537` rounded
- An S value of `4.201680672268908 ` or `4.20` rounded

Using unrounded S and L values, my algorithm produced a Coleman-Liau index of  `14.53042016806722`.

Following Wikipedia’s rounding methodology, my algorithm produces a Coleman-Liau index of `14.532399999999996`.

It is unclear why the article writer rounded the S and L values. Rounding does not appear to effect the value beyond two decimal points and so it seems like an insignificant step.

I have to wonder if the Wikipedia article writer intended to produce the exact value `14.5` using rounding. Perhaps the reason would be clear when programming the algorithm in a language that did not use double-precision floating-point numbers, as JavaScript does.

You can read more about the differences between numbers in different programming languages here: [How numbers are encoded in JavaScript](http://2ality.com/2012/04/number-encoding.html) and [Print Precision of Dyadic Fractions Varies by Language](http://www.exploringbinary.com/print-precision-of-dyadic-fractions-varies-by-language/).

### My Code

Here is the solution I came up with:

```javascript
// Remove spurious characters from word boundaries
const cleanWords = words => {
  const cleanWords = []

  words.forEach(word => {
    const lastChar = word[word.length - 1]
    
    // Get rid of periods, period.
    word = word.replace(/\./g, '')

    // Remove commas, they mean nothing.
    if (lastChar === ',') {
      word = word.substr(0, word.length - 1)
    }

    cleanWords.push(word)
  })

  return cleanWords
}

// Atomize a sentence into words
const splitWords = sentences => {
  let wordList = []

  sentences.forEach(sentence => {
    const words = sentence.split(' ')
    wordList = wordList.concat(words)
  })

  return wordList
}

// Count every letter (after cleaning words)
const countLetters = words => {
  let count = 0

  words.forEach(word => {
    count += word.length
  })

  return count
}

// Passsing in an array of sentences means that I do not
// have to figure out how to atomize titles and acronyms
// like U.S.A and Mr.
const colemanliau = sentenceAry => {
  const rawWords = splitWords(sentenceAry)
  const cleanWords = cleanWords(result)
  
  const wordCount = cleanWords.length
  const letterCount = countLetters(cleanWords)
  
  const L = (letterCount / wordCount) * 100
  const S = (sentencesAry.length / wordCount) * 100
  const grade = (0.0588 * L) - (0.296 * S) - 15.8
  
  console.log(`L: ${L}`)
  console.log(`S: ${S}`)
  console.log(`GRADE: ${grade}`)
}
```

This can be used by passing in an array of sentences like so:

```javascript
const sentences = [
  'Existing computer programs that measure readability are based largely upon subroutines which estimate number of syllables, usually by counting vowels.',
  'The shortcoming in estimating syllables is that it necessitates keypunching the prose into the computer.',
  'There is no need to estimate syllables since word length in letters is a better predictor of readability than word length in syllables.',
  'Therefore, a new readability formula was computed that has for its predictors letters per 100 words and sentences per 100 words.',
  'Both predictors can be counted by an optical scanning device, and thus the formula makes it economically feasible for an organization such as the U.S. Office of Education to calibrate the readability of all textbooks for the public school system'
]
 
colemanliau(sentences)

// L: 537
// S: 4.2
// GRADE: 14.532399999999996
```

If you would like to try this code youself, you can get it here on Github: [https://github.com/F1LT3R/coleman-liau-readability-index](https://github.com/F1LT3R/coleman-liau-readability-index)

## Conclusion

My biggest takeaway was that using acronyms and titles in text on Readable.io and Ulyses could considerably skew the readability score. Readability scores are more accurate on larger bodies of text due to the calculation errors of complex text in readability software.

You probably don't want to take the readability of 3 paragraph email seriously.

The next biggest learning was just how prickly a software solution for calculating sentences was when containing acronyms and titles. I'm not saying it can't be done well, I'm just saying there's a big tradeoff conseration between the acuracy of the results and the difficulty of implementation.

That's all folks.