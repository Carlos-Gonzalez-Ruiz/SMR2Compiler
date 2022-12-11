###################################################################################################
#################################          SMR2 language          #################################
###################################################################################################

SRM2 is a low level language designed to compile and run binaries for the microcontroller ProcSMR2.
There are several instructions in SMR2, which are the following:

· '# Comment'
  Comment lines to explain pieces of
  your code. This can be extremely
  useful when jumping by using the
  'salta' and 'saltasi0' instructions.

· 'imprime RX'
  Prints the value of register X, which
  must be a number between 0 and 7.

· 'imprimec RX'
  Prints the charcode by getting the
  value of register X, which must a 
  number between 0 and 7.

· 'valor RX Y'
  Sets to register X the value of Y.
  X must be between 0 and 7, and Y must
  be a number between 0 and 255.

· 'borra RX'
  Sets the value of register X to 0.
  X must be between 0 and 7.

· 'salta Y'
· 'salta :landmark:'
  Jumps to Y instruction or jump to
  :landmark: (which must be present in
  your code). For example:
  --------------------------------------
	:landmark:
	  imprime R0
	salta :landmark:
	salta 255
  --------------------------------------
  This piece of code first prints the
  value of R0, then jumps to ':landmark:'.
  Note that every landmark must begin
  with ":" and end with ":". Otherwise,
  it will count as unkown instruction.  
  'Y' must be between 0 and 255.

· 'saltasi0 RX Y'
· 'saltasi0 RX :landmark:'
  Jumps to Y or :landmark: if the value
  of register X - which must be a
  number between 0 and 7 - is equals
  to 0. For example:
  --------------------------------------------------------------------------------------------------------
	valor R0 94 # 127 - 32
	valor R1 32
	:landmark:
	  resta R0 1
	  suma R1 1
	  imprimec R1
	saltasi0 R0 :landmarkEnd: salta :landmark: :landmarkEnd:	# :landmarkEnd: is the end of the loop, 
								# while :landmark: is the start of it.
	salta 255
  --------------------------------------------------------------------------------------------------------
  This piece of code will print all
  the ASCII characters that can be
  printed. If R0 is not 0, then go
  to the start of the loop. When R0
  reachs 0, then jump to :landmarkEnd:
  to escape from the loop.

------------------------------------------------
Additional notes
------------------------------------------------
· The ProcSMR2 can process till a maximum of 254
intructions. The instruction 255th is ignored
since it cannot be skipped by jumping with
'salta' and 'saltasi0'. 

· It is recommended to use the register 7th as a
temporary register. You may use it more than
once to print characters and nothing else.

· Landmarks has been added as a way to jump easily
between instruction without being a big pain in
the neck. Without landmarks, most of the time,
you try to figure out which instruction is each
one, something that most often leads to infinite
loops. Here you have some useful examples of
using landmarks:

Simple if:
	saltasi0 R0 :if:
	  # your code
	:if:

Simple for / while:
	:for:
	  resta R0 1
	  # your code
	saltasi0 R0 :forEnd: salta :for: :forEnd:

Simple function:
	salta :function: :functionEnd:
	# your code
	salta 255
	
	:function:
	  # your function
	salta :functionEnd:

Simple function to multiply numbers:
	--------------------------------------------------------------------------------------------------
	· Code:
	# In this example, R4 will be 3 and R5 will 3, returning a value of 9 in R6 (see :multiply:)
	valor R4 3 imprime R4
	valor R7 32 imprimec R7 # [space]
	valor R7 42 imprimec R7 # *
	valor R7 32 imprimec R7 # [space]
	valor R5 3 imprime R5
	valor R7 32 imprimec R7 # [space]
	valor R7 61 imprimec R7 # =
	valor R7 32 imprimec R7 # [space]
	salta :multiply: :multiplyEnd:
	imprime R6
	salta 255
	
	:multiply: # Arguments: R4 * R5 = R6;
	  :beginMultiply:
	    resta R5 1
	    :beginCopy:
	      resta R4 1
	      suma R6 1
	    saltasi0 R4 :finishCopy: salta :beginCopy: :finishCopy:
	               # !!!!
	    valor R4 3 # !!!! IMPORTANT: R4 must be reset every time its value is copied to R6
	               # !!!!
	  saltasi0 R5 :finishMutliply: salta :beginMultiply: :finishMutliply:
	salta :multiplyEnd:
	--------------------------------------------------------------------------------------------------
	· Binary:
	00010100000000110000010000000000000101110010000000001111000000000001011100101010000011110000000000
	01011100100000000011110000000000010101000000110000010100000000000101110010000000001111000000000001
	01110011110100001111000000000001011100100000000011110000000000110000000100110000011000000000001100
	00111111110010110100000001001011000000000100100110000000010011110000011000001100000001010000010100
	00000011001111010001101100110000000100110011000000010001
	--------------------------------------------------------------------------------------------------
	· Output: 
	3 * 3 = 9

Simple function to divide numbers:
	--------------------------------------------------------------------------------------------------
	· Code:
	# In this example, R4 will be 10 and R5 will 2, returning a value of 5 in R6 (see :divide:)
	valor R4 10 imprime R4
	valor R7 32 imprimec R7 # [space]
	valor R7 47 imprimec R7 # /
	valor R7 32 imprimec R7 # [space]
	valor R5 2 imprime R5
	valor R7 32 imprimec R7 # [space]
	valor R7 61 imprimec R7 # =
	valor R7 32 imprimec R7 # [space]
	salta :divide: :divideEnd:
	imprime R6
	salta 255
	
	:divide: # Arguments: R4 / R5 = R6;
	  :beginDivide:
	    :beginSubtract:
	      resta R5 1
	      resta R4 1
	    saltasi0 R5 :finishSubtract: salta :beginSubtract: :finishSubtract:
	               # !!!!
	    valor R5 2 # !!!! IMPORTANT: R5 must be reset every time it subtracts R5 from R4
	               # !!!!
	    suma R6 1
	  saltasi0 R4 :finishDivide: salta :beginDivide: :finishDivide:
	salta :divideEnd:
	--------------------------------------------------------------------------------------------------
	· Binary:
	00010100000010100000010000000000000101110010000000001111000000000001011100101111000011110000000000
	01011100100000000011110000000000010101000000100000010100000000000101110010000000001111000000000001
	01110011110100001111000000000001011100100000000011110000000000110000000100110000011000000000001100
	00111111110010110100000001001011000000000100111101000101110011000000010011000101010000001000100110
	00000001001111000001101100110000000100110011000000010001
	--------------------------------------------------------------------------------------------------
	· Output:
	10 / 2 = 5









