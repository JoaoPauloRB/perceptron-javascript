var neuron = function(weights) {
    this.learningRate = 0.2;
    this.bias = 0;
    this.weights = weights;

    this.activationFunction = function(value) {
        return (value>=0.5 ? 1 : 0);
    };

    this.calculateOutput = function(input) {
        var output = 0;
        for(var index in this.weights){
            output += this.weights[index] * input[index]
        }
        return this.activationFunction(output + this.bias);
    };

    this.correctionNeuron = function(deltaW, deltaB) {
        this.bias += deltaB*this.learningRate;
        for(var weight in this.weights){
            this.weights[weight] += deltaW[weight]*this.learningRate;
        }
    };
    
    this.toString = function() {
    	return 'learningRate: ' + this.learningRate + ' bias: ' + this.bias + ' weights: ' + this.weights;
    };
}

var perceptron = function() {
    this.layers = [];

    this.initialize = function() {
        this.layers.push([new neuron([0,0])]);
    }

    this.run = function(input, expectedValue){
        var output = this.feedfoward(input);
        console.log('valor esperado: '+expectedValue, 'valor adquirido: ' + output, 'layers: ' + this.layers);
        if(expectedValue!=output){
            var deltaW = this.generateDeltaW(input, output, expectedValue);
            var deltaB = expectedValue-output;
            this.correction(deltaW, deltaB);
        }        
    }

    this.generateDeltaW = function(input, output, expectedValue) {
        var deltaW = [];
        for(var i=0; i<input.length; i++) {
            deltaW.push((expectedValue-output)*input[i]);
        }
        return deltaW;
    }

    this.feedfoward = function(input) {
        for(var layer in this.layers) {
            var output = [];
            var neurons = this.layers[layer];
            for(var neuron in neurons){
                output.push(neurons[neuron].calculateOutput(input));
            }
            input = output;
        }
        return input[0];
    }

    this.correction = function(deltaW, deltaB) {
        for(var layer = this.layers.length-1; layer>=0; layer--) {
            var neurons = this.layers[layer];
            for(var neuron = 0; neuron<neurons.length; neuron++) {
                neurons[neuron].correctionNeuron(deltaW, deltaB);
            }
        }
    }

    this.initialize();
}



/* Entradas */
var inputsAND = [
    [[1,1],1],
    [[0,0],0],
    [[0,1],0],
    [[1,0],0]
];

var inputsOR = [
    [[1,1],1],
    [[0,0],0],
    [[0,1],1],
    [[1,0],1]
];

var inputsXOR = [
    [[1,1],0],
    [[0,0],0],
    [[0,1],1],
    [[1,0],1]
];

function rodar(inputs) {
	/* Execução do algoritmo */
	var perc = new perceptron();
	for (var k = 0;k < 10;k++) {
		for(var i=0; i<inputs.length; i++) {
		    perc.run(inputs[i][0], inputs[i][1]);
		}
	}
	return perc.toString();
}

console.log("Porta AND");
var layersAND = rodar(inputsAND);

console.log("Porta OR");
var layersOR = rodar(inputsOR);

console.log("Porta XOR");
var layersXOR = rodar(inputsXOR);

