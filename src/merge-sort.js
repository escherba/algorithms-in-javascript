(function(){
    "use strict";
    /**
    * Sorts an array of integers using the MergeSort algorithm.
    * @param {Array.<number>} items Array of items to be sorted.
    */
    aij.mergeSort = function(items) {
        /*
        var merge = function(left, right) {
        var result = [];

        while (left.length || right.length) {
        result.push(
        left.length && left[0] <= (right[0] || Number.MAX_VALUE) ?
        left.shift() :
        right.shift());
        }

        return result;
        };

        var sort = function(arr) {
        var middle = arr && (arr.length / 2) << 0;

        if (!middle) {
        return arr;
        } else if (arr.length === 2) {
        return arr[1] < arr[0] ? arr.reverse() : arr;
        }

        return merge(sort(arr.slice(0, middle)), sort(arr.slice(middle)));
        };*/


        function merge(left, right) {
            var result = [];
            while (left.length > 0 && right.length > 0) {
                if (left[0] < right[0]) {
                    result.push(left.shift());
                } else {
                    result.push(right.shift());
                }
            }
            return result.concat(left).concat(right);
        }

        function sort(arr) {
            if (arr.length <= 1) {
                return arr;
            }
            var middle = Math.floor(arr.length / 2);
            var left = arr.slice(0, middle);
            var right = arr.slice(middle);
            return merge(sort(left), sort(right));
        }

        return aij.isSortable(items) ? sort(items) : items;

    };

})();
