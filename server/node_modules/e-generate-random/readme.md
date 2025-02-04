# Random-Number-Generator NPM Package

## Overview

This npm package provides a simple and easy-to-use JavaScript function to generate random numbers within a specified range. You can set both the start and end boundaries for the range within which you want to generate random numbers. This package is suitable for a wide range of use cases where random numbers are needed.

## Installation

To use this package, you can install it via npm:

```bash
npm install e-generate-random
```

## Usage

You can use this package by requiring it in your JavaScript/Node.js code. Here's a basic example of how to generate a random number using this package:

```javaScript

const generateRandomNumber = require("e-generate-random");

const randomNum = generateRandomNumber();
console.log(randomNum); // Output: A random number between 1 and 100
```

You can also specify custom start and end boundaries:

```javaScript
const generateRandomNumber = require("e-generate-random");

const randomNum = generateRandomNumber(10, 20); // Generates a random number between 10 and 20
console.log(randomNum);
```

## Function Signature

```javaScript
generateRandomNumber(end = 100, start = 1)

• end (optional): The upper boundary of the range (default is 100).
• start (optional): The lower boundary of the range (default is 1).
```

## Return Value

The function returns a randomly generated integer within the specified range.

## License

This package is distributed under the MIT License. You are free to use it in your projects, both open-source and commercial. Please check the LICENSE file for more information.

## Contribution

<p>
If you encounter any issues, have suggestions, or want to contribute to the package's development, please visit the <a href="https://github.com/MRIEnan/randomNumberGenerator" target="_blank" style="color:white;font-weight:700">Github</a>  repository.
</p>

Author
This package was created by IMENAN.
