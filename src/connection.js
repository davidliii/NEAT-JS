class Connection {
    constructor(inNodeID, outNodeID, weight, enabled, innovationNumber) {
        this.inNodeID = inNodeID;
        this.outNodeID = outNodeID;
        this.weight = weight;
        this.enabled = enabled;
        this.innovationNumber = innovationNumber
    }

    getInNodeID() {
        return this.inNodeID;
    }

    getOutNodeID() {
        return this.outNodeID;
    }

    getWeight() {
        return this.weight;
    }

    isEnabled() {
        return this.enabled;
    }

    getInnovationNumber() {
        return this.innovationNumber;
    }

    clone() {
        return new Connection(this.inNodeID, this.outNodeID, this.weight, this.enabled, this.innovationNumber);
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }
}