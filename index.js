window.onload = function() {
    var button = document.getElementById('createNeuralNetwork');
    button.onclick = function() {
        var formTeste = document.getElementById('trainNeuralNetworkForm');
        var formCreate = document.getElementById('createNeuralNetworkForm');
        formCreate.style.display = "none";
        formTeste.style.display = "block";
    }
}