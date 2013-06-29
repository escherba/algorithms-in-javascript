/**
 * Define "aij" as the global namespace.
 */
var aij = {
    /**
     * Swap the item in index i with the item in index j.
     * @param {Array.<number>} arr The array containing the items.
     * @param {number} i The index of the first swapped item.
     * @param {number} j The index of the second swapped item.
     */
    swap: function(arr, i, j) {
      var swapped = arr[i];
      arr[i] = arr[j];
      arr[j] = swapped;
    },

    /**
     * Verify that an object is an array with more than one element.
     * @param {*} obj The object to verify.
     * @return {boolean} True if the verified object is an array with at least
     *     one element.
     */
    isSortable: function(obj) {
      return obj && toString.call(obj) === '[object Array]' && obj.length > 1;
    }
};

Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
Array.prototype.clone = function() {
    return this.slice(0);
};

