// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('ava');

const Attacks = require("../attacks");


test('GenerateData', t => {

    const threat = Attacks.generateData();

	t.truthy( threat.key );
	t.true( threat.ip.split(".").length === 4 ); 
	t.true( threat.virus instanceof Array );
	t.true( typeof threat.owner === "string" );
	t.true( typeof threat.function === "string" );
	t.true( typeof threat.dataCount === "number" );
	t.true( threat.coordinates instanceof Array );
	t.true( typeof threat.coordinates[0] === "number" );
	t.true( typeof threat.coordinates[1] === "number" );
});

test('unqiueKeys', t => {

    const keys = {};

    // test further ?
    for (let i = 0; i < 1000; i++) {

        const {key} = Attacks.generateData();

        if ( keys[key] ) t.fail( `Dublicate key found '${key}'` );

        keys[key] = true;
    }

    t.pass();
});