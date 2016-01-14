'use strict';

// MODULES //

var test = require( 'tape' );
var abs = require( 'math-abs' );
var exp = require( './../lib' );


// TESTS //

test( 'main export is a function', function test( t ) {
	t.ok( typeof exp === 'function', 'main export is a function' );
	t.end();
});

test( 'the function evaluates the natural exponential function', function test( t ) {
	var delta;

	// Compared against output from Julia...
	delta = abs( exp( 4 ) - 54.598150033144236);
	t.ok( delta < 1e-14, 'equals ~54.598150033144236' );

	delta = abs( exp( -9 ) - 1.2340980408667956e-4 );
	t.ok( delta < 1e-14, 'equals ~1.2340980408667956e-4' );

	t.equal( exp( 0 ), 1, 'equals 1' );
	t.end();
});

test( 'the function returns `0` if provided a `-infinity`', function test( t ) {
	var val = exp( Number.NEGATIVE_INFINITY );
	t.equal( val, 0, 'returns 0' );
	t.end();
});

test( 'the function returns `+infinity` if provided a `+infinity`', function test( t ) {
	var val = exp( Number.POSITIVE_INFINITY );
	t.equal( val, Number.POSITIVE_INFINITY, 'returns +infinity' );
	t.end();
});

test( 'the function returns `+infinity` for very large input values', function test( t ) {
	var val = exp( 1e12 );
	t.equal( val, Number.POSITIVE_INFINITY, 'returns +infinity' );
	t.end();
});

test( 'the function returns 0 for large, negative input values', function test( t ) {
	var val = exp( -1e12 );
	t.equal( val, 0, 'returns zero' );
	t.end();
});



test( 'the function returns `NaN` if provided a `NaN`', function test( t ) {
	var val = exp( NaN );
	t.ok( val !== val, 'returns NaN' );
	t.end();
});
