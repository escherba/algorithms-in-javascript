aij.heap3Sort = (function(){
    /*jshint bitwise: false*/
    "use strict";
  function swap(ary, a, b) {
      var t = ary[a];
      ary[a] = ary[b];
      ary[b] = t;
  }
  
  function shiftDown(ary, start, end) {
      var root = start,
          child, s, root21;
  
      while ((root21 = (root << 1) + 1) <= end) {
          child = root21;
          s = root;
  
          if (ary[s] < ary[child]) {
              s = child;
          }
 
          var child1 = child + 1;
          if (child1 <= end && ary[s] < ary[child1]) {
              s = child1;
          }
  
          if (s !== root) {
              swap(ary, root, s);
              root = s;
          } else {
              return;
          }
      }
  }

 
  return function(ary) {
      // heapify
      var len = ary.length;
      for (var start = (len >>> 1) - 1; start >= 0; start--) {
          shiftDown(ary, start, len - 1);
      }

      for (var end = len - 1; end > 0; end--) {
          swap(ary, end, 0);
          shiftDown(ary, 0, end - 1);
      }
  
      return ary;
  };
 
})();
