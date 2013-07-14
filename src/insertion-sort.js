aij.insertionSort = (function(){
    "use strict";

    /**
    * Sorts an array of integers using the InsertionSort algorithm.
    * @param {Array.<number>} items Array of items to be sorted.
    */
    return function(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var j = i, item = arr[j];
            for(; j > 0 && arr[j - 1] > item; j--) {
                arr[j] = arr[j - 1];
            }
            arr[j] = item;
        }
        return arr;
    };

})();
