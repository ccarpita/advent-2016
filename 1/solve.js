#!/usr/bin/env node

'use strict';

const util = require('../util');
const assert = require('assert');

const input = util.inputForDay(1);

const NORTH = [0, 1];
const SOUTH = [0, -1];
const EAST = [1, 0];
const WEST = [-1, 0];

const ROTATIONS = [NORTH, EAST, SOUTH, WEST];


function algo(input) {
  let currentDirection = NORTH;
  const visited = {};
  let firstRevisited;

  const checkVisited = vector => {
    const serial = vector.join(',');
    if (visited[serial] && !firstRevisited) {
      firstRevisited = vector;
    }
    visited[serial] = true;
  };

  const finalPos = input.split(/\,\s+/)
    .map(parse)
    .map(turn => {
      currentDirection = rotate(currentDirection, turn.rotate);
      const vector = product(currentDirection, [turn.distance, turn.distance]);
      return vector;
    })
    .reduce((accVector, n) => {
      points(n).forEach(step => {
        checkVisited(sum(accVector, step));
      });
      return sum(accVector, n);
    }, [0, 0]);

  const numBlocks = pos => pos.reduce((acc, n) => acc + Math.abs(n), 0);
  const numTotalBlocks = numBlocks(finalPos);
  const numFirstRevisited = numBlocks(firstRevisited);

  return `Total Blocks: ${numTotalBlocks}, First Revisit: ${numFirstRevisited}`;
}

const sum = arrayOperator((acc, n) => acc + n, 0);
const product = arrayOperator((acc, n) => acc * n, 1);

function equals(arr1, arr2) {
  const maxLength = Math.max.apply(null, arrays.map(arr => arr.length));
  for (let i = 0; i < maxLength; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function points(vec) {
  const pts = [];
  for (let i = 0; i < vec.length; i++) {
    if (vec[i] !== 0) {
      const sign = vec[i] < 0 ? -1 : 1;
      for (let j = 0; j < Math.abs(vec[i]); j++) {
        const cp = vec.slice();
        cp[i] = j * sign;
        pts.push(cp);
      }
    }
  }
  return pts;
}

function arrayOperator(accumulator, init) {
  return (...arrays) => {
    const res = [];
    const maxLength = Math.max.apply(null, arrays.map(arr => arr.length));
    for (let i = 0; i < maxLength; i++) {
      res[i] = arrays.map(arr => arr[i]).reduce(accumulator, init);
    }
    return res;
  }
}

function rotate(direction, rotate) {
  const i = ROTATIONS.indexOf(direction);
  const adjustment = rotate === 'R' ? 1 : (rotate === 'L' ? -1 : 0);
  if (adjustment === 0) throw new Error(`bad rotation: ${rotate}`);
  const adjI = i + adjustment;
  const nextI = adjI < 0 ? (ROTATIONS.length - 1) : (adjI === ROTATIONS.length ? 0 : adjI);
  return ROTATIONS[nextI];
}

function parse(input) {
  return {
    rotate: input.substr(0, 1),
    distance: Number(input.substr(1)),
  };
}

function test() {
  assert.deepEqual(sum([1, 2], [3, 4], [5, 6]), [9, 12]);
}

// TOO HIGH: 503
if (require.main === module) {
  test();
  console.log('answer', algo(input));
}
module.exports = algo;
