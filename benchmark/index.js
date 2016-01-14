'use strict';

var abs = require( 'compute-abs' ),
	divide = require( 'compute-divide' ),
	mean = require( 'compute-mean' ),
	subtract = require( 'compute-subtract' ),
	exp = require( './../lib' );

var x = require( './data.json' );

var yexpected = require( './expected.json' );
var ycustom = new Array( x.length );
var ynative = new Array( x.length );
for ( var i = 0; i < x.length; i++ ) {
	ycustom[ i ] = exp( x[ i ] );
	ynative[ i ] = Math.exp( x[ i ] );
}

var customErrs = abs( divide( subtract( ycustom, yexpected ), yexpected ) );
var nativeErrs = abs( divide( subtract( ynative, yexpected ), yexpected ) );

console.log( 'The mean relative error of Math.exp compared to R is %d', mean( nativeErrs ) );
console.log( 'The mean relative error of this module compared to R is %d', mean( customErrs ) );
