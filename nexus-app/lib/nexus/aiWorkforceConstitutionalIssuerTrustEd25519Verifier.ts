import { createPublicKey, verify as verifySignature } from "node:crypto";

export type ConstitutionalIssuerTrustEd25519VerificationFailureCode =
  | "INPUT_NOT_OBJECT"
  | "INPUT_ACCESS_FAILED"
  | "SIGNED_PAYLOAD_INVALID"
  | "PUBLIC_KEY_MATERIAL_INVALID"
  | "SIGNATURE_ENCODING_INVALID"
  | "PUBLIC_KEY_INVALID_OR_UNSUPPORTED"
  | "SIGNATURE_INVALID"
  | "VERIFICATION_FAILED";

export interface ConstitutionalIssuerTrustEd25519VerificationResult {
  readonly proofState: "CRYPTOGRAPHIC_PROOF_VALID_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalIssuerTrustEd25519VerificationFailureCode[];
  readonly verifiedAlgorithm: "Ed25519" | null;
  readonly runtimeTrustEstablished: false;
  readonly admissionProjectionAuthorized: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

const makeResult = (
  proofState: ConstitutionalIssuerTrustEd25519VerificationResult["proofState"],
  failureCodes: readonly ConstitutionalIssuerTrustEd25519VerificationFailureCode[],
  verifiedAlgorithm: "Ed25519" | null = null,
): ConstitutionalIssuerTrustEd25519VerificationResult => Object.freeze({
  proofState,
  failureCodes: Object.freeze([...failureCodes]),
  verifiedAlgorithm,
  runtimeTrustEstablished: false as const,
  admissionProjectionAuthorized: false as const,
  constitutionalExecutionAuthorityGranted: false as const,
  providerExecutionAuthorized: false as const,
  paymentExecutionAuthorized: false as const,
  legalFilingAuthorized: false as const,
  externalDeliveryAuthorized: false as const,
  publicLaunchAuthorized: false as const,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Verifies only possession of the private key corresponding to supplied
 * Ed25519 public-key material. A valid signature does NOT establish issuer
 * trust because this seam does not establish who provisioned or approved the
 * public key. Public-key provenance remains a separate owner-controlled gate.
 */
export function verifyConstitutionalIssuerTrustEd25519Proof(
  input: unknown,
): ConstitutionalIssuerTrustEd25519VerificationResult {
  try {
    if (!isRecord(input)) {
      return makeResult("REJECTED", ["INPUT_NOT_OBJECT"]);
    }

    const signedCanonicalPayload = input.signedCanonicalPayload;
    const publicKeyPem = input.publicKeyPem;
    const signatureBase64Url = input.signatureBase64Url;

    if (!isNonEmptyString(signedCanonicalPayload)) {
      return makeResult("REJECTED", ["SIGNED_PAYLOAD_INVALID"]);
    }

    if (
      !isNonEmptyString(publicKeyPem) ||
      !publicKeyPem.trim().startsWith("-----BEGIN PUBLIC KEY-----") ||
      !publicKeyPem.trim().endsWith("-----END PUBLIC KEY-----") ||
      publicKeyPem.includes("PRIVATE KEY")
    ) {
      return makeResult("REJECTED", ["PUBLIC_KEY_MATERIAL_INVALID"]);
    }

    if (
      !isNonEmptyString(signatureBase64Url) ||
      !/^[A-Za-z0-9_-]+$/.test(signatureBase64Url)
    ) {
      return makeResult("REJECTED", ["SIGNATURE_ENCODING_INVALID"]);
    }

    let publicKey;
    try {
      publicKey = createPublicKey(publicKeyPem);
      if (publicKey.asymmetricKeyType !== "ed25519") {
        return makeResult("REJECTED", ["PUBLIC_KEY_INVALID_OR_UNSUPPORTED"]);
      }
    } catch {
      return makeResult("REJECTED", ["PUBLIC_KEY_INVALID_OR_UNSUPPORTED"]);
    }

    let signature: Buffer;
    try {
      signature = Buffer.from(signatureBase64Url, "base64url");
      if (signature.length !== 64) {
        return makeResult("REJECTED", ["SIGNATURE_ENCODING_INVALID"]);
      }
    } catch {
      return makeResult("REJECTED", ["SIGNATURE_ENCODING_INVALID"]);
    }

    try {
      const valid = verifySignature(
        null,
        Buffer.from(signedCanonicalPayload, "utf8"),
        publicKey,
        signature,
      );
      return valid
        ? makeResult("CRYPTOGRAPHIC_PROOF_VALID_NO_TRUST", [], "Ed25519")
        : makeResult("REJECTED", ["SIGNATURE_INVALID"]);
    } catch {
      return makeResult("REJECTED", ["VERIFICATION_FAILED"]);
    }
  } catch {
    return makeResult("REJECTED", ["INPUT_ACCESS_FAILED"]);
  }
}