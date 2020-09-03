function testGenome1() {
    // test initialized network
    let t0 = performance.now();
    let e = new Error('');
    let innovation = new Innovation();
    let genome = new Genome(2, 2, innovation);

    let conditions = [];

    var modifiedSigmoid = (x) => 1 / (1 + Math.exp(-4.9 * x));
    
    for (let i = 0; i < 50; i++) {
        let w1 = Math.random();
        let w2 = Math.random();
        let w3 = Math.random();
        let w4 = Math.random();
        let w5 = Math.random();
        let w6 = Math.random();

        let i1 = Math.random();
        let i2 = Math.random();

        genome.getConnectionBetween(2, 0).weight = w1;
        genome.getConnectionBetween(3, 0).weight = w2;
        genome.getConnectionBetween(2, 1).weight = w3;
        genome.getConnectionBetween(3, 1).weight = w4;
        genome.getConnectionBetween(2, 4).weight = w5;
        genome.getConnectionBetween(3, 4).weight = w6;

        let nn = new NeuralNetwork(genome);

        let output = nn.evaluate([i1, i2]);
        let expectedOut = [modifiedSigmoid(w1*i1 + w3*i2 + w5), modifiedSigmoid(w2*i1 + w4*i2 + w6)]

        if (output[0].toFixed(5) == expectedOut[0].toFixed(5) && output[1].toFixed(5) == expectedOut[1].toFixed(5)) {
            conditions.push(true);
        }

        else {
            conditions.push(false);
        }
    }
    let t1 = performance.now();

    try {
        if (conditions.includes(false)) throw e;   

        print_green(getFuncName() + " Passed (took " + String((t1-t0).toFixed(5)) + " ms)");
    }
    catch(err) {
        print_red(getFuncName() + " Failed (took " + String((t1-t0).toFixed(5)) + " ms)");
    }
}

function testGenome2() {
    // test network with node mutation
    let t0 = performance.now();
    let e = new Error('');
    let innovation = new Innovation();
    let genome = new Genome(2, 2, innovation);
    genome.addNewNodeBetween(2, 0, innovation.value++, innovation.value++);

    let conditions = [];

    var modifiedSigmoid = (x) => 1 / (1 + Math.exp(-4.9 * x));
    
    for (let i = 0; i < 50; i++) {
        let w1 = Math.random();
        let w2 = Math.random();
        let w3 = Math.random();
        let w4 = Math.random();
        let w5 = Math.random();
        let w6 = Math.random();
        let w7 = Math.random();

        let i1 = Math.random();
        let i2 = Math.random();

        genome.getConnectionBetween(5, 0).weight = w1;
        genome.getConnectionBetween(2, 5).weight = w2;
        genome.getConnectionBetween(3, 0).weight = w3;
        genome.getConnectionBetween(2, 1).weight = w4;
        genome.getConnectionBetween(3, 1).weight = w5;
        genome.getConnectionBetween(2, 4).weight = w6;
        genome.getConnectionBetween(3, 4).weight = w7;

        let nn = new NeuralNetwork(genome);

        let output = nn.evaluate([i1, i2]);
        let expectedOut = [modifiedSigmoid(w2*modifiedSigmoid(w1*i1) + w4*i2 + w6), modifiedSigmoid(w3*i1 + w5*i2 + w7)]

        if (output[0].toFixed(5) == expectedOut[0].toFixed(5) && output[1].toFixed(5) == expectedOut[1].toFixed(5)) {
            conditions.push(true);
        }

        else {
            conditions.push(false);
        }
    }
    let t1 = performance.now();
    try {
        if (conditions.includes(false)) throw e;   

        print_green(getFuncName() + " Passed (took " + String((t1-t0).toFixed(5)) + " ms)");
    }
    catch(err) {
        print_red(getFuncName() + " Failed (took " + String((t1-t0).toFixed(5)) + " ms)");
    }
}

function testGenome3() {
    // test network with node and connection mutation
    let t0 = performance.now();
    let e = new Error('');
    let innovation = new Innovation();
    let genome = new Genome(2, 2, innovation);
    genome.addNewNodeBetween(2, 0, innovation.value++, innovation.value++);
    genome.addNewConnectionBetween(3, 5, getRandomFloatBetween(-1, 1), innovation.value++);

    let conditions = [];
    var modifiedSigmoid = (x) => 1 / (1 + Math.exp(-4.9 * x));
    
    for (let i = 0; i < 50; i++) {
        let w1 = Math.random();
        let w2 = Math.random();
        let w3 = Math.random();
        let w4 = Math.random();
        let w5 = Math.random();
        let w6 = Math.random();
        let w7 = Math.random();
        let w8 = Math.random();

        let i1 = Math.random();
        let i2 = Math.random();

        genome.getConnectionBetween(5, 0).weight = w1;
        genome.getConnectionBetween(2, 5).weight = w2;
        genome.getConnectionBetween(3, 0).weight = w3;
        genome.getConnectionBetween(2, 1).weight = w4;
        genome.getConnectionBetween(3, 1).weight = w5;
        genome.getConnectionBetween(2, 4).weight = w6;
        genome.getConnectionBetween(3, 4).weight = w7;
        genome.getConnectionBetween(3, 5).weight = w8;

        let nn = new NeuralNetwork(genome);

        let output = nn.evaluate([i1, i2]);
        let expectedOut = [modifiedSigmoid(w2*modifiedSigmoid(w1*i1) + w4*i2 + w6), modifiedSigmoid(w8*modifiedSigmoid(w1*i1) + w3*i1 + w5*i2 + w7)]

        if (output[0].toFixed(5) == expectedOut[0].toFixed(5) && output[1].toFixed(5) == expectedOut[1].toFixed(5)) {
            conditions.push(true);
        }

        else {
            conditions.push(false);
        }
    }
    let t1 = performance.now();
    try {
        if (conditions.includes(false)) throw e;   

        print_green(getFuncName() + " Passed (took " + String((t1-t0).toFixed(5)) + " ms)");
    }
    catch(err) {
        print_red(getFuncName() + " Failed (took " + String((t1-t0).toFixed(5)) + " ms)");
    }
}

