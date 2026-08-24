import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyConstitutionalIssuerTrustEd25519Proof } from "../aiWorkforceConstitutionalIssuerTrustEd25519Verifier";

const createProof = () => {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const signedCanonicalPayload = "nexus-constitutional-owner-trust-decision-v1|binding-1";
  return {
    signedCanonicalPayload,
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
    privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    signatureBase64Url: sign(
      null,
      Buffer.from(signedCanonicalPayload, "utf8"),
      privateKey,
    ).toString("base64url"),
  };
};

describe("constitutional issuer trust Ed25519 verifier", () => {
  it("verifies a valid Ed25519 proof without establishing runtime trust", () => {
    const proof = createProof();
    const value = verifyConstitutionalIssuerTrustEd25519Proof(proof);
    expect(value.proofState).toBe("CRYPTOGRAPHIC_PROOF_VALID_NO_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.verifiedAlgorithm).toBe("Ed25519");
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.admissionProjectionAuthorized).toBe(false);
    expect(value.constitutionalExecutionAuthorityGranted).toBe(false);
    expect(value.providerExecutionAuthorized).toBe(false);
    expect(value.paymentExecutionAuthorized).toBe(false);
    expect(value.legalFilingAuthorized).toBe(false);
    expect(value.externalDeliveryAuthorized).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });

  it("rejects a tampered payload", () => {
    const proof = createProof();
    const value = verifyConstitutionalIssuerTrustEd25519Proof({
      ...proof,
      signedCanonicalPayload: `${proof.signedCanonicalPayload}|tampered`,
    });
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["SIGNATURE_INVALID"]);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects private-key material at the public-key boundary", () => {
    const proof = createProof();
    const value = verifyConstitutionalIssuerTrustEd25519Proof({
      ...proof,
      publicKeyPem: proof.privateKeyPem,
    });
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["PUBLIC_KEY_MATERIAL_INVALID"]);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("fails closed when an untrusted input getter throws", () => {
    const hostile = Object.defineProperty({}, "signedCanonicalPayload", {
      enumerable: true,
      get() {
        throw new Error("hostile getter");
      },
    });
    const value = verifyConstitutionalIssuerTrustEd25519Proof(hostile);
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["INPUT_ACCESS_FAILED"]);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.admissionProjectionAuthorized).toBe(false);
  });
});