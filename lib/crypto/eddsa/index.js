const { bigInt } = require("snarkjs");
const { createHash } = require("../poseidon");
const {
    mulPointEscalar,
    Base8,
    subOrder,
    addPoint,
    inCurve,
} = require("../babyjub");
const createBlakeHash = require("blake-hash");

exports.generateKeyPair = (seed) => {
    const secretKey = bigInt.leBuff2int(seed).mod(subOrder);
    const publicKey = mulPointEscalar(Base8, secretKey);
    return {
        publicKeyX: publicKey[0].toString(10),
        publicKeyY: publicKey[1].toString(10),
        secretKey: secretKey.toString(10),
    };
};

exports.generatePubKeyFromPrivate = (secretKey) => {
    const publicKey = mulPointEscalar(Base8, bigInt(secretKey));
    return {
        publicKeyX: publicKey[0].toString(10),
        publicKeyY: publicKey[1].toString(10),
    };
};

exports.sign = (strKey, msg) => {
    const key = bigInt(strKey);
    const prv = bigInt.leInt2Buff(key, 32);

    const h1 = createBlakeHash("blake512").update(prv).digest();
    const msgBuff = bigInt.leInt2Buff(bigInt(msg), 32);
    const rBuff = createBlakeHash("blake512")
        .update(Buffer.concat([h1.slice(32, 64), msgBuff]))
        .digest();
    let r = bigInt.leBuff2int(rBuff);
    r = r.mod(subOrder);

    const A = mulPointEscalar(Base8, key);
    const R8 = mulPointEscalar(Base8, r);

    const hasher = createHash(6, 6, 52);
    const hm = hasher([R8[0], R8[1], A[0], A[1], msg]);
    const S = r.add(hm.mul(key)).mod(subOrder);

    return {
        Rx: R8[0].toString(),
        Ry: R8[1].toString(),
        s: S.toString(),
    };
};

exports.verify = (msg, sig, pubKey) => {
    const A = [bigInt(pubKey[0]), bigInt(pubKey[1])];
    const R = [bigInt(sig.Rx), bigInt(sig.Ry)];
    const S = bigInt(sig.s);

    // Check parameters
    if (!inCurve(R)) return false;
    if (!inCurve(A)) return false;
    if (S >= subOrder) return false;

    const hasher = createHash(6, 6, 52);
    const hm = hasher([R[0], R[1], A[0], A[1], bigInt(msg)]);

    const Pleft = mulPointEscalar(Base8, S);
    let Pright = mulPointEscalar(A, hm);
    Pright = addPoint(R, Pright);

    if (!Pleft[0].equals(Pright[0])) return false;
    if (!Pleft[1].equals(Pright[1])) return false;

    return true;
};
