aij.flashSort = (function(){
    /*jshint bitwise: false*/
    "use strict";
    return function( a ) {
        var n = a.length;

        var i = 0, j = 0, k = 0, t;
        var m = ~~( n * 0.125 );
        var l = [];
        var anmin = a[ 0 ];
        var nmax = 0;
        var nmove = 0;

        for ( i = 0; i < m; i++ ) {
            l[ i ] = 0;
        }

        for ( i = 1; i < n; ++i ) {
            if ( a[ i ] < anmin ) { anmin = a[ i ]; }
            if ( a[ i ] > a[ nmax ] ) { nmax = i; }
        }

        if ( anmin === a[ nmax ]) { return a; }

        var c1 = ( m - 1 ) / ( a[ nmax ] - anmin );

        for ( i = 0; i < n; ++i ) {
            k = ~~( c1 * ( a[ i ] - anmin ) );
            ++l[ k ];
        }

        for ( k = 1; k < m; ++k ) {
            l[ k ] += l[ k - 1 ];
        }

        var hold = a[ nmax ];
        a[ nmax ] = a[ 0 ];
        a[ 0 ] = hold;

        var flash;
        j = 0;
        k = m - 1;
        i = n - 1;

        while ( nmove < i ) {
            while ( j > ( l[ k ] - 1 ) ) {
                k = ~~( c1 * ( a[ ++j ] - anmin ) );
            }
            // line below added 07/03/2013, ES
            if (k < 0) { break; }

            flash = a[ j ];

            while ( j !== l[ k ] ) {
                k = ~~( c1 * ( flash - anmin ) );
                hold = a[ ( t = l[ k ]-1) ];
                a[ t ] = flash;
                flash = hold;
                --l[ k ];
                ++nmove;
            }
        }

        for( j = 1; j < n; ++j ) {
            hold = a[ j ];
            i = j - 1;
            while( i >= 0 && a[i] > hold ) {
                a[ i + 1 ] = a[ i-- ];
            }
            a[ i + 1 ] = hold;
        }

        return a;
    };
})();
