'use strict';

// MODULES //

var isnan = require( 'validate.io-nan' );


// FUNCTIONS //

var ldexp = require( './ldexp.js' ),
  trunc = Math.trunc;


// CONSTANTS //

var PINF = Number.POSITIVE_INFINITY;


// EXP //


function exp( x ) {
  var Ln2Hi = 6.93147180369123816490e-01,
		Ln2Lo = 1.90821492927058770002e-10,
		Log2e = 1.44269504088896338700e+00,
		Overflow  = 7.09782712893383973096e+02,
		Underflow = -7.45133219101941108420e+02,
		NearZero  = 1.0 / (1 << 28); // 2**-28

	// special cases
  if ( isNaN(x) || x === PINF ) {
    return x;
  }
  if ( x === Number.NEGATIVE_INFINITY ) {
    return 0;
  }
  if ( x > Overflow ) {
    		return PINF;
  }
	if ( x < Underflow ) {
    return 0;
  }
  if ( -NearZero < x && x < NearZero ) {
		return 1 + x;
	}

	// reduce; computed as r = hi - lo for extra precision.
	var hi, lo, k;
	if ( x < 0 ) {
		k = trunc( Log2e * x - 0.5 );
  } else if ( x > 0) {
		k = trunc( Log2e * x + 0.5 );
	}
	hi = x - k * Ln2Hi;
	lo = k * Ln2Lo;

	// compute
	return expmulti( hi, lo, k );
}


// exp1 returns e**r × 2**k where r = hi - lo and |r| ≤ ln(2)/2.
function expmulti( hi, lo, k ) {
  var r, t, c, y;
	var P1 = 1.66666666666666019037e-01,  /* 0x3FC55555; 0x5555553E */
		P2 = -2.77777777770155933842e-03, /* 0xBF66C16C; 0x16BEBD93 */
		P3 = 6.61375632143793436117e-05, /* 0x3F11566A; 0xAF25DE2C */
		P4 = -1.65339022054652515390e-06,/* 0xBEBBBD41; 0xC5D26BF1 */
		P5 = 4.13813679705723846039e-08; /* 0x3E663769; 0x72BEA4D0 */

	r = hi - lo;
	t = r * r;
	c = r - t * ( P1 + t * ( P2 + t * ( P3 + t * (P4+t*P5) ) ) )
	y = 1 - ( ( lo - (r*c)/(2-c) ) - hi )
	// TODO(rsc): make sure Ldexp can handle boundary k
	return ldexp( y, k );
}


// EXPORTS //

module.exports = exp;
