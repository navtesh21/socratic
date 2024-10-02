import React from 'react';

const Problems = () => {
  return (
    <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
      {/* Card */}
      <a className="group flex flex-col focus:outline-none" href="#">
        <div className="relative w-full h-0 pb-[56.25%] overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <img
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105 group-focus:scale-105 rounded-2xl"
            src="https://miro.medium.com/v2/resize:fit:1358/1*dWJgx83vJZRao6-geaEt_w.png"
            alt="Blog Image"
          />
        </div>
        <div className="pt-4">
          <h3 className="relative inline-block font-medium text-lg text-black dark:text-white before:absolute before:bottom-0.5 before:left-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 before:transition-transform before:origin-left before:scale-x-0 group-hover:before:scale-x-100">
            Two Sum
          </h3>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Check if a pair with given sum exists in Array
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 text-green-500 dark:text-green-600">
              Easy
            </span>
            <span className="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Hashing
            </span>
            <span className="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Two-Pointer
            </span>
            
           
          </div>
        </div>
      </a>
      {/* End Card */}

      {/* Repeat similar cards */}
      <a className="group flex flex-col focus:outline-none" href="/problem/123">
        <div className="relative w-full h-0 pb-[56.25%] overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <img
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105 group-focus:scale-105 rounded-2xl"
            src="https://assets.leetcode.com/uploads/2021/06/08/waterflow-grid.jpg"
            alt="Blog Image"
          />
        </div>
        <div className="pt-4">
          <h3 className="relative inline-block font-medium text-lg text-black dark:text-white before:absolute before:bottom-0.5 before:left-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 before:transition-transform before:origin-left before:scale-x-0 group-hover:before:scale-x-100">
          Pacific Atlantic Water Flow
          </h3>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Rewriting sport's playbook for billions of athletes
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
          <span className="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 text-yellow-600 dark:text-yellow-600">
              Medium
            </span>
            <span className="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              DFS / BFS
            </span>
            <span className="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Graphs
            </span>
          </div>
        </div>
      </a>
      {/* End Card */}

      {/* Add more cards as needed */}
    </div>
  );
};

export default Problems;
