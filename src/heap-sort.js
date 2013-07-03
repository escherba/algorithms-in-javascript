(function(){
    /*jshint bitwise: false*/
    "use strict";

    aij.heapSort = function(arr) {

        function siftdown(lower, upper) {
            var i = lower,
            c = lower,
            lastindex = upper >> 1,
            temp = arr[i - 1];

            for (; c <= lastindex; i = c) {
                c = i << 1;
                if (c < upper && arr[c - 1] < arr[c]) {
                    ++c;
                }
                var arrcm1 = arr[c - 1];
                if (arrcm1 <= temp) {
                    break;
                }
                arr[i - 1] = arrcm1;
            }
            arr[i - 1] = temp;
        }

        var len = arr.length;
        for (var i = len >> 1; i > 0; i--) {
            siftdown(i, len);
        }
        for (i = len - 1; i > 0; i--) {
            var tmp = arr[0];
            arr[0] = arr[i];
            arr[i] = tmp;
            siftdown(1, i);
        }

        return arr;
    };
})();
