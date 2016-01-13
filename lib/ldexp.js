'use strict';

/*
* Copyright (c) 2013,2014 Bert Freudenberg
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

function ldexp( mantissa, exponent ) {
	// construct a float from mantissa and exponent
	return exponent > 1023 ? // avoid multiplying by infinity
	mantissa * Math.pow( 2, 1023 ) * Math.pow( 2, exponent - 1023 ) :
	exponent < -1074 ? // avoid multiplying by zero
	mantissa * Math.pow( 2, -1074 ) * Math.pow( 2, exponent + 1074 ) :
	mantissa * Math.pow( 2, exponent );
}

module.exports = ldexp;
