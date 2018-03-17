function id(id){
    return document.getElementById(id);
}

window.onload = function() {
    var btnTrain = document.getElementById('trainNeuralNetwork');
    btnTrain.onclick = function() {
        var perc = new Perceptron();
        var lines = id('neuralNetworkInput').value.split('\n');
        outputs = [];
        inputs = [];
        var result = "";
        for(var i = 0; i<lines.length; i++) {
            var values = lines[i].split(';');
            values[0] = values[0].split(',');
            result+=perc.run(values[0], values[1]);
        }
        document.getElementById('result').innerText = result;
    }
}