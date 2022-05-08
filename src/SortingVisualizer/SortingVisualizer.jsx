import React, { useState, useEffect, useRef } from "react";
import "./SortingVisualizer.css";
import { getQuickSortAnimations } from "../algorithms/QuickSort";
import { getMergeSortAnimations } from "../algorithms/MergeSort";
import { getInsertionSortAnimations } from "../algorithms/InsertionSort";

const ARR_LEN = 100;
const MIN_NUM = 5;
const MAX_NUM = 80;
const DELAY = 5;
const ACCESSED_COLOR = "turquoise";
const SORTED_COLOR = "green";

export default function SortingVisualizer(props) {
  const [arr, setArr] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const containerRef = useRef(null);

  useEffect(initialiseArray, []);

  function initialiseArray() {
    if (isSorting) return;
    if (isSorted) resetArrayColour();
    setIsSorted(false);

    const arr = [];
    for (let i = 0; i < ARR_LEN; i++) {
      arr.push((MAX_NUM - MIN_NUM) * (i / ARR_LEN) + MIN_NUM);
    }

    shuffle(arr);
    setArr(arr);
  }

  function mergeSort() {
    const animations = getMergeSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function insertionSort() {
    const animations = getInsertionSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function quickSort() {
    const animations = getQuickSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function animateArrayUpdate(animations) {
    if (isSorting) return;
    setIsSorting(true);

    animations.forEach(([comparision, swapped], index) => {
      setTimeout(() => {
        if (!swapped) {
          if (comparision.length === 2) {
            const [i, j] = comparision;
            animateArrayAccess(i);
            animateArrayAccess(j);
          } else {
            const [i] = comparision;
            animateArrayAccess(i);
          }
        } else {
          setArr((prevArr) => {
            const [k, newValue] = comparision;
            const newArr = [...prevArr];
            newArr[k] = newValue;
            return newArr;
          });
        }
      }, index * DELAY);
    });

    setTimeout(() => {
        animateSortedArray();
    }, animations.length * DELAY);
  }

  function animateArrayAccess(index) {
    const arrayBars = containerRef.current.children;
    const arrayBarStyle = arrayBars[index].style;

    setTimeout(() => {
        arrayBarStyle.backgroundColor = ACCESSED_COLOR;
    }, DELAY);
    setTimeout(() => {
        arrayBarStyle.backgroundColor = '';
      }, DELAY * 2);
  }

  function animateSortedArray(){
    const arrayBars = containerRef.current.children;
    for (let i = 0; i < arrayBars.length; i++) {
      const arrayBarStyle = arrayBars[i].style;
      setTimeout(
        () => (arrayBarStyle.backgroundColor = SORTED_COLOR),
        i * DELAY,
      );
    }
    setTimeout(() => {
      setIsSorted(true);
      setIsSorting(false);
    }, arrayBars.length * DELAY);      

  }

  function resetArrayColour() {
    const arrayBars = containerRef.current.children;
    for (let i = 0; i < arr.length; i++) {
      const arrayBarStyle = arrayBars[i].style;
      arrayBarStyle.backgroundColor = '';
    }
  }


return (
    <div className="visualizer-container">
      <div className="array-container" ref={containerRef}>
        {arr.map((barHeight, index) => (
          <div
            className="array-bar"
            style={{
              height: `${barHeight}vmin`,
              width: `${100 / ARR_LEN}vw`,
            }}
            key={index}
          ></div>
        ))}
      </div>
      <footer className="app-footer">
        <ul>
          <li>
            <button className="app-button" onClick={initialiseArray}>
              Create new array
            </button>
          </li>
          <li>
            <button className="app-button" onClick={mergeSort}>
              Merge sort
            </button>
          </li>
          <li>
            <button className="app-button" onClick={insertionSort}>
              Insertion sort
            </button>
          </li>
          <li>
            <button className="app-button" onClick={quickSort}>
              Quick sort
            </button>
          </li>
        </ul>
      </footer>
    </div>
  );   
}
const shuffle = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
      }
  }
