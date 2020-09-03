class Innovation {
    constructor() {
        this.value = 0;
        this.mutationHashValueSet = new Set(); // stores hash values of mutations
        this.mutationMap = new Map(); // stores mutations
    }

    getNextNumber() {
        return this.value++;
    }

    addMutation(inNodeID, outNodeID, innovationNumber) {
        let mutation = new Mutation(inNodeID, outNodeID, innovationNumber);
        let hash = this.getMutationHash(inNodeID, outNodeID)
        this.mutationHashValueSet.add(hash);
        this.mutationMap.set(hash, mutation);
    }

    getMutation(inNodeID, outNodeID) {
        let hash = this.getMutationHash(inNodeID, outNodeID);
        return this.mutationMap.get(hash);
    }

    doesMutationExist(inNodeID, outNodeID) {
        let hash = this.getMutationHash(inNodeID, outNodeID);
        if (this.mutationHashValueSet.has(hash)) {
            return true;
        }

        else {
            return false;
        }
    }

    getMutationHash(inNodeID, outNodeID) { // cantor pairing function
        return 0.5 * (inNodeID + outNodeID) * (inNodeID + outNodeID + 1) + outNodeID;
    }
}

class Mutation {
    constructor(inNodeID, outNodeID, innovationNumber) {
        this.inNode = inNodeID;
        this.outNode = outNodeID;
        this.innovationNumber = innovationNumber;
    }
}