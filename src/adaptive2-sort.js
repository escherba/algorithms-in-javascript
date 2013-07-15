aij.adaptive2Sort = (function(){
    /*jshint bitwise: false*/
    /*jshint noempty: false*/

    "use strict";
    /**
    * Sorts an array of integers using the AdaptiveSort algorithm.
    * @param {Array.<number>} items Array of items to be sorted.
    */

    /*
    * Adaptive merge sort algorithm
    * Implementation: Eugene Scherba, 11/9/2010
    * 
    * This is a stable sort algorithm, similar to merge sort except 
    * that it takes advantage of partially ordered "chains" (Donald 
    * Knuth refers to these structures as "runs"). Performance of this
    * algorithm is directly dependent on the amount of preexisting 
    * partial ordering, however generally it is pretty good even on
    * completely random arrays.
    *
    * Time complexity: O(n) if array is already sorted, 
    * O(n.log(n)) in a worst case which should be rare.
    * Space complexity: O(n) in worst case, usually around O(n/2).
    */

    function merge(left, right) {
        /*
        * Given two non-empty ordered arrays (chains), returns a new 
        * array containing an ordered union of the input chains.
        */
        var left_len = left.length,
        right_len = right.length,
        left_val,
        right_val,
        result,
        i, k, h, imin, imid, imax;
        if (left[left_len - 1] <= (right_val = right[0])) {
            result = left.concat(right);
        } else if (right[right_len - 1] < (left_val = left[0])) {
            result = right.concat(left);
        } else if (left_val <= right_val) {
            // left_val <= right_val
            // use binary search to find the first left[i] > right_val
            // then copy left from 0 to i - 1 into result
            imin = 1, imax = left_len - 1;
            while (imax >= imin) {
                imid = imin + ((imax - imin) >> 1);
                if (left[imid] <= right_val) {
                    imin = imid + 1;
                } else if (left[imid - 1] > right_val) {
                    imax = imid - 1;
                } else {
                    // left[imid] > right_val && left[imid - 1] <= right_val
                    break; // return imid
                }
            }
            //result = new Array(left_len + right_len);
            //for (i = 0; i < imid; i++) {
            //    result[i] = left[i];
            //}
            result = left.slice(0, imid);

            k = imid, h = 0;
            left_val = left[k], right_val = right[h];
            while (true) {
                if (right_val < left_val) {
                    //result[k + h] = right_val;
                    result.push(right_val);
                    if (++h < right_len) {
                        right_val = right[h];
                    } else {
                        while (k < left_len) {
                            //result[k + h] = left[k++];
                            result.push(left[k++]);
                        }
                        break;
                    }
                } else {
                    //result[k + h] = left_val;
                    result.push(left_val);
                    if (++k < left_len) {
                        left_val = left[k];
                    } else {
                        while (h < right_len) {
                            //result[k + h] = right[h++];
                            result.push(right[h++]);
                        }
                        break;
                    }
                }
            }
        } else {
            // right_val < left_val
            // use binary search to find the first right[i] >= left_val
            // then copy right from 0 to i - 1 into result
            //
            imin = 1, imax = right_len - 1;
            while (imax >= imin) {
                imid = imin + ((imax - imin) >> 1);
                if (right[imid] < left_val) {
                    imin = imid + 1;
                } else if (right[imid - 1] >= left_val) {
                    imax = imid - 1;
                } else {
                    // right[imid] >= left_val && right[imid - 1] < left_val
                    break; // return imid
                }
            }
            //result = new Array(left_len + right_len);
            //for (i = 0; i < imid; i++) {
            //    result[i] = right[i];
            //}
            result = right.slice(0, imid);

            /* By this point, we know that the left and the right
            * arrays overlap by at least one element and simple
            * concatenation will not suffice to merge them. */

            k = 0, h = imid;
            left_val = left[k], right_val = right[h];
            while (true) {
                if (right_val < left_val) {
                    //result[k + h] = right_val;
                    result.push(right_val);
                    if (++h < right_len) {
                        right_val = right[h];
                    } else {
                        while (k < left_len) {
                            //result[k + h] = left[k++];
                            result.push(left[k++]);
                        }
                        break;
                    }
                } else {
                    //result[k + h] = left_val;
                    result.push(left_val);
                    if (++k < left_len) {
                        left_val = left[k];
                    } else {
                        while (h < right_len) {
                            //result[k + h] = right[h++];
                            result.push(right[h++]);
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
        var tmp, succ;
        for (tmp = arr[offset];
            ++offset < limit && tmp <= (succ = arr[offset]);
            tmp = succ
        ) {}
        return offset;
    }

    function find_strict_rchain(arr, offset, limit) {
        /*
        * Given an array and offset equal to indexOf(elA), find   
        * the (indexOf(elZ) + 1) of an element elZ in the array,  
        * such that all elements elA..elZ form a strict 
        * reverse-ordered chain.
        */
        var tmp, succ;
        for (tmp = arr[offset];
            ++offset < limit && (succ = arr[offset]) < tmp;
            tmp = succ
        ) {}
        return offset;
    }

    function chain_unit(arr) {
        // Step 1: return an array of chain arrays
        // expecting data in reverse order
        var terminus,
        len = arr.length,
        tmp = [],
        f = find_strict_rchain;

        for (var k = 0; k < len; k = terminus) {
            // try to find a chain (ordered sequence of at least
            // two elements) using a default function first:

            terminus = f(arr, k, len);
            if (terminus - k > 1) {
                tmp.push(
                    (f === find_strict_rchain) ? 
                    arr.slice(k, terminus).reverse() : 
                    arr.slice(k, terminus)
                );
            } else if (f === find_strict_rchain) {
                /* searched for a reverse chain and found none:
                * switch default function to forward and look 
                * for a forward chain at k + 1: */

                tmp.push(arr.slice(k, ++terminus));
                f = find_fchain;
            } else {
                /* searched for a forward chain and found none:
                * switch default function to reverse and look 
                * for a reverse chain at k + 1: */

                tmp.push(arr.slice(k, ++terminus).reverse());
                f = find_strict_rchain;
            }
        }
        return tmp;
    }

    function chain_join(tmp) {
        // Step 2: join all chains
        var j = tmp.length;
        if (j < 1) { return tmp; }

        // note: we reduce the size of the array after each iteration,
        // which is not really necessary (could be done at once at the end).
        for (; j > 1; tmp.length = j) {
            var k, lim = j - 2;
            // At this point, lim == tmp.length - 2, so tmp[k + 1]
            // is always defined for any k in [0, lim)
            for (j = 0, k = 0; k < lim; k = j << 1) {
                tmp[j++] = merge(tmp[k], tmp[k + 1]);
            }
            // Last pair is special -- its treatment depends on the initial 
            // parity of j, which is the same as the current parity of lim.
            tmp[j++] = (k > lim) ? tmp[k] : merge(tmp[k], tmp[k + 1]);
        }
        var result = tmp.shift();
        return result;
    }

    return function (arr) {

        // immutable version -- store result in a separate location
        return chain_join(chain_unit(arr));

        // mutable (standard) version -- store result in-place
        //var result = chain_join(chain_unit(arr));
        //for (var k = 0, len = arr.length; k < len; k++) {
        //    arr[k] = result[k];
        //}
        //result.length = 0;
        //return arr;
    };

})();
