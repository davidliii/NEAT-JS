class NeuralNetwork {
    constructor(genome) {
        this.inputNeurons = [];
        this.outputNeurons = [];
        this.biasNeuron;
        this.allNeurons = [];
        this.connections = [];

        this.parseGenome(genome);
    }

    parseGenome(genome) {
        for (let node of genome.nodes) { // make neurons
            let neuron = new NeuralNetworkNeuron(node.id);
            if (node.type == nodeType.INPUT) {
                neuron.isInput = true
                this.inputNeurons.push(neuron);
            }

            else if (node.type == nodeType.OUTPUT) {
                this.outputNeurons.push(neuron);
            }

            else if (node.type == nodeType.BIAS) {
                this.biasNeuron = neuron;
                neuron.isInput = true
            }

            this.allNeurons.push(neuron);
        }

        for (let connection of genome.connections) {
            if (connection.enabled) {
                this.connections.push(new NeuralNetworkConnection(connection.inNodeID, connection.outNodeID, connection.weight));
            }
        }

        this.sortNeurons();
    }

    evaluate(inputValues) {
        this.sortNeurons();
        for (let i = 0; i < this.inputNeurons.length; i++) {
            this.inputNeurons[i].output = inputValues[i]
        }

        this.biasNeuron.output = 1;

        for (let i = 0; i < this.allNeurons.length; i++) {
            if (!this.allNeurons[i].isInput) {
                this.allNeurons[i].activate(this.sumIncomingInputs(this.allNeurons[i].id));
            }
        }

        let output = []
        for (let i = 0; i < this.outputNeurons.length; i++) {
            output.push(this.outputNeurons[i].output)
        }

        return output;
    }

    sortNeurons() { // topological sort on this.allNeurons
        this.inputNeurons.sort((a,b) => a.id - b.id);
        this.outputNeurons.sort((a,b) => a.id - b.id);

        var convertConnections = function(connections) {
            let newConnections = [];
            for (let i = 0; i < connections.length; i++) {
                newConnections.push({inNodeID: connections[i].inNodeID,
                                     outNodeID: connections[i].outNodeID})
            }
            return newConnections;
        }
    
        var getStartingNeurons = function(network) {
            let startingNeurons = [];
            for (let i = 0; i < network.inputNeurons.length; i++) {
                startingNeurons.push(network.inputNeurons[i]);
            }
            startingNeurons.push(network.biasNeuron);
            return startingNeurons;
        }

        var getConnectedNeuronsAndEdgeIndeces = function(edges, nodeID) {
            let neuronsAndIndeces = [];
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].outNodeID == nodeID) {
                    neuronsAndIndeces.push([edges[i].inNodeID, i]);
                }
            }
            neuronsAndIndeces.sort((a, b) => b[1] - a[1]);
            return neuronsAndIndeces;
        }

        var hasIncomingEdges = function(edges, nodeID) {
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].inNodeID == nodeID) {
                    return true;
                }
            }
            return false;
        }

        var getNeuronByID = function(network, ID) {
            for (let i = 0; i < network.allNeurons.length; i++) {
                if (network.allNeurons[i].id == ID) {
                    return network.allNeurons[i];
                }
            }
        }

        let edges = convertConnections(this.connections);
        let sortedNeurons = [];
        let neuronsWithNoIncomingEdges = getStartingNeurons(this);

        while (neuronsWithNoIncomingEdges.length) {
            let n = neuronsWithNoIncomingEdges.shift();
            sortedNeurons.push(n);

            let connectedNeuronsAndEdges = getConnectedNeuronsAndEdgeIndeces(edges, n.id);
            for (let [m, idx] of connectedNeuronsAndEdges) {
                edges.splice(idx, 1);
                if (!hasIncomingEdges(edges, m)) {
                    neuronsWithNoIncomingEdges.push(getNeuronByID(this, m));
                }
            }
        }

        this.allNeurons = sortedNeurons;
    }

    sumIncomingInputs(nodeID) {
        let total = 0;

        let incomingConnections = this.getIncomingConnections(nodeID);
        for (let i = 0; i < incomingConnections.length; i++) {
            let weight = incomingConnections[i].weight;
            let nodeOutput = this.getNodeByID(incomingConnections[i].outNodeID).output;
            total +=  weight * nodeOutput; 
        }

        return total
    }

    getIncomingConnections(nodeID) {
        let incomingConnections = []
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].inNodeID == nodeID) {
                incomingConnections.push(this.connections[i])
            }
        }

        return incomingConnections;
    }

    getNodeByID(ID) {
        for (let i = 0; i < this.allNeurons.length; i++) {
            if (this.allNeurons[i].id == ID) {
                return this.allNeurons[i]
            }
        }
        return null;
    }
}

class NeuralNetworkNeuron {
    constructor(id) {
        this.id = id;
        this.output = 0;
        this.isInput = false;
    }

    activate(x) {
        this.output = this.phiActivation(x);
    }

    phiActivation(x) {
        return 1 / (1 + Math.exp(-4.9*x));
    }
}

class NeuralNetworkConnection {
    constructor(inNodeID, outNodeID, weight) {
        this.inNodeID = inNodeID;
        this.outNodeID = outNodeID;
        this.weight = weight;
    }
}