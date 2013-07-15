aij.quicknrSort = (function(){
    /*jshint bitwise: false*/
    "use strict";

    /**
    * Quicksort algorithm. It's with complexity O(n log(n)).
    * In this version of quicksort I use the middle element of the
    * array for pivot.
    */


    /**
    * Quicksort algorithm
    *
    * @public
    * @param {array} array Array which should be sorted.
    * @return {array} Sorted array.
    */

    /**
    * Partitions the array in two parts by the middle elements.
    * All elemnts which are less than the chosen one goes left from it
    * all which are greater goes right from it.
    *
    * @param {array} array Array which should be partitioned
    * @param {number} left Left part of the array
    * @param {number} right Right part of the array
    * @return {number}
    */
    function partition(array, left, right) {
        var pivot = array[(left + right) >>> 1];
        while (left <= right) {
            while (array[left] < pivot) { left++; }
            while (array[right] > pivot) { right--; }
            if (left <= right) {
                var temp = array[left];
                array[left++] = array[right];
                array[right--] = temp;
            }
        }
        return left;
    }

    /**
    * Iterative implementation of quicksort
    *
    * @param {array} array Array which should be processed
    */
    return function (array) {
        var stack = [ array.length - 1, 0 ];
        while (stack.length > 0) {
            var left = stack.pop(),
            right = stack.pop(),
            mid = partition(array, left, right);
            if (left < mid - 1) {
                stack.push(mid - 1); // push right
                stack.push(left);    // push left
            }
            if (right > mid) {
                stack.push(right); // push right
                stack.push(mid);   // push left
            }
        }
        return array;
    };
}());
