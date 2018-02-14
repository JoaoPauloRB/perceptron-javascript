var Neuron = function(weights, bias) {
    this.learningRate = 0.5;
    this.bias = bias;
    this.weights = weights;

    this.activationFunction = function(value) {
        return 1/(1+Math.pow(Math.E, -value));
    };

    this.calculateOutput = function(input) {
        var output = 0;
        for(var index in this.weights){
            output += this.weights[index] * input[index]
        }
        return this.activationFunction(output + this.bias);
    };

    this.correctionNeuron = function(output, expectedValue, inputs) {
        var erros = [];
        for(var weight in this.weights){
            var error = this.calculateError(output, expectedValue);
            erros.push(error * this.weights[weight]);
            this.weights[weight] -= error * inputs[weight] * this.learningRate;
        }
        return erros;
    };

    this.calculateError = function(output, expectedValue, input) {
        return -(expectedValue - output) * output * (1-output);
    }
    
    this.toString = function() {
    	return 'learningRate: ' + this.learningRate + ' bias: ' + this.bias + ' weights: ' + this.weights;
    };
}

var Perceptron = function() {
    this.layers = [];

    this.initialize = function() {
        this.layers.push([new Neuron([0.15, 0.20], 0.35), new Neuron([0.25, 0.30], 0.35)]);
        this.layers.push([new Neuron([0.40, 0.45], 0.6), new Neuron([0.50, 0.55], 0.6)]);
    }

    this.run = function(input, expectedValue){
        var outputs = this.feedfoward(input);
        var resultNetwork = outputs[outputs.length-1];
        
        console.log('valor esperado: '+expectedValue, 'valor adquirido: ' + resultNetwork, 'layers: ' + this.layers);

        if(this.needCorrection(resultNetwork, expectedValue)) {
            this.backpropagation(outputs, expectedValue);
        }        
    }

    this.feedfoward = function(input) {
        var outputs = [];
        outputs[-1] = input;
        for(var layer in this.layers) {
            outputs[layer] = [];
            var neurons = this.layers[layer];
            for(var neuron in neurons){
                outputs[layer].push(neurons[neuron].calculateOutput(input));
            }
            input = outputs[layer];
        }
        return outputs;
    }

    this.backpropagation = function(output, expectedValue) {

        var backupErros = null;
        for(var layer = this.layers.length-1; layer>=0; layer--) {
            var neurons = this.layers[layer];
            var errors = null;
            
            for(var neuron = 0; neuron<neurons.length; neuron++) {
                var expected = layer == this.layers.length-1 ? expectedValue[neuron] : backupErros[neuron]*(-1) + output[layer][neuron];
                var errorsNeuron = neurons[neuron].correctionNeuron(output[layer][neuron], expected, output[layer-1]);
                if(errors){
                    errors = sumArrays(errors, errorsNeuron);
                } else {
                    errors = errorsNeuron;
                }
                
            }
            backupErros = [].concat(errors);
        }
    }

    this.needCorrection = function(output, expectedValue) {
        for(var i = 0; i<output.length; i++) {
            if(output[i]!=expectedValue[i])
                return true;
        }
        return false;
    }

    this.squaredErrorFunction = function(expectedValue, output) {
        return .5*Math.pow((expectedValue + output,2));
    }

    this.derivedSquaredErrorFunction = function(expectedValue, output) {
        return -(expectedValue-output);
    }

    var sumArrays = function(arr1, arr2){
        if(arr1.length != arr2.length)
            throw new Exception('Array size different.');
        var arrSum = [];
        for(var i=0; i<arr1.length; i++) {
            arrSum.push(arr1[i]+arr2[i]);
        }
        return arrSum;
    }

    this.initialize();
}


/* Entradas */
var inputsTest = [
    [[0.05, 0.1], [0.01, 0.99]]
];

var inputsAND = [
    [[1,1],[0,1]],
    [[0,0],[1,0]],
    [[0,1],[1,0]],
    [[1,0],[1,0]]
];

var inputsXOR = [
    [[1,1],[0,1]],
    [[0,0],[0,1]],
    [[0,1],[1,0]],
    [[1,0],[1,0]]
];

function rodar(inputs) {
	/* Execução do algoritmo */
	var perc = new Perceptron();
	for (var k = 0;k < 10;k++) {
		for(var i=0; i<inputs.length; i++) {
		    perc.run(inputs[i][0], inputs[i][1]);
		}
	}
	return perc.toString();
}

console.log("Test values");
var layersTest = rodar(inputsTest);

console.log("Porta AND");
var layersAND = rodar(inputsAND);

console.log("Porta XOR");
var layersXOR = rodar(inputsXOR);

