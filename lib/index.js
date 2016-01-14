'use strict';

// MODULES //

var isnan = require( 'validate.io-nan' );


// FUNCTIONS //

var ldexp = require( './ldexp.js' ),
	trunc = require( 'math-truncate' );


// CONSTANTS //

var NINF = Number.NEGATIVE_INFINITY,
	PINF = Number.POSITIVE_INFINITY;


// EXP //

// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Exp returns e**x, the base-e exponential of x.
//
// Special cases are:
//	Exp(+Inf) = +Inf
//	Exp(NaN) = NaN
// Very large values overflow to 0 or +Inf.
// Very small values underflow to 1.

// The original C code, the long comment, and the constants
// below are from FreeBSD's /usr/src/lib/msun/src/e_exp.c
// and came with this notice.  The go code is a simplified
// version of the original C.
//
// ====================================================
// Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
//
// Permission to use, copy, modify, and distribute this
// software is freely granted, provided that this notice
// is preserved.
// ====================================================
//
//


/**
* FUNCTION: exp( x )
*    Computes e^x, the base-e exponential of x.
*
* @param {Number} x - input value
* @returns {Number} base-e exponential of x
*/
function exp( x ) {
	// Method
	//   1. Argument reduction:
	//      Reduce x to an r so that |r| <= 0.5*ln2 ~ 0.34658.
	//      Given x, find r and integer k such that
	//
	//               x = k*ln2 + r,  |r| <= 0.5*ln2.
	//
	//      Here r will be represented as r = hi-lo for better
	//      accuracy.
	//
	//   2. Approximation of exp(r) by a special rational function on
	//      the interval [0,0.34658]:
	//      Write
	//          R(r**2) = r*(exp(r)+1)/(exp(r)-1) = 2 + r*r/6 - r**4/360 + ...
	//      We use a special Remes algorithm on [0,0.34658] to generate
	//      a polynomial of degree 5 to approximate R. The maximum error
	//      of this polynomial approximation is bounded by 2**-59. In
	//      other words,
	//          R(z) ~ 2.0 + P1*z + P2*z**2 + P3*z**3 + P4*z**4 + P5*z**5
	//      (where z=r*r, and the values of P1 to P5 are listed below)
	//      and
	//          |                  5          |     -59
	//          | 2.0+P1*z+...+P5*z   -  R(z) | <= 2
	//          |                             |
	//      The computation of exp(r) thus becomes
	//                             2*r
	//              exp(r) = 1 + -------
	//                            R - r
	//                                 r*R1(r)
	//                     = 1 + r + ----------- (for better accuracy)
	//                                2 - R1(r)
	//      where
	//                               2       4             10
	//              R1(r) = r - (P1*r  + P2*r  + ... + P5*r   ).
	//
	//   3. Scale back to obtain exp(x):
	//      From step 1, we have
	//         exp(x) = 2**k * exp(r)
	//
	// Special cases:
	//      exp(INF) is INF, exp(NaN) is NaN;
	//      exp(-INF) is 0, and
	//      for finite argument, only exp(0)=1 is exact.
	//
	// Accuracy:
	//      according to an error analysis, the error is always less than
	//      1 ulp (unit in the last place).
	//
	// Misc. info.
	//      For IEEE double
	//          if x >  7.09782712893383973096e+02 then exp(x) overflow
	//          if x < -7.45133219101941108420e+02 then exp(x) underflow
	//
	// Constants:
	// The hexadecimal values are the intended ones for the following
	// constants. The decimal values may be used, provided that the
	// compiler will convert from decimal to binary accurately enough
	// to produce the hexadecimal values shown.
	var Ln2Hi = 6.93147180369123816490e-01,
		Ln2Lo = 1.90821492927058770002e-10,
		Log2e = 1.44269504088896338700e+00,
		Overflow  = 7.09782712893383973096e+02,
		Underflow = -7.45133219101941108420e+02,
		NearZero  = 1.0 / (1 << 28); // 2**-28

	// special cases
	if ( isnan(x) || x === PINF ) {
		return x;
	}
	if ( x === NINF ) {
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
	} else {
		// Case: x > 0
		k = trunc( Log2e * x + 0.5 );
	}
	hi = x - k * Ln2Hi;
	lo = k * Ln2Lo;

	// compute
	return expmulti( hi, lo, k );
} // end FUNCTION exp()


// EXPMULTI //

/**
* FUNCTION: expmulti( hi, lo, k )
*   Computes e**r × 2**k where r = hi - lo and |r| ≤ ln(2)/2.
*
* @param {Number} hi - upper bound
* @param {Number} lo - lower bound
* @param {Number} k - power of 2
* @returns {Number} function value
*/
function expmulti( hi, lo, k ) {
	var r, t, c, y;
	var P1 = 1.66666666666666019037e-01,  /* 0x3FC55555; 0x5555553E */
		P2 = -2.77777777770155933842e-03, /* 0xBF66C16C; 0x16BEBD93 */
		P3 = 6.61375632143793436117e-05, /* 0x3F11566A; 0xAF25DE2C */
		P4 = -1.65339022054652515390e-06,/* 0xBEBBBD41; 0xC5D26BF1 */
		P5 = 4.13813679705723846039e-08; /* 0x3E663769; 0x72BEA4D0 */

	r = hi - lo;
	t = r * r;
	c = r - t * ( P1 + t * ( P2 + t * ( P3 + t * (P4+t*P5) ) ) );
	y = 1 - ( ( lo - (r*c)/(2-c) ) - hi );
	// TODO(rsc): make sure Ldexp can handle boundary k
	return ldexp( y, k );
} // end FUNCTION expmulti()


// EXPORTS //

module.exports = exp;
