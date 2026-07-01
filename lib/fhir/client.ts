const BASE_URL =
  process.env.FHIR_BASE_URL ?? "https://r4.smarthealthit.org";

export class FHIRClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "FHIRClientError";
  }
}

export async function fhirFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/fhir+json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new FHIRClientError(
      res.status,
      `FHIR ${res.status}: ${path}`,
    );
  }

  return res.json() as Promise<T>;
}
