(function(){
    "use strict";
    /**
    * Sorts an array of integers using the AdaptiveSort algorithm.
    * @param {Array.<number>} items Array of items to be sorted.
    */

    aij.adaptiveSort = function(items) {

        /*
        * Adaptive merge sort algorithm
        * Implementation: Eugene Scherba, 11/9/2010
        * 
        * Note: Similar to merge sort but takes advantage of existing
        * partial ordering in the form of "chains". Resources on
        * adaptive (natural) and nonadaptive merge sort: 
        * http://www.nczonline.net/blog/2009/01/27/speed-up-your-javascript-part-3/
        * http://penguin.ewu.edu/~trolfe/NaturalMerge/NatMerge.html
        *
        * Stability: stable.
        * Space complexity: O(n) in worst case, usually around O(n/2).
        * Time complexity: O(n) if array is already sorted, 
        * O(n.log(n)) in a worst case which should be rare.
        * For partially-ordered or low-complexity arrays,
        * performance should be close to optimal.
        */

        function merge(left, right) {
            /*
            * Given two ordered arrays (chains), returns a new 
            * array containing an ordered union of the input chains.
            */
            var left_len = left.length,
            right_len = right.length,
            left_val,
            right_val,
            result;
            if (left[left_len - 1]<=(right_val = right[0])) {
                result = left.concat(right);
            } else if (right[right_len - 1]<(left_val = left[0])) {
                result = right.concat(left);
            } else {
                /* By this point, we know that the left and the right
                * arrays overlap by at least one element and simple
                * concatenation will not suffice to merge them. */

                result = new Array(left_len + right_len);
                var i = 0, k = 0, h = 0;
                while (true) {
                    if (right_val<left_val) {
                        result[i++] = right_val;
                        if (++h < right_len) {
                            right_val = right[h];
                        } else {
                            while (k < left_len) {
                                result[i++] = left[k++];
                            }
                            break;
                        }
                    } else {
                        result[i++] = left_val;
                        if (++k < left_len) {
                            left_val = left[k];
                        } else {
                            while (h < right_len) {
                                result[i++] = right[h++];
                            }
                            break;
                        }
                    }
                }
            }
            //setting array length to zero effectively removes the array from
            //memory (older versions of Firefox would leak unless these arrays
            //were reset).
            left.length = 0;
            right.length = 0;
            return result;
        }

        function find_fchain(arr, offset, limit) {
            /*
            * Given an array and offset equal to indexOf(elA), find    
            * the (indexOf(elZ) + 1) of an element elZ in the array,   
            * such that all elements elA..elZ form a non-strict 
            * forward-ordered chain.
            */
            var temp, succ;
            for (temp = arr[offset];
                ++offset < limit && temp<=(succ = arr[offset]);
            temp = succ) {}
            return offset;
        }

        function find_strict_rchain(arr, offset, limit) {
            /*
            * Given an array and offset equal to indexOf(elA), find   
            * the (indexOf(elZ) + 1) of an element elZ in the array,  
            * such that all elements elA..elZ form a strict 
            * reverse-ordered chain.
            */
            var temp, succ;
            for (temp = arr[offset];
                ++offset < limit && (succ = arr[offset])<temp;
            temp = succ) {}
            return offset;
        }

        function sort(arr) {
            var len = items.length;
            if (len <= 1) {
                return arr;
            }

            /*
            * Step 1: split on chains
            *
            * Always expect data in reverse order with respect to the one specified
            */

            var temp = [];
            var f = find_strict_rchain;
            for (var k = 0; k < len; k = term) {
                // try to find a chain (ordered sequence of at least
                // two elements) using a default function first:

                var term = f(arr, k, len);
                if (term - k > 1) {
                    temp.push(f === find_strict_rchain ? arr.slice(k, term).reverse() : arr.slice(k, term));
                } else if (f === find_strict_rchain) {
                    /* searched for a reverse chain and found none:
                    * switch default function to forward and look 
                    * for a forward chain at k + 1: */

                    term++;
                    temp.push(arr.slice(k, term));
                    f = find_fchain;
                } else {
                    /* searched for a forward chain and found none:
                    * switch default function to reverse and look 
                    * for a reverse chain at k + 1: */

                    term++;
                    temp.push(arr.slice(k, term).reverse());
                    f = find_strict_rchain;
                }
            }

            // Step 2: merge everything
            //for (var j = temp.length; j > 1; temp.length = j) {
            for (var j = temp.length; j > 1; ) {
                var lim = j - 2;
                // At this point, lim == arr.length - 2, so arr[k + 1]
                // is always defined for any k in [0, lim)
                for (j = 0, k = 0; k < lim; k = j << 1) {
                    temp[j++] = merge(temp[k], temp[k + 1]);
                }
                // Last pair is special -- its treatment depends on the initial 
                // parity of j, which is the same as the current parity of lim.
                temp[j++] = (k > lim) ? temp[k] : merge(temp[k], temp[k + 1]);
            }
            var result = temp.shift();
            temp.length = 0;
            return result;


            //in-place (destructive) version:
            //for (j = 0; j < len; j++) {
            //    arr[j] = result[j];
            //}
            //result.length = 0;
            //return arr;
        }

        // Initiate AdaptiveSort on the input array.
        //return aij.isSortable(items) ? sort(items) : items;
        return sort(items);
    };
})();
