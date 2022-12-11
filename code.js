"use strict";

///////////////////////////////////////////////////////////////
//////                     Functions                     //////
///////////////////////////////////////////////////////////////

function toBits(argValue, argLength) { // To convert to bit, we apply the same procedure we use to manually convert to binary.
	let value = argValue;
	let out = "";
	for (let i = 0; i < argLength; ++i) {
		out += Math.floor(value / 2) - value / 2 ? "1" : "0"; // We check whether its odd or even. If it's odd, add "1".
		value = Math.floor(value / 2);
	}
	return out.split("").reverse().join("");
}

function toDecimal(argValue, argLength) {
	let value = 0;
	for(let i = 0; i < argLength; ++i) {
		value += argValue[i] == "1" ? Math.pow(2, (argLength - 1) - i) : 0; // Checks if char is 1, then adds the power of i
	}
	return value;
}

function compile() {
	let binOutput = "";
	let gotos = [];
	let binInstructions = code.value.split("\n");
	for(let i = 0; i < binInstructions.length; ++i) { binInstructions[i] = binInstructions[i].split("#")[0]; } // We must go line by line, getting the part that is not commented
	binInstructions = binInstructions.join(" ").split("\t").join(" ").split(" "); // In case the code is copied from another text editor (in where you were able to add indentations), it is necessary to eliminate them from the code.
	errors.innerHTML = "";
	
	for(let i = 0, p = 0; i < binInstructions.length; ++i) {
		switch(binInstructions[i]) {
			case "imprime":
				if (binInstructions[i + 1][0] == "R" & binInstructions[i + 1][1] >= 0 & binInstructions[i + 1][1] <= 7) {
					binOutput += 	"00000" +
							toBits(binInstructions[i + 1][1], 3) +
						     	"00000000";
				} else {
					errors.innerHTML += "<p>Error in instruction 'imprime' at position " + p + ": " + binInstructions[i + 1] + " is not a valid register.</p>";
				}
				i += 1;
				++p;
			break;
			case "imprimec":
				if (binInstructions[i + 1][0] == "R" & binInstructions[i + 1][1] >= 0 & binInstructions[i + 1][1] <= 7) {
					binOutput += 	"00001" +
							toBits(binInstructions[i + 1][1], 3) +
						     	"00000000";
				} else {
					errors.innerHTML += "<p>Error in instruction 'imprimec' at position " + p + ": " + binInstructions[i + 1] + " is not a valid register.</p>";
				}
				i += 1;
				++p;
			break;
			case "valor":
				if (binInstructions[i + 1][0] == "R" & binInstructions[i + 1][1] >= 0 & binInstructions[i + 1][1] <= 7 & binInstructions[i + 2] >= 0 & binInstructions[i + 2] <= 255 & binInstructions[i + 2] != "") {
					binOutput += 	"00010" +
							toBits(binInstructions[i + 1][1], 3) +
							toBits(binInstructions[i + 2]   , 8);
				} else {
					errors.innerHTML += "<p>Error in instruction 'valor' at position " + p + ": Has either an invalid register (" + binInstructions[i + 1] + ") or an invalid value (" + binInstructions[i + 2] + ").</p>";
				}
				i += 2;
				++p;
			break;
			case "borra":
				if (binInstructions[i + 1][0] == "R" & binInstructions[i + 1][1] >= 0 & binInstructions[i + 1][1] <= 7) {
					binOutput +=	"00011" +
							toBits(binInstructions[i + 1][1], 3) +
							"00000000";
				} else {
					errors.innerHTML += "<p>Error in instruction 'borra' at position " + p + ": " + binInstructions[i + 1] + " is not a valid register.</p>";
				}
				i += 1;
				++p;
			break;
			case "suma":
				if (binInstructions[i + 1][0] == "R" & binInstructions[i + 1][1] >= 0 & binInstructions[i + 1][1] <= 7 & binInstructions[i + 2] >= 0 & binInstructions[i + 2] <= 255 & binInstructions[i + 2] != "") {
					binOutput += 	"00100" +
							toBits(binInstructions[i + 1][1], 3) +
							toBits(binInstructions[i + 2]   , 8);
				} else {
					errors.innerHTML += "<p>Error in instruction 'suma' at position " + p + ": Has either an invalid register (" + binInstructions[i + 1] + ") or an invalid value (" + binInstructions[i + 2] + ").</p>";
				}
				i += 2;
				++p;
			break;
			case "resta":
				if (binInstructions[i + 1][0] == "R" & binInstructions[i + 1][1] >= 0 & binInstructions[i + 1][1] <= 7 & binInstructions[i + 2] >= 0 & binInstructions[i + 2] <= 255 & binInstructions[i + 2] != "") {
					binOutput += 	"00101" +
							toBits(binInstructions[i + 1][1], 3) +
							toBits(binInstructions[i + 2]   , 8);
				} else {
					errors.innerHTML += "<p>Error in instruction 'resta' at position " + p + ": Has either an invalid register (" + binInstructions[i + 1] + ") or an invalid value (" + binInstructions[i + 2] + ").</p>";
				}
				i += 2;
				++p;
			break;
			case "salta":
				if (binInstructions[i + 1][0] == ":") {
					binOutput += 	"00110000" +
							binInstructions[i + 1]; // We will keep in the output what landmark has used, so we can replace it with the real instruction position.
				} else {
					if (binInstructions[i + 1] >= 0 & binInstructions[i + 1] <= 255 & binInstructions[i + 1] != "") {
						binOutput += 	"00110000" +
								toBits(binInstructions[i + 1], 8);
					} else {
						errors.innerHTML += "<p>Error in instruction 'salta' at position " + p + ": " + binInstructions[i + 1] + " is not a valid value.</p>";
					}
				}
				i += 1;
				++p;
			break;
			case "saltasi0":
				if (binInstructions[i + 1][0] == "R" & binInstructions[i + 1][1] >= 0 & binInstructions[i + 1][1] <= 7) {
					if (binInstructions[i + 2][0] == ":") {
						binOutput += 	"00111" +
								toBits(binInstructions[i + 1][1], 3) + 
								binInstructions[i + 2]; // We will keep in the output what landmark has used, so we can replace it with the real instruction position.
					} else {
						if (binInstructions[i + 2] >= 0 & binInstructions[i + 2] <= 255 & binInstructions[i + 2] != "") {
							binOutput += 	"00111" +
									toBits(binInstructions[i + 1][1], 3) + 
									toBits(binInstructions[i + 2]   , 8);
						} else {
							errors.innerHTML += "<p>Error in instruction 'saltasi0' at position " + p + ": " + binInstructions[i + 2] + " is not a valid value.</p>";
						}
					}
				} else {
					errors.innerHTML += "<p>Error in instruction 'salasi0' at position " + p + ": " + binInstructions[i + 1] + " is not a valid register.</p>";
				}
				i += 2;
				++p;
			break;
			default:
				if (binInstructions[i][0] == ":" & binInstructions[i][binInstructions[i].length - 1] == ":") { // If its a landmark, then store its instruction position
					gotos.push(binInstructions[i]);
					gotos.push(p);
				} else {
					if (binInstructions[i] != "") {
						errors.innerHTML += "<p>Error in instruction '" + binInstructions[i] + "' at position " + p + ": Not an instruction.</p>";
						++p;
					}
				}
			break;
		}
	}
	for (let i = 0; i < gotos.length; i += 2) { binOutput = binOutput.split(gotos[i]).join(toBits(gotos[i + 1], 8)); } // Replace every landmark with its instruction position
	for (let i = 1; i < binOutput.split(":").length; i += 2) { errors.innerHTML += "Unkown landmark '" + binOutput.split(":")[i] + "'.<br>"; } // Report if there is an unkown landmark
	if (errors.innerHTML == "") { binary.value = binOutput; }
}

function execute() {
	binary.value = binary.value.split("\n").join("").split("\t").join(""); // It is necessary to 'clean' the binary if it is copied from a document (which automatically adds line breaks), in order to make the emulator able to properly run the binary
	
	clear();
	let R = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
	let execOutput = "";
	for(let i = 0; i < 255; ++i) { // It is impossible to skip the instruction 255 by jumping, the only way to do it is this way. (note that the instruction 0b0000000000000000 prints 0)
		switch(binary.value.slice(i * 16, i * 16 + 5)) {
			case "00000": // imprime RX
				execOutput += R[toDecimal(binary.value.slice(i * 16 + 5, i * 16 + 8), 3)];
			break;
			case "00001": // imprimec RX
				execOutput += String.fromCharCode(R[toDecimal(binary.value.slice(i * 16 + 5, i * 16 + 8), 3)]);
			break;
			case "00010": case "00011": // valor RX Y // borra RX
				R[toDecimal(binary.value.slice(i * 16 + 5, i * 16 + 8), 3)] = toDecimal(binary.value.slice(i * 16 + 8, i * 16 + 16), 8);
			break;
			case "00100": // suma RX Y
				R[toDecimal(binary.value.slice(i * 16 + 5, i * 16 + 8), 3)] += toDecimal(binary.value.slice(i * 16 + 8, i * 16 + 16), 8);
			break;
			case "00101": // resta RX Y
				R[toDecimal(binary.value.slice(i * 16 + 5, i * 16 + 8), 3)] -= R[toDecimal(binary.value.slice(i * 16 + 5, i * 16 + 8), 3)] == 0 ? 0 : toDecimal(binary.value.slice(i * 16 + 8, i * 16 + 16), 8);
			break;
			case "00110": // salta X
				i = toDecimal(binary.value.slice(i * 16 + 8, i * 16 + 16), 8) - 1; /// !!!!!!!!!!!!!!!!!
			break;
			case "00111": // saltasi0 RX Y
				if (R[toDecimal(binary.value.slice(i * 16 + 5, i * 16 + 8), 3)] == 0) { i = toDecimal(binary.value.slice(i * 16 + 8, i * 16 + 16), 8) - 1; } // !!!!!!!!!
			break;
		}
	}
	output.value = execOutput;
}

function clear() {
	output.value = "";
}

///////////////////////////////////////////////////////////////
//////                       Main                        //////
///////////////////////////////////////////////////////////////

let code = document.getElementById("code");
let errors = document.getElementById("errors");
let binary = document.getElementById("bin");
let output = document.getElementById("out");

document.getElementById("compile").onclick = compile;
document.getElementById("exec").onclick = execute;
document.getElementById("clear").onclick = clear;
