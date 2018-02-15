var Neuron = function(weights, bias) {
    this.weights = weights;

    this.activationFunction = function(value) {
        return 1/(1+Math.pow(Math.E, -value));
    };

    this.calculateOutput = function(input, bias) {
        var output = 0;
        for(var index in this.weights){
            output += this.weights[index] * input[index]
        }
        return this.activationFunction(output + bias);
    };

    this.correctOutputNeuron = function(output, expectedValue, inputs, learningRate) {
        var error = -(expectedValue - output) * output * (1-output);
        return correctNeuron(error, inputs, learningRate);
    };

    this.correctHiddenNeuron = function(output, expectedValue, inputs, learningRate) {
        var error = expectedValue * output * (1-output)
        return correctNeuron(error, inputs, learningRate);
    };

    var correctNeuron = function(error, inputs, learningRate) {
        var erros = [];
        for(var weight in this.weights){
            erros.push(error * this.weights[weight]);
            this.weights[weight] -= error * inputs[weight] * learningRate;
        }
        return erros;
    }
    
    this.toString = function() {
    	return ' weights: ' + this.weights;
    };
}

var Perceptron = function() {
    this.layers = [null];
    this.bias = null;
    this.learningRate = null;

    this.initialize = function() {
        this.bias = [0.35, 0.6];
        this.learningRate = 0.5;
        this.layers.push([new Neuron([0.15, 0.20], 0.35), new Neuron([0.25, 0.30], 0.35)]);
        this.layers.push([new Neuron([0.40, 0.45], 0.6), new Neuron([0.50, 0.55], 0.6)]);
    }

    this.run = function(input, expectedValue){
        this.layers[0] = input;
        var outputs = this.feedfoward(input);
        var resultNetwork = outputs[outputs.length-1];
        
        console.log('valor esperado: '+expectedValue, 'valor adquirido: ' + resultNetwork, 'layers: ' + this.layers);

        if(this.needCorrection(resultNetwork, expectedValue)) {
            this.backpropagation(outputs, expectedValue);
        }        
    }

    this.feedfoward = function(input) {
        var outputs = [];
             
        for(var layer = 1; layer<this.layers.length; layer++) {
            outputs[layer] = [];
            var neurons = this.layers[layer];
            
            for(var neuron in neurons){
                outputs[layer].push(neurons[neuron].calculateOutput(input, this.bias[layer-1]));
            }
            input = outputs[layer];
        }
        return outputs;
    }

    this.backpropagation = function(output, expectedValue) {
        var backupErros = null;
        var errorsNeuron = null;
        var errors = null;
        for(var layer = this.layers.length-1; layer>0; layer--) {
            var neurons = this.layers[layer];                      
            
            var isOutputLayer = layer == this.layers.length-1;
            for(var neuron = 0; neuron<neurons.length; neuron++) {
                if(isOutputLayer)
                    errorsNeuron = neurons[neuron].correctOutputNeuron(output[layer][neuron], expectedValue[neuron], output[layer-1], this.learningRate);
                else
                    errorsNeuron = neurons[neuron].correctHiddenNeuron(output[layer][neuron], backupErros[neuron], output[layer-1], this.learningRate);
                errors = sumErrorArrays(errors, errorsNeuron);
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

    var sumErrorArrays = function(erros, newErros){
        if(erros === null)
            return newErros;

        var arrSum = [];
        for(var i=0; i<erros.length; i++) {
            arrSum.push(erros[i]+newErros[i]);
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

