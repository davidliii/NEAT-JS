const nodeType = {
    INPUT: 0,
    OUTPUT: 1,
    HIDDEN: 2,
    BIAS: 3
}

class Node {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }

    getID() {
        return this.id;
    }

    clone() {
        return new Node(this.id, this.type);
    }
}