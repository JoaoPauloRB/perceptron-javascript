var Neuron = function(weights) {
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
        return this.correctNeuron(error, inputs, learningRate);
    };

    this.correctHiddenNeuron = function(output, expectedValue, inputs, learningRate) {
        var error = expectedValue * output * (1-output)
        return this.correctNeuron(error, inputs, learningRate);
    };

    this.correctNeuron = function(error, inputs, learningRate) {
        var errors = [];     
        for(var weight in this.weights){
            errors.push(error * this.weights[weight]);
            this.weights[weight] -= error * inputs[weight] * learningRate;
        }
        
        return errors;
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
        this.learningRate = 0.2;
        this.layers.push([new Neuron([0.50, 0.50]), new Neuron([0.25, 0.30])]);
        this.layers.push([new Neuron([0.40, 0.45])]);
    }

    this.run = function(input, expectedValue){
        this.layers[0] = input;
        var outputs = this.feedfoward(input);
        outputs[0] = input;
        var resultNetwork = outputs[outputs.length-1];
        
        var result = 'valor esperado: '+expectedValue + '\nvalor adquirido: ' + resultNetwork + '\nlayers: ' + this.layers + '\nbias: ' + this.bias+'\n\n';
        console.log('valor esperado: '+expectedValue, 'valor adquirido: ' + resultNetwork, 'layers: ' + this.layers, 'bias: ' + this.bias);
        if(this.needCorrection(resultNetwork, expectedValue)) {
            this.backpropagation(outputs, expectedValue);
        }
        return result;    
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
                if(isOutputLayer){
                    errorsNeuron = neurons[neuron].correctOutputNeuron(output[layer][neuron], expectedValue[neuron], output[layer-1], this.learningRate);
                }
                else{
                   errorsNeuron = neurons[neuron].correctHiddenNeuron(output[layer][neuron], backupErros[neuron], output[layer-1], this.learningRate);                    
                }
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