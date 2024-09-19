// Function to convert a value from any base to base 10 using BigInt
function convertToBase10(value, base) {
    let result = BigInt(0);
    let power = 0;
    for (let i = value.length - 1; i >= 0; --i) {
        result += BigInt(parseInt(value[i], base)) * BigInt(Math.pow(base, power));
        power++;
    }
    return result;
}

// Function to parse JSON and return the decoded points (x, y)
function parseJSONAndDecodePoints(jsonInput) {
    const root = JSON.parse(jsonInput);
    const points = new Map();

    for (const key in root) {
        if (key === 'keys') continue;  // Skip "keys" section
        
        const x = parseInt(key);  // x is the key
        const base = parseInt(root[key].base);  // Base of the y value
        const value = root[key].value;   // y value as string
        
        // Decode y from the given base to base 10
        const y = convertToBase10(value, base);
        
        // Store the (x, y) point
        points.set(x, y);
    }

    return points;
}

// Lagrange interpolation to find the constant term (c) at x = 0, using BigInt arithmetic
function lagrangeInterpolation(points, x) {
    let result = BigInt(0);
    for (let [x1, y1] of points) {
        let term = y1;
        for (let [x2, y2] of points) {
            if (x1 !== x2) {
                term *= BigInt(x) - BigInt(x2);
                term /= BigInt(x1) - BigInt(x2);
            }
        }
        result += term;
    }
    return result;
}

// Main function
function main() {
    const jsonInput1 = `{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}`;
    const jsonInput = `{ 
        "keys": {
            "n": 9,
            "k": 6
        },
        "1": {
            "base": "10",
            "value": "28735619723837"
        },
        "2": {
            "base": "16",
            "value": "1A228867F0CA"
        },
        "3": {
            "base": "12",
            "value": "32811A4AA0B7B"
        },
        "4": {
            "base": "11",
            "value": "917978721331A"
        },
        "5": {
            "base": "16",
            "value": "1A22886782E1"
        },
        "6": {
            "base": "10",
            "value": "28735619654702"
        },
        "7": {
            "base": "14",
            "value": "71AB5070CC4B"
        },
        "8": {
            "base": "9",
            "value": "122662581541670"
        },
        "9": {
            "base": "8",
            "value": "642121030037605"
        }
    }`;

    // Parse and decode the points
    const points = parseJSONAndDecodePoints(jsonInput);

    // Perform Lagrange interpolation to find the constant term (x = 0)
    const constantTerm = lagrangeInterpolation(points, 0);

    console.log("Constant term c: ", constantTerm.toString());
}

main();
