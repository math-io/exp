options( digits = 16 )
library( jsonlite )

x = seq( -300, 300, length.out = 10000 )

y = exp( x )

cat( y, sep = ",\n" )

write( toJSON( x, digits = 16, auto_unbox = TRUE ), "./benchmark/data.json" )
write( toJSON( y, digits = 16, auto_unbox = TRUE ), "./benchmark/expected.json" )
