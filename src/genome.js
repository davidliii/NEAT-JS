class Genome {
    constructor(numInputs, numOutputs, innovation, nodes, connections) {
        this.numInputs = numInputs;
        this.numOutputs = numOutputs;
        this.innovation = innovation;

        this.nodes;
        this.connections;

        this.inputNodes = [];
        this.outputNodes = [];
        this.biasNode = null;

        this.nextNodeID = 0;

        if (nodes == null && connections == null) { // fresh genome
            this.nodes = [];
            this.connections = [];
            this.makeNodesAndConnections();
        }

        else { // genome resulting from crossover
            this.nodes = nodes;
            this.connections = connections;
            this.sortNodes();
            this.findInputBiasOutputNodes();
            this.nextNodeID = this.nodes[this.nodes.length - 1].id + 1;
        }
    }

    get data() {
        let nodeInfo = 'Nodes: \n'
        for (let n of this.nodes) {
            nodeInfo += String(n.id) + '\n';
        }

        let enabledConnectionInfo = "Enabled Connections: \n";
        let disabledConnectionInfo = "Disable Connections: \n"
        for (let c of this.connections) {
            if (c.enabled) {
                enabledConnectionInfo += "#" + String(c.innovationNumber) + ': ' + String(c.outNodeID) + ' -> ' + String(c.inNodeID) + '\n';
            }
            else {
                disabledConnectionInfo += "#" + String(c.innovationNumber) + ': ' + String(c.outNodeID) + ' -> ' + String(c.inNodeID) + '\n';
            }
        }

        return nodeInfo + enabledConnectionInfo + disabledConnectionInfo;
    }

    makeNodesAndConnections() {
        for (let i = 0; i < this.numInputs; i++) { // make input nodes
            let node = new Node(i, nodeType.INPUT);
            this.nodes.push(node);
            this.inputNodes.push(node);
        }

        for (let i = this.numInputs; i < this.numInputs + this.numOutputs; i++) { // make output nodes
            let node = new Node(i, nodeType.OUTPUT);
            this.nodes.push(node);
            this.outputNodes.push(node);
        }

        let node = new Node(this.numInputs + this.numOutputs, nodeType.BIAS); // make bias node
        this.nodes.push(node);
        this.nextNodeID = this.numInputs + this.numOutputs + 1;
        this.biasNode = node;

        // fully connect
        for (let outNode of this.inputNodes.concat(this.biasNode)) {
            for (let inNode of this.outputNodes) {
                let inNodeID = inNode.id;
                let outNodeID = outNode.id;
                let weight = getRandomFloatBetween(-1, 1);
                let innovationNumber;

                if (this.innovation.doesMutationExist(inNodeID, outNodeID)) {
                    innovationNumber = getMutatation(inNodeID, outNodeID).innovationNumber;
                }

                else {
                    innovationNumber = this.innovation.getNextNumber();
                    this.innovation.addMutation(inNodeID, outNodeID, innovationNumber);
                }
                this.connections.push(new Connection(inNodeID, outNodeID, weight, true, innovationNumber));
            }
        }
    }

    sortNodes() {
        this.nodes.sort((a, b) => a.id - b.id);
    }

    sortConnections() {
        this.connections.sort((a, b) => a.innovationNumber - b.innovationNumber);
    }

    findInputBiasOutputNodes() {
        this.inputNodes = [];
        this.outputNodes = [];
        this.biasNode = null;

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type == nodeTypes.INPUT) {
                this.inputNodes.push(this.nodes[i]);
            }
            else if (this.nodes[i].type == nodeTypes.OUTPUT) {
                this.outputNodes.push(this.nodes[i]);
            }
            else if (this.nodes[i].type == nodeTypes.BIAS) {
                this.biasNode = this.nodes[i];
            }
        }
    }

    getNodeByID(id) { // binary search
        this.sortNodes();

        let lb = 0;
        let ub = this.nodes.length - 1;
        while (lb <= ub) {
            let m = Math.floor((lb + ub) / 2);
            let node = this.nodes[m];
            if (node.id == id) return node;
            else if (node.id < id) lb = m + 1;
            else ub = m - 1;
        }
        return null;
    }

    getConnectionByInnovationNumber(innovationNumber) { // binary search
        this.sortConnections();

        let lb = 0;
        let ub = this.connections.length - 1;
        while (lb <= ub) {
            let m = Math.floor((lb + ub) / 2);
            let connection = this.connections[m];
            if (connection.innovationNumber == innovationNumber) return connection;
            else if (connection.innovationNumber < innovationNumber) lb = m + 1;
            else ub = m - 1;
        }
        return null;
    }

    getConnectedNodes() {
        let connectedNodePairs = [];
        for (let c of this.connections) {
            connectedNodePairs.push([c.inNodeID, c.outNodeID]);
        }

        return connectedNodePairs;
    }

    getUnconnectedNodes() {
        let unconnectedNodePairs = [];
        let nodeOrdering = this.getNodeOrdering();

        for (let i = 0; i < nodeOrdering.length; i++) {
            for (let j = i+1; j < nodeOrdering.length; j++) {
                let inNodeID = nodeOrdering[j];
                let outNodeID = nodeOrdering[i];

                if (!this.areNodesConnected(inNodeID, outNodeID)) {
                    if (this.getNodeByID(inNodeID).type == nodeType.INPUT && this.getNodeByID(outNodeID).type == nodeType.INPUT) {
                    }

                    else if (this.getNodeByID(inNodeID).type == nodeType.OUTPUT && this.getNodeByID(outNodeID).type == nodeType.OUTPUT) {
                    }

                    else if (this.getNodeByID(inNodeID).type == nodeType.BIAS && this.getNodeByID(outNodeID).type == nodeType.INPUT) {
                    }

                    else {
                        unconnectedNodePairs.push([inNodeID, outNodeID]);
                    }
                }
            }
        }

        return unconnectedNodePairs;
    }

    getNodeOrdering() {
        var convertConnections = function(connections) {
            let newConnections = new Array();
            for (let i = 0; i < connections.length; i++) {
                newConnections.push({inNodeID: connections[i].inNodeID,
                                        outNodeID: connections[i].outNodeID})
            }
            return newConnections;
        }
    
        var getStartingNodes = function(network) {
            let startingNodes = [];
            for (let i = 0; i < network.inputNodes.length; i++) {
                startingNodes.push(network.inputNodes[i]);
            }
            startingNodes.push(network.biasNode);
            return startingNodes;
        }

        var getConnectedNodesAndEdgeIndeces = function(edges, nodeID) {
            let nodesAndIndeces = [];
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].outNodeID == nodeID) {
                    nodesAndIndeces.push([edges[i].inNodeID, i]);
                }
            }
            nodesAndIndeces.sort((a, b) => b[1] - a[1]);
            return nodesAndIndeces;
        }

        var hasIncomingEdges = function(edges, nodeID) {
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].inNodeID == nodeID) {
                    return true;
                }
            }
            return false;
        }

        var getNodeByID = function(network, ID) {
            for (let i = 0; i < network.nodes.length; i++) {
                if (network.nodes[i].id == ID) {
                    return network.nodes[i];
                }
            }
        }

        this.inputNodes.sort((a, b) => a.ID - b.ID);
        this.outputNodes.sort((a, b) => a.ID - b.ID);

        let edges = convertConnections(this.connections);
        let sortedNodes = [];
        let nodesWithNoIncomingEdges = getStartingNodes(this);

        while (nodesWithNoIncomingEdges.length) {
            let n = nodesWithNoIncomingEdges.shift();
            sortedNodes.push(n.id);

            let connectedNodesAndEdges = getConnectedNodesAndEdgeIndeces(edges, n.id);
            for (let [m, idx] of connectedNodesAndEdges) {
                edges.splice(idx, 1);
                if (!hasIncomingEdges(edges, m)) {
                    nodesWithNoIncomingEdges.push(getNodeByID(this, m));
                }
            }
        }

        return sortedNodes;        
    }

    areNodesConnected(node1ID, node2ID) {
        for (let c of this.connections) {
            if (c.inNodeID == node1ID && c.outNodeID == node2ID || c.inNodeID == node2ID && c.outNodeID == node1ID) {
                return true;
            }
        }
        return false;
    }

    getConnectionBetween(inNodeID, outNodeID) {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].inNodeID == inNodeID && this.connections[i].outNodeID == outNodeID) {
                return this.connections[i];
            }
        }
        return null;
    }

    getEnabledConnections() {
        let enabledConnections = [];
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].enabled) {
                enabledConnections.push(this.connections[i]);
            }
        }
        return enabledConnections;
    }

    mutateNewNode() {  
        /**
         * Inserts a new node between an exisiting connection
         * Caveats: the new node must be between two nodes whose connection is enabled
         */        
        let enabledConnections = this.getEnabledConnections();
        if (enabledConnections.length == 0) {
            return;
        }

        let randomIdx = getRandomIntInclusive(0, enabledConnections.length - 1);

        let connection = enabledConnections[randomIdx];
        this.addNewNodeBetween(connection.inNodeID, connection.outNodeID)
    }

    mutateNewConnection() {
        /**
         * Creates a connection between two nodes that are disconnected
         */

         let disconnectedNodePairs = this.getUnconnectedNodes();
         if (disconnectedNodePairs.length == 0) {
             return;
         }

         let inNodeID = disconnectedNodePairs[0];
         let outNodeID = disconnectedNodePairs[1];
         let weight = getRandomFloatBetween(-1, 1);
         let innovationNumber;

         if (this.innovation.doesMutationExist(inNodeID, outNodeID)) {
             innovationNumber = this.innovation.getMutation(inNodeID, outNodeID).innovationNumber;
         }

         this.addNewConnectionBetween(inNodeID, outNodeID, weight, true, innovationNumber);
    }

    mutateconnectionWeights(changeRate, randomizeRate, bound, strength) {
        for (let i = 0; i < this.connections.length; i++) {
            if (Math.random() <= changeRate) {
                if (Math.random() <= randomizeRate) {
                    this.connections[i].weight = getRandomFloatBetween(-1, 1);
                }

                else {
                    this.connections[i].weight += strength * getRandomFloatBetween(-1, 1);
                }
            }

            if (this.connections[i].weight >= bound) {
                this.connections[i].weight = bound;
            }

            else if (this.connections[i].weight <= -1 * bound) {
                this.connections[i].weight = -1 * bound;
            }
        }
    }

    addNewNodeBetween(inNodeID, outNodeID) {
        if (!this.areNodesConnected(inNodeID, outNodeID)) {
            return;
        }

        let newNode = new Node(this.nextNodeID++, nodeType.HIDDEN);

        let innovationNumber1;
        let innovationNumber2;

        if (this.innovation.doesMutationExist(inNodeID, newNode.id)) {
            innovationNumber1 = this.innovation.getMutation(inNodeID, newNode.id).innovationNumber;
        }

        else {
            innovationNumber1 = this.innovation.getNextNumber();
            this.innovation.addMutation(inNodeID, newNode.id, innovationNumber1);
        }

        if (this.innovation.doesMutationExist(newNode.id, outNodeID)) {
            innovationNumber1 = this.innovation.getMutation(newNode.id, outNodeID).innovationNumber;
        }

        else {
            innovationNumber2 = this.innovation.getNextNumber();
            this.innovation.addMutation(newNode.id, outNodeID, innovationNumber2);
        }

        let oldConnection = this.getConnectionBetween(inNodeID, outNodeID);
        oldConnection.disable();

        this.addNewConnectionBetween(inNodeID, newNode.id, oldConnection.weight, true, innovationNumber1);
        this.addNewConnectionBetween(newNode.id, outNodeID, 1.0, true, innovationNumber2);
        this.nodes.push(newNode);
        this.sortNodes();
    }

    addNewConnectionBetween(inNodeID, outNodeID, weight, enabled, innovationNumber) {
        if (this.areNodesConnection) {
            return;
        }

        this.connections.push(new Connection(inNodeID, outNodeID, weight, enabled, innovationNumber));
        this.sortConnections();
    }
}